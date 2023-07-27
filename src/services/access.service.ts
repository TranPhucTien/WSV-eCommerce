import shopModule from "../models/shop.module";
import bcrypt from "bcrypt"
import crypto from "node:crypto"
import KeyTokenService from "./keyToken.service";
import {createTokenPair} from "../auth/authUtils";
import {getInfoData} from "../utils"
import {AuthFailureError, BadRequestError, NotFoundError} from "../core/error.response";
import ShopService from "./shop.service";
import ShopModule from "../models/shop.module";

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {
    static login = async ({email, password, refreshToken = null} : {email: string, password: string, refreshToken: string | null}) => {
        // 1. Check email in db
        const foundShop = await ShopService.findByEmail({email});
        if (!foundShop) {
            throw new NotFoundError("Shop not exits")
        }

        // 2. match password
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) {
            throw new AuthFailureError("Authenticate error");
        }

        // 3. create access token and refresh token
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        // 4. generate token
        const tokens = await createTokenPair({userId: foundShop._id, email}, publicKey, privateKey);
        await KeyTokenService.createKeyToken({
            userId: foundShop._id.toString(),
            publicKey,
            privateKey,
            refreshToken: tokens.refreshToken
        })

        const shopFields = ['_id', 'name', 'email'];

        // 5. get data return login
        return {
            shop: getInfoData({fields: shopFields, object: foundShop}),
            tokens
        }
    }

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
            userId: newShop._id.toString(),
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
            shop: getInfoData({fields: shopFields, object: newShop}),
            tokens
        }
    }
}

export default AccessService