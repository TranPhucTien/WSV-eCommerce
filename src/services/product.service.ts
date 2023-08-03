import Models, {IProduct} from "../models/product.module"
import {BadRequestError} from "../core/error.response";
import {Types} from "mongoose";

const {product, clothing, electronic} = Models;

// define Factory class to create product
class ProductFactory {
    static async createProduct(type: string, payload: IProduct) {
        switch (type) {
            case "Electronics":
                return new Electronic(payload).createProduct();
            case "Clothing":
                return new Clothing(payload).createProduct();
            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }
}

class Product {
    protected product_name;
    protected product_thumb;
    protected product_price;
    protected product_description;
    protected product_type;
    protected product_shop;
    protected product_attributes;
    protected product_quantity;

    constructor({
                    product_name,
                    product_thumb,
                    product_price,
                    product_description,
                    product_type,
                    product_shop,
                    product_attributes,
                    product_quantity
                }: IProduct) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_price = product_price;
        this.product_description = product_description;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
    }

    // create new product
    async createProduct(product_id: Types.ObjectId) {
        return await product.create({ ...this, _id: product_id});
    }
}

// Define sub-class for different product types clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) {
            throw new BadRequestError("create new clothing error")
        }
        console.log({newClothing})

        const newProduct = await super.createProduct(newClothing._id);
        if (!newProduct) {
            throw new BadRequestError("create new product error")
        }
        console.log({newProduct})

        return newProduct;
    }
}

// Define sub-class for different product types clothing
class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) {
            throw new BadRequestError("create new clothing error")
        }

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) {
            throw new BadRequestError("create new product error")
        }

        return newProduct;
    }
}

export default ProductFactory