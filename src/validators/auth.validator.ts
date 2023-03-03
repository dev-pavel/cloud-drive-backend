import {body} from "express-validator";
import BasicValidator from "./basic.validator";

class AuthValidator extends BasicValidator {
    get login() {
        return [
            body('email').isEmail(),
            body('password').isString(),
            this.checkErrors
        ]
    }

    get registration() {
        return [
            body('email').isEmail(),
            body('password').isString(),
            body('firstName').isString(),
            body('lastName').isString(),
            this.checkErrors
        ]
    }

    get refresh() {
        return [
            body('refreshToken').isString(),
            this.checkErrors
        ]
    }
}

export default AuthValidator