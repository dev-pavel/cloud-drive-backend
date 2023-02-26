import {IUser} from "../interfaces/interfaces";

class ProfileDTO {
    firstName: string;
    lastName: string;
    email: string;
    registrationDate: Date;
    memoryLimit: number;
    usedMemory: number;

    constructor(user: IUser) {
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.registrationDate = user.registrationDate;
        this.memoryLimit = user.memoryLimit;
        this.usedMemory = user.usedMemory;
    }
}

export default ProfileDTO;