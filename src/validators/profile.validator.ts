import {body, ValidationChain} from "express-validator";
import BasicValidator from "./basic.validator";

class ProfileValidator extends BasicValidator {

    get updateProfile() {
        return [
            body('userData').notEmpty(),
            this.checkErrors
        ]
    }
}

export default ProfileValidator;