import {ObjectId, Document} from "mongoose";

export interface ServiceResponse<R = any, E = any> {
    success: boolean
    result?: R
    error?: E
}

export interface IUser {
    email: string
    password: string
    firstName: string
    lastName: string
    registrationDate: Date
    memoryLimit: number
    usedMemory: number
}

export interface IUserToken {
    email: string
    userId: string
}

export enum FileTypes {
    FOLDER = 'FOLDER',
    FILE = 'FILE'
}

export interface IFile extends Document {
    name: string
    size: number
    uploadDate: Date
    type: FileTypes
    path: string
    userId: ObjectId
    parentId: ObjectId | null
    children: ObjectId[] | []
}