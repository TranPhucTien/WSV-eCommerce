import {NextFunction, Request, Response} from "express";
import {CREATED} from "../core/success.response";
import productService from "../services/product.service";

class ProductController {
    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: "create product success!",
            metadata: await productService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user?.userId
            })
        }).send(res)
    }
}

export default new ProductController();