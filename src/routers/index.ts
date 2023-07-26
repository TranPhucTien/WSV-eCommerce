import express, {NextFunction, Request} from "express";
import routerAccess from "./access"
import {apiKey, permission} from "../auth/checkAuth"

const router = express.Router()

// Check api key
router.use(apiKey)

// Check permission
router.use(permission('0000'))

router.use('/v1/api', routerAccess)

export default router