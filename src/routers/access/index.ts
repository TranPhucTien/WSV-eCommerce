import express from "express";
import accessController from "../../controllers/access.controller";
import {authenticationV2} from "../../auth/authUtils";
import asyncHandler from "../../helpers/asyncHandler";

const router = express.Router()

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
router.use(authenticationV2)

router.post("/shop/logout", asyncHandler(accessController.logout))
router.post("/shop/refreshToken", asyncHandler(accessController.handlerRefreshToken))

export default router