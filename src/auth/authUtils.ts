import JWT from "jsonwebtoken";
import { Types } from "mongoose"
import {NextFunction, Request, Response} from "express";
import asyncHandler from "../helpers/asyncHandler";
import {AuthFailureError, NotFoundError} from "../core/error.response";
import KeyTokenService, {IKeyTokenPayload} from "../services/keyToken.service";

interface ITokenPair {
    accessToken: string | null,
    refreshToken: string | null
}

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id'
}

const createTokenPair = async (payload: {userId: Types.ObjectId, email: string}, publicKey: JWT.Secret, privateKey: JWT.Secret) : Promise<ITokenPair> => {
    try {
        // access token
        const accessToken = JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log(`error verify::`, err)
            } else {
                console.log(`decode verify::`, decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (e) {
        return { accessToken: null, refreshToken: null }
    }
}

const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Check userId missing
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
        throw new NotFoundError("Not found userId");
    }

    // 2. get access token
    const keyStore = await KeyTokenService.findByUserId(userId as string);
    if (!keyStore) {
        throw new NotFoundError("Not found keystore");
    }

    // 3. verify token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    if (!accessToken) {
        throw new AuthFailureError("Not authorization");
    }

    try {
        // 4. check user in dbs
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== (decodeUser as IKeyTokenPayload).userId) {
            throw new AuthFailureError("Invalid Request");
        }

        // 5. check key store with this userId
        req.keyStore = keyStore;
        req.user = decodeUser; // {userId, email}

        // 6. Ok all
        return next()
    } catch (e) {
        throw e
    }
})

const verifyJWT = (token: string, keySecret: string)=> {
    return JWT.verify(token, keySecret);
}

export {
    createTokenPair,
    authentication,
    verifyJWT
}