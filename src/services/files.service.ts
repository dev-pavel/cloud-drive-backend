import {FileTypes, IFile, ServiceResponse} from "../interfaces/interfaces";
import File from "../models/File";
import * as fs from "fs";
import archiver from "archiver";
import path from "path";
import {FileArray, UploadedFile} from "express-fileupload";
import FileDTO from "../dto/file.dto";

class FilesService {
    private staticPath = path.resolve(__dirname, '../../static')

    private checkFileExisting = async (path: string): Promise<boolean> => {
        try {
            await fs.promises.access(path)
            return true
        } catch (e) {
            return false
        }
    }

    private sortFiles = (file: IFile): number => +(file.type === FileTypes.FOLDER)

    private saveFile = async (file: UploadedFile, path: string, userId: string, parentId?: string): Promise<void> => {
        const basePath = `${this.staticPath}/${userId}${path ? '/' : ''}${path}`;

        const dbFile = await new File({
            name: file.name,
            type: FileTypes.FILE,
            size: file.size,
            path: path ? `${path}/${file.name}` : file.name,
            userId,
            parentId: parentId
        }).save();

        if (parentId) {
            await File.updateOne({_id: parentId}, {
                $push: {children: dbFile._id},
                $inc: {size: file.size}
            });
        }

        await file.mv(`${basePath}/${file.name}`);
    }

    getUserFolderFiles = async (userId: string, folderId = ''): Promise<ServiceResponse> => {
        try {
            if (folderId) {
                const parentFolder = await File.findOne({userId, _id: folderId})

                if (parentFolder) {
                    const files = await File.find({userId, _id: parentFolder.children})
                    files.sort(this.sortFiles)

                    return {success: true, result: files.map(file => new FileDTO(file))}
                } else {
                    throw new Error('folder doesnt exists')
                }
            } else {
                const files = await File.find({userId, parentId: null})
                files.sort(this.sortFiles)

                return {success: true, result: files.map(file => new FileDTO(file))}
            }
        } catch (e) {
            return {success: false, error: e}
        }
    }

    downloadFiles = async (userId: string, fileIds: string[]): Promise<ServiceResponse> => {
        try {
            const files = await File.find({_id: fileIds})

            if (files) {
                const canDownload = files.every(file => file.userId.toString() === userId)

                if (canDownload) {
                    const archive = archiver('zip', {zlib: {level: 9}});
                    const basePath = `${this.staticPath}/${userId}`

                    await Promise.all(files.map(file => {
                        if (file.type === FileTypes.FILE) {
                            return archive.append(
                                fs.createReadStream(basePath + '/' + file.path),
                                {name: file.name}
                            )
                        } else if (file.type === FileTypes.FOLDER) {
                            return archive.directory(basePath + '/' + file.path, false)
                        }
                    }))

                    await archive.finalize();

                    return {success: true, result: archive}
                } else {
                    throw new Error('access denied')
                }
            } else {
                throw new Error('files not found')
            }
        } catch (e) {
            return {success: false, error: e}
        }
    }

    createFolder = async (name: string, userId: string, parentFolderId?: string): Promise<ServiceResponse> => {
        try {
            let basePath = `${this.staticPath}/${userId}`
            let parentFolderPath = ''

            if (parentFolderId) {
                const parentFolder = await File.findOne({userId, _id: parentFolderId})

                if (parentFolder) {
                    parentFolderPath = parentFolder.path
                    basePath += `/${parentFolder.path}`
                } else {
                    throw new Error('parent folder doesnt exists')
                }
            }

            const newFolderPath = `${basePath}/${name}`
            const isFolderExists = await this.checkFileExisting(newFolderPath)

            if (!isFolderExists) {
                const file = await new File({
                    name,
                    type: FileTypes.FOLDER,
                    path: `${parentFolderPath}/${name}`,
                    userId,
                    parentId: parentFolderId
                }).save()

                if (parentFolderId) {
                    await File.updateOne({_id: parentFolderId}, {$push: {children: file._id}})
                }

                await fs.promises.mkdir(newFolderPath)

                return {success: true}
            } else {
                throw new Error('folder with same name already exists')
            }
        } catch (e) {
            return {success: false, error: e}
        }
    }

    deleteFile = async (userId: string, fileId: string): Promise<ServiceResponse<{ freedMemory: number }>> => {
        try {
            const file = await File.findOne({userId, _id: fileId})

            if (file) {
                const path = `${this.staticPath}/${userId}/${file.path}`
                const files: IFile[] = await File.aggregate([
                    {
                        $graphLookup: {
                            from: "File",
                            startWith: "$parentId",
                            connectFromField: "parentId",
                            connectToField: "_id",
                            as: "hierarchy"
                        }
                    },
                    {
                        $match: {
                            $or: [
                                {"hierarchy._id": fileId},
                                {_id: fileId}
                            ]
                        }
                    }
                ])

                await Promise.all(files.map(file => {
                    if (file.parentId) {
                        return Promise.all([
                            File.deleteOne({_id: file._id}),
                            File.updateOne({_id: file.parentId},
                                {
                                    $pull: {children: file._id},
                                    $inc: {size: -file.size}
                                }
                            )
                        ])
                    } else {
                        return File.deleteOne({_id: file._id})
                    }
                }))

                await fs.promises.rm(path)

                return {success: true, result: {freedMemory: file.size}}
            } else {
                throw new Error('file or folder doesnt exists')
            }
        } catch (e) {
            return {success: false, error: e}
        }
    }

    uploadFiles = async (filesArray: FileArray, userId: string, folderId?: string)
        : Promise<ServiceResponse<{ busyMemory: number }>> => {
        try {
            let parentFolderPath = '';
            let busyMemory = 0;

            if (folderId) {
                const folder = await File.findOne({userId, _id: folderId})

                if (folder) {
                    parentFolderPath = folder.path
                } else {
                    throw new Error('folder doesnt exists')
                }
            }

            if (Array.isArray(filesArray.files)) {
                await Promise.all(filesArray.files.map(file => {
                    busyMemory += file.size
                    return this.saveFile(file, parentFolderPath, userId, folderId)
                }));
            } else if (filesArray.files.name) {
                busyMemory += filesArray.files.size
                await this.saveFile(filesArray.files, parentFolderPath, userId, folderId)
            } else {
                throw new Error('incorrect files input type');
            }

            return {success: true, result: {busyMemory}};
        } catch (e) {
            return {success: false, error: e};
        }
    }
}

export default FilesService;