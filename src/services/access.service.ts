import shopModule from "../models/shop.module";
import bcrypt from "bcrypt"
import crypto from "node:crypto"
import KeyTokenService from "./keyToken.service";
import {createTokenPair} from "../auth/authUtils";
import {getInfoData} from "../utils"
import {BadRequestError, NotFoundError} from "../core/error.response";

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {
    static signUp = async ({name, email, password}: { name: string, email: string, password: string }) => {
        // step 1: check email exits?
        const holderShop = await shopModule.findOne({email}).lean();

        if (holderShop) {
            throw new BadRequestError("Error: Shop already registered")
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newShop = await shopModule.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (!newShop) {
            throw new NotFoundError("Error: Create shop failed")
        }

        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        console.log({privateKey, publicKey}) // save collection KeyStore

        const keyStore = await KeyTokenService.createKeyToken({
            userId: newShop._id,
            publicKey,
            privateKey
        })

        if (!keyStore) {
            throw new NotFoundError("Error: Key store not found")
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
                shop: getInfoData({fields: shopFields, object: newShop}),
                tokens
            }
        }
    }
}

export default AccessService