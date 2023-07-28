import express, {NextFunction, Request} from "express";
import accessController from "../../controllers/access.controller";
import {authentication} from "../../auth/authUtils";
import asyncHandler from "../../helpers/asyncHandler";

const router = express.Router()

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// authentication
router.use(authentication)

router.post("/shop/logout", asyncHandler(accessController.logout))

export default router