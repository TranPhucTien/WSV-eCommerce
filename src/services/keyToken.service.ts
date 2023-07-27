import crypto from "crypto";
import keyTokenModule from "../models/keyToken.module";
import { Types } from "mongoose";

interface IKeyToken {
    userId: string,
    publicKey: string,
    privateKey: string,
    refreshToken?: string | null
}

class KeyTokenService {

    static  createKeyToken = async  ({ userId, publicKey, privateKey, refreshToken }: IKeyToken) : Promise<string | null> => {
        try {
            const filter = {user: new Types.ObjectId(userId)};
            const update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken
            }
            const options = { upsert: true, new: true }

            const tokens = await keyTokenModule.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (e) {
            return (e as Error).message;
        }
    }
}

export default KeyTokenService