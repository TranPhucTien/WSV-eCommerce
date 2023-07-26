import {model, Schema} from "mongoose";

const DOCUMENT_NAME = "Key"
const COLLECTION_NAME = "Keys"

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
    refreshToken: {
        type: Array,
        default: []
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

export default model(DOCUMENT_NAME, keyTokenScheme)