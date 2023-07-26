import {Error} from "mongoose";
import shopModule from "../models/shop.module";
import bcrypt from "bcrypt"
import crypto from "node:crypto"
import KeyTokenService from "./keyToken.service";
import {createTokenPair} from "../auth/authUtils";
import { getInfoData } from "../utils"

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {
    static signUp = async ({name, email, password}: { name: string, email: string, password: string }) => {
        try {
            // step 1: check email exits?
            const holderShop = await shopModule.findOne({email}).lean();

            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already registered!'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModule.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                console.log({privateKey, publicKey}) // save collection KeyStore

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'keyStore error'
                    }
                }

                // created token pair
                const tokens = await createTokenPair(
                    {
                        userId: newShop._id,
                        email
                    }, publicKey, privateKey);
                console.log(`Created Token Success::`, tokens)
                const shopFields = ['_id', 'name', 'email'];

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: shopFields, object: newShop}),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }
        } catch (e) {
            return {
                code: "xxx",
                message: (e as Error).message,
                status: 'error'
            }
        }
    }
}

export default AccessService