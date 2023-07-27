import {NextFunction, Request, Response} from "express";
import AccessService from "../services/access.service";
import {CREATED} from "../core/success.response";
import accessService from "../services/access.service";

class AccessController {

    signUp = async (req: Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: "Registered success",
            metadata: await accessService.signUp(req.body)
        }).send(res)
    }
}

export default new AccessController()