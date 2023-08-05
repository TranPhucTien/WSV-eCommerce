import express from "express";
import {authentication} from "../../auth/authUtils";
import asyncHandler from "../../helpers/asyncHandler";
import productController from "../../controllers/product.controller";

const router = express.Router()

// authentication
router.use(authentication)

router.post("/product", asyncHandler(productController.createProduct))

export default router