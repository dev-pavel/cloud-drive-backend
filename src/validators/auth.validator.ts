import {body, ValidationChain} from "express-validator";

class AuthValidator {

    login(): ValidationChain[] {
        return [
            body('email').isEmail(),
            body('password').isString()
        ]
    }

    registration(): ValidationChain[] {
        return [
            body('email').isEmail(),
            body('password').isString(),
            body('firstName').isString(),
            body('lastName').isString()
        ]
    }

    refresh(): ValidationChain[] {
        return [body('refreshToken').isString()]
    }
}

export default AuthValidator