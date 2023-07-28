import {model, Schema, Types} from "mongoose";

const DOCUMENT_NAME = "Key"
const COLLECTION_NAME = "Keys"

export interface IKeyToken {
    _id: Types.ObjectId,
    user: Types.ObjectId,
    publicKey: string,
    privateKey: string,
    refreshTokensUsed: string[],
    refreshToken: string,
    createdAt?: Date,
    updatedAt?: Date
}

const keyTokenScheme = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true,
    },
    privateKey: {
        type: String,
        required: true,
    },
    refreshTokensUsed: {
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

export default model<IKeyToken>(DOCUMENT_NAME, keyTokenScheme)