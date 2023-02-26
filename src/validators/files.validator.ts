import {body, param, ValidationChain} from "express-validator";

class FilesValidator {

    download(): ValidationChain[] {
        return [
            body('fileIds')
                .custom(fileIds => Array.isArray(fileIds) && fileIds?.every(fileId => typeof fileId === "string"))
        ]
    }

    createFolder(): ValidationChain[] {
        return [
            body('name').isString(),
            body('parentFolderId')
                .custom(parentFolderId => !parentFolderId || typeof parentFolderId === "string")
        ]
    }

    uploadFiles(): ValidationChain[] {
        return [
            body('folderId').custom(folderId => !folderId || typeof folderId === "string"),
        ]
    }

    deleteFile(): ValidationChain[] {
        return [
            param('fileId').isString()
        ]
    }
}

export default FilesValidator