import {body, ValidationChain} from "express-validator";

class ProfileValidator {

    updateProfile(): ValidationChain[] {
        return [
            body('userData').notEmpty()
        ]
    }
}

export default ProfileValidator;