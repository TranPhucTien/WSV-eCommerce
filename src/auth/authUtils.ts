import JWT from "jsonwebtoken";
import { Types } from "mongoose"

const createTokenPair = async (payload: {userId: Types.ObjectId, email: string}, publicKey: JWT.Secret, privateKey: JWT.Secret) => {
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

    }
}

export {
    createTokenPair
}