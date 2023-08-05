import shopModule from "../models/shop.module";
import bcrypt from "bcrypt"
import crypto from "node:crypto"
import KeyTokenService from "./keyToken.service";
import keyTokenService, {IKeyTokenPayload} from "./keyToken.service";
import {createTokenPair, verifyJWT} from "../auth/authUtils";
import {getInfoData} from "../utils"
import {AuthFailureError, BadRequestError, ForBiddenError, NotFoundError} from "../core/error.response";
import ShopService from "./shop.service";
import shopService from "./shop.service";
import keyTokenModule, {IKeyToken} from "../models/keyToken.module";
import {IPayloadTokenPair} from "../interfaces/payload.interface"
import {Model, Types, Document} from "mongoose";

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

interface IRefreshTokenPayload {
    refreshToken: string;
    user: IPayloadTokenPair
    keyStore: Document<unknown, {}, IKeyToken> & IKeyToken & Required<{_id: Types.ObjectId}>
}

class AccessService {

    static handlerRefreshTokenV2 = async ({refreshToken, user, keyStore} : IRefreshTokenPayload) => {
        const {userId, email} = user;

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForBiddenError("Something wrong happen, please relogin")
        }

        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError("Shop not registered");
        }

        // check userId
        const foundShop = await shopService.findByEmail({email: email as string});
        if (!foundShop) {
            throw new AuthFailureError("Shop not registered");
        }

        // create new token
        const tokens = await createTokenPair({
            userId: new Types.ObjectId(userId),
            email
        }, keyStore.publicKey, keyStore.privateKey);

        await (keyStore).updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            user: {userId, email},
            tokens
        }
    }

    // static handlerRefreshToken = async (refreshToken: string) => {
    //     // Check this token used
    //     const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    //     if (foundToken) {
    //         // decode xem la thang nao
    //         const {userId, email} = await verifyJWT(refreshToken, foundToken.privateKey) as IKeyTokenPayload;
    //         console.log({userId, email})
    //         // xoa tat ca key token trong store
    //         await keyTokenService.deleteKeyById(userId);
    //         throw new ForBiddenError("Some thing wrong happen! please login")
    //     }
    //
    //     const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    //     if (!holderToken) {
    //         throw new AuthFailureError("Shop not registered");
    //     }
    //
    //     // verify token
    //     const {userId, email} = await verifyJWT(refreshToken, holderToken.privateKey) as IPayloadTokenPair;
    //     console.log({userId, email})
    //     // check userId
    //     const foundShop = await shopService.findByEmail({email: email as string});
    //     if (!foundShop) {
    //         throw new AuthFailureError("Shop not registered");
    //     }
    //
    //     // create new token
    //     const tokens = await createTokenPair({
    //         userId: new Types.ObjectId(userId),
    //         email
    //     }, holderToken.publicKey, holderToken.privateKey);
    //
    //     // update token
    //     await holderToken.updateOne({
    //         $set: {
    //             refreshToken: tokens.refreshToken
    //         },
    //         $addToSet: {
    //             refreshTokensUsed: refreshToken
    //         }
    //     })
    //
    //     return {
    //         user: {userId, email},
    //         tokens
    //     }
    // }

    static logout = async ({keyStore}: { keyStore: IKeyToken }) => {
        const delKey = await keyTokenService.removeKeyById(keyStore._id.toString());
        return {delKey};
    }


    static login = async ({email, password, refreshToken = null}: {
        email: string,
        password: string,
        refreshToken: string | null
    }) => {
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