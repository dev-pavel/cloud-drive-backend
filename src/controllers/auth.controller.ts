import {Request, Response} from "express";
import AuthService, {ILoginData, IRegData} from "../services/auth.service";
import RootController from "./basic.controller";

class AuthController extends RootController {
    private authService: AuthService;

    constructor() {
        super();
        this.authService = new AuthService();
    }

    login = async (req: Request<{}, ILoginData>, res: Response): Promise<void> => {
        try {
            const login = await this.authService.login(req.body)

            res.send(login)
        } catch (e) {
            this.sendServerError(res, e)
        }
    }

    registration = async (req: Request<{}, IRegData>, res: Response): Promise<void> => {
        try {
            const registration = await this.authService.registration(req.body)

            res.send(registration)
        } catch (e) {
            this.sendServerError(res, e)
        }
    }

    refresh = async (req: Request<{}, { refreshToken: string }>, res: Response): Promise<void> => {
        try {
            const refresh = await this.authService.refresh(req.body.refreshToken)

            res.send(refresh)
        } catch (e) {
            this.sendServerError(res, e)
        }
    }
}

export default AuthController