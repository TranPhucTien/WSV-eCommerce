import keyTokenModule from "../models/keyToken.module";
import {Types} from "mongoose";

export interface IKeyTokenPayload {
    userId: string,
    publicKey: string,
    privateKey: string,
    refreshToken?: string | null
}

class KeyTokenService {

    static createKeyToken = async ({
                                       userId,
                                       publicKey,
                                       privateKey,
                                       refreshToken
                                   }: IKeyTokenPayload): Promise<string | null> => {
        try {
            const filter = {user: new Types.ObjectId(userId)};
            const update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken
            }
            const options = {upsert: true, new: true}

            const tokens = await keyTokenModule.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (e) {
            return (e as Error).message;
        }
    }

    static findByUserId = async (userId: string) => {
        return await keyTokenModule.findOne({user: new Types.ObjectId(userId)}).lean().exec();
    }

    static removeKeyById = async (id: string) => {
        return await keyTokenModule.findOneAndRemove(new Types.ObjectId(id)).exec();
    }
}

export default KeyTokenService