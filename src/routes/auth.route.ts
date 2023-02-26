import express from "express";
import AuthController from "../controllers/auth.controller";
import AuthValidator from "../validators/auth.validator";

const router = express.Router()
const authController = new AuthController()
const authValidator = new AuthValidator()

router.post('/login', authValidator.login, authController.login)
router.post('/registration', authValidator.registration, authController.registration)
router.post('/refresh', authValidator.refresh, authController.refresh)

export default router