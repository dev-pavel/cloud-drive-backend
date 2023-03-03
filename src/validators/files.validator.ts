import {body, param} from "express-validator";
import BasicValidator from "./basic.validator";

class FilesValidator extends BasicValidator {

    get download() {
        return [
            body('fileIds')
                .custom(fileIds => Array.isArray(fileIds) && fileIds?.every(fileId => typeof fileId === "string")),
            this.checkErrors
        ]
    }

    get createFolder() {
        return [
            body('name').isString(),
            body('parentFolderId')
                .custom(parentFolderId => !parentFolderId || typeof parentFolderId === "string"),
            this.checkErrors
        ]
    }

    get uploadFiles() {
        return [
            body('folderId').custom(folderId => !folderId || typeof folderId === "string"),
            this.checkErrors
        ]
    }

    get deleteFile() {
        return [
            param('fileId').isString(),
            this.checkErrors
        ]
    }
}

export default FilesValidator