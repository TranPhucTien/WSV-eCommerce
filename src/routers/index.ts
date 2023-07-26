import express, {NextFunction, Request} from "express";
import routerAccess from "./access"

const router = express.Router()

router.use('/v1/api', routerAccess)
// router.get('', (req, res, next) => {
//     return res.status(200).json({
//         message: "Welcome Fan tipjs"
//     })
// })

export default router