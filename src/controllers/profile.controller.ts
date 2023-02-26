import Controller from "./root.controller";
import {Request, Response} from "express";
import ProfileService from "../services/profile.service";
import {IUser} from "../interfaces/interfaces";

class ProfileController extends Controller {
    profileService: ProfileService;

    constructor() {
        super();
        this.profileService = new ProfileService();
    }

    getProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const {userId} = this.getUserTokenData(req);
            const profile = await this.profileService.getProfile(userId);

            res.send(profile);
        } catch (e) {
            this.sendServerErrorResp(res, e);
        }
    }

    updateProfile = async (req: Request<{}, { userData: Partial<IUser> }>, res: Response): Promise<void> => {
        try {
            const {userId} = this.getUserTokenData(req);
            const update = await this.profileService.updateProfile(req.body.userData, userId);

            res.send(update);
        } catch (e) {
            this.sendServerErrorResp(res, e);
        }
    }

    deleteProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const {userId} = this.getUserTokenData(req);
            const deleteProfile = await this.profileService.deleteProfile(userId);

            res.send(deleteProfile);
        } catch (e) {
            this.sendServerErrorResp(res, e);
        }
    }
}

export default ProfileController;