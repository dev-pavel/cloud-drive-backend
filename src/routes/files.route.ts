import express from "express";
import FilesController from "../controllers/files.controller";
import JWTGuard from "../middlewares/jwt-guard.middleware";
import FilesValidator from "../validators/files.validator";

const router = express.Router();
const filesController = new FilesController();
const jwtGuard = new JWTGuard();
const filesValidator = new FilesValidator();

router.get('/:folderId', jwtGuard.checkJWT, filesController.getFiles);
router.post('/download', jwtGuard.checkJWT, filesValidator.download, filesController.downloadFiles);
router.post('/folder', jwtGuard.checkJWT, filesValidator.createFolder, filesController.createFolder);
router.post('/upload', jwtGuard.checkJWT, filesValidator.uploadFiles, filesController.uploadFiles);
router.delete('/:fileId', jwtGuard.checkJWT, filesValidator.deleteFile, filesController.deleteFile);

export default router