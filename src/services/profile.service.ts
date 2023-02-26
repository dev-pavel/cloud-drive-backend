import {IUser, ServiceResponse} from "../interfaces/interfaces";
import User from "../models/User";
import ProfileDTO from "../dto/profile.dto";
import {FileArray, UploadedFile} from "express-fileupload";
import {UpdateQuery} from "mongoose";

class ProfileService {

    getProfile = async (userId: string): Promise<ServiceResponse> => {
        try {
            const user = await User.findById(userId);

            if (!user) {
                throw new Error('user doesnt exists');
            }

            return {success: true, result: {profile: new ProfileDTO(user)}};
        } catch (e) {
            return {success: false, error: e};
        }
    }

    updateProfile = async (userData: Partial<IUser> | UpdateQuery<IUser>, userId: string): Promise<ServiceResponse> => {
        try {
            await User.updateOne({_id: userId}, userData);

            return {success: true};
        } catch (e) {
            return {success: false, error: e};
        }
    }

    deleteProfile = async (userId: string): Promise<ServiceResponse> => {
        try {
            await User.deleteOne({_id: userId});

            return {success: true};
        } catch (e) {
            return {success: false, error: e};
        }
    }

    canUploadFiles = async (files: FileArray, userId: string): Promise<ServiceResponse> => {
        try {
            let filesSize = 0;
            const user = await User.findById(userId).select('memoryLimit usedMemory')

            if(!user) {
                throw new Error('user doesnt exists')
            }

            if (Array.isArray(files.files)) {
                files.files.forEach((file: UploadedFile) => filesSize += file.size)
            } else if (files.files.name) {
                filesSize += files.files.size;
            } else {
                throw new Error('files not provided')
            }

            const canUpload = user.memoryLimit - user.usedMemory - filesSize >= 0

            return {success: true, result: {canUpload}}
        } catch (e) {
            return {success: false, error: e};
        }
    }
}

export default ProfileService;