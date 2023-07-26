import {NextFunction, Response, Request} from "express";
import {findById} from "../services/apiKey.service";

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

const apiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("req.headers: ", req.headers)
        console.log(HEADER.API_KEY)
        const key = req.headers[HEADER.API_KEY]?.toString();
        console.log(key, typeof key)

        if (!key) {
            return res.status(403).json({
                message: "Forbidden Error"
            })
        }

        const objKey = await findById(key);
        console.log("objKeu: ", objKey)

        if (!objKey) {
            return res.status(403).json({
                message: "Forbidden Error"
            })
        }

        req.objKey = objKey;
        return next();
    } catch (e) {
        return (e as Error).message;
    }
}

const permission = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission denied"
            })
        }

        const validPermission = req.objKey.permissions.includes(permission)

        if (!validPermission) {
            return res.status(403).json({
                message: "Permission denied"
            })
        }

        return next();
    }
}

export {
    apiKey,
    permission
}