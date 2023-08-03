import {model, Schema} from "mongoose";

const DOCUMENT_NAME = "Product"
const COLLECTION_NAME = "Products"

export interface IProduct {
    product_name: string,
    product_thumb: string,
    product_description: string,
    product_price: number,
    product_quantity: number,
    product_type: string,
    product_shop: Schema.Types.ObjectId,
    product_attributes: Object,
}

const productScheme = new Schema({
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_price: {type: Number, required: true},
    product_quantity: {type: Number, required: true},
    product_type: {type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed, required: true},
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

// define the product type = clothing
const clothingSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: "Clothes",
    timestamps: true
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: {type: String, required: true},
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
}, {
    collection: "Electronics",
    timestamps: true
})

export default {
    product: model(DOCUMENT_NAME, productScheme),
    electronic: model("Electronic", electronicSchema),
    clothing: model("Clothing", clothingSchema),
}