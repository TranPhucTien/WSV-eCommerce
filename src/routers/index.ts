import express from "express";
import routerAccess from "./access"
import routerProduct from "./product"
import {apiKey, permission} from "../auth/checkAuth"

const router = express.Router()

// Check api key
router.use(apiKey)

// Check permission
router.use(permission('0000'))

router.use('/v1/api', routerAccess)
router.use('/v1/api', routerProduct)

export default router