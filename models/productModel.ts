import mongoose from "mongoose";
import { productType } from "../types/productTypes";
const { Schema } = mongoose;

const product = {
    _id: String,
    name: String,
    price: Number,
    description: String,
    image: String,
    tags: [String],
    owner: String,
    licenseType: String,
};

const productSchema = new Schema(product, { timestamps: true });
const productModel = mongoose.model<productType>("products", productSchema);
export default productModel;
