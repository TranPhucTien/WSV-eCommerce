import express, {NextFunction, Request} from "express";
import accessController from "../../controllers/access.controller";
import {asyncHandler} from "../../auth/authUtils";

const router = express.Router()

// sign up
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

export default router