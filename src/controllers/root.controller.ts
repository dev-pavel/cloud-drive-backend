import jwt from "jsonwebtoken";
import {IUserToken, ServiceResponse} from "../interfaces/interfaces";
import {Request, Response} from "express";

class Controller {
    private serverErrorStatusCode = 500;

    getUserTokenData(req: Request): IUserToken {
        return jwt.decode(req.headers.authorization!) as IUserToken;
    }

    sendServerErrorResp(res: Response<ServiceResponse>, error: any): void {
        res.status(this.serverErrorStatusCode).json({success: false, error});
    }
}

export default Controller;