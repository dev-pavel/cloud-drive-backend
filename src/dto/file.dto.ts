import {FileTypes, IFile} from "../interfaces/interfaces";
import {ObjectId} from "mongoose";

class FileDTO {
    fileId: string;
    name: string;
    uploadDate: Date;
    type: FileTypes;
    path: string;
    children: ObjectId[];

    constructor(file: IFile) {
        this.fileId = file._id;
        this.name = file.name;
        this.uploadDate = file.uploadDate;
        this.type = file.type;
        this.path = file.path;
        this.children = file.children;
    }
}

export default FileDTO