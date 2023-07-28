import {NextFunction, Request, Response} from "express";
import AccessService from "../services/access.service";
import {CREATED, OK} from "../core/success.response";
import accessService from "../services/access.service";

class AccessController {
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