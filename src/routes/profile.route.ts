import express from "express";
import ProfileController from "../controllers/profile.controller";
import JWTGuard from "../middlewares/jwt-guard.middleware";
import ProfileValidator from "../validators/profile.validator";

const router = express.Router();
const profileController = new ProfileController();
const jwtGuard = new JWTGuard();
const profileValidator = new ProfileValidator();

router.get('/', jwtGuard.checkJWT, profileController.getProfile);
router.put('/', jwtGuard.checkJWT, profileValidator.updateProfile, profileController.updateProfile);
router.delete('/', jwtGuard.checkJWT, profileController.deleteProfile);

export default router;