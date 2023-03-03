import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import BasicController from "../controllers/basic.controller";

class BasicValidator {
    basicController: BasicController;
    constructor() {
        this.basicController = new BasicController();
    }

    checkErrors = (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            this.basicController.sendCustomError(res, 'Invalid request body', 400);
        }

        next();
    }
}

export default BasicValidator;