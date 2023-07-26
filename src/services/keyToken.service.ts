import crypto from "crypto";
import keyTokenModule from "../models/keyToken.module";
import { Types } from "mongoose";

class KeyTokenService {

    static  createKeyToken = async  ({ userId, publicKey, privateKey }: { userId: Types.ObjectId, publicKey: string, privateKey: string}) : Promise<string | null> => {
        try {
            const tokens = await keyTokenModule.create({
                user: userId,
                publicKey,
                privateKey
            })

            return tokens ? tokens.publicKey : null;
        } catch (e) {
            return (e as Error).message;
        }
    }
}

export default KeyTokenService