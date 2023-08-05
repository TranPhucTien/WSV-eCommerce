import {NextFunction, Request, Response} from "express";
import accessService from "../services/access.service";
import {CREATED, OK} from "../core/success.response";

class AccessController {

    handlerRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        // v1
        // new OK({
        //     message: "get token success",
        //     metadata: await accessService.handlerRefreshToken(req.body.refreshToken)
        // }).send(res)

        // v2 fix, no need access token
        new OK({
            message: "get token success",
            metadata: await accessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        new OK({
            message: "logout success",
            metadata: await accessService.logout({keyStore: req.keyStore})
        }).send(res)
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        new OK({
            message: "Login success",
            metadata: await accessService.login(req.body)
        }).send(res)
    }

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: "Registered success",
            metadata: await accessService.signUp(req.body)
        }).send(res)
    }
}

export default new AccessController()