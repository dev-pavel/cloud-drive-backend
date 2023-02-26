import {Request, Response} from "express";
import FilesService from "../services/files.service";
import RootController from "./root.controller";
import ProfileService from "../services/profile.service";

class FilesController extends RootController {
    private filesService: FilesService;
    private profileService: ProfileService;
    private downloadArchiveName = 'cloud-drive-files.zip';

    constructor() {
        super()
        this.filesService = new FilesService();
        this.profileService = new ProfileService();
    }

    getFiles = async (req: Request<{ folderId?: string }>, res: Response): Promise<void> => {
        try {
            const {userId} = this.getUserTokenData(req)
            const files = await this.filesService.getUserFolderFiles(userId, req.params.folderId)

            res.send(files)
        } catch (e) {
            this.sendServerErrorResp(res, e)
        }
    }

    downloadFiles = async (req: Request<{}, { fileIds: string[] }>, res: Response): Promise<void> => {
        try {
            const {userId} = this.getUserTokenData(req)
            const download = await this.filesService.downloadFiles(userId, req.body.fileIds)

            if (download.success) {
                res.attachment(this.downloadArchiveName);
                download.result.pipe(res)
            } else {
                res.send(download)
            }
        } catch (e) {
            this.sendServerErrorResp(res, e)
        }
    }

    createFolder = async (req: Request<{}, { name: string, parentFolderId?: string }>, res: Response): Promise<void> => {
        try {
            const {userId} = this.getUserTokenData(req)
            const createFolder = await this.filesService.createFolder(req.body.name, userId, req.body.parentFolderId)

            res.send(createFolder)
        } catch (e) {
            this.sendServerErrorResp(res, e)
        }
    }

    deleteFile = async (req: Request<{ fileId: string }>, res: Response): Promise<void> => {
        try {
            const {userId} = this.getUserTokenData(req);
            const deleteFile = await this.filesService.deleteFile(userId, req.params.fileId)

            if (deleteFile.success && deleteFile.result) {
                await this.profileService.updateProfile(
                    {$inc: {usedMemory: -deleteFile.result.freedMemory}},
                    userId
                )
            } else {
                res.send(deleteFile)
            }
        } catch (e) {
            this.sendServerErrorResp(res, e)
        }
    }

    uploadFiles = async (req: Request<{}, { folderId?: string }>, res: Response): Promise<void> => {
        try {
            const {userId} = this.getUserTokenData(req);
            const canUpload = await this.profileService.canUploadFiles(req.files!, userId);

            if (canUpload.result.canUpload) {
                const upload = await this.filesService.uploadFiles(req.files!, userId, req.body.folderId);

                if (upload.success && upload.result) {
                    const updateProfile = await this.profileService.updateProfile(
                        {$inc: {usedMemory: upload.result.busyMemory}},
                        userId
                    )

                    res.send(updateProfile);
                } else {
                    res.send(upload);
                }
            } else {
                res.send(canUpload);
            }
        } catch (e) {
            this.sendServerErrorResp(res, e);
        }
    }
}

export default FilesController