import {Schema, model} from 'mongoose';
import {FileTypes, IFile} from "../interfaces/interfaces";

const fileSchema = new Schema<IFile>({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        default: 0
    },
    uploadDate: {
        type: Date,
        default: Date.now()
    },
    type: {
        enum: Object.values(FileTypes),
    },
    path: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'File',
        default: null
    },
    children: [
        {
            type: Schema.Types.ObjectId,
            ref: 'File'
        }
    ],
});

export default model<IFile>('File', fileSchema);