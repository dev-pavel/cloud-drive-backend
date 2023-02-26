import {Schema, model} from 'mongoose';
import {IUser} from "../interfaces/interfaces";

const userSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    memoryLimit: {
        type: Number,
        default: Number(process.env.MEMORY_LIMIT) || 1024 ** 3
    },
    usedMemory: {
        type: Number,
        default: 0
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    }
});

export default model<IUser>('User', userSchema);