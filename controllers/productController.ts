import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { productType } from "../types/productTypes";
import productModel from "../models/productModel";

const registerProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { name, description, price, category, image } = req.body;
    const product: productType = new productModel({
        _id: uuidv4(),
        name,
        description,
        price,
        category,
        image,
        owner: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    try {
        const newProduct = new productModel(product);
        await newProduct.save();
        res.status(200).json({ message: "Product registered successfully" });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
    next();
};

const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productModel.find({});
        res.status(200).json({ products: products });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const product = await productModel.findById({ _id: id });
        res.status(200).json({ product: product });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, description, price, category, image } = req.body;
    try {
        await productModel.findByIdAndUpdate(
            { _id: id },
            {
                name,
                description,
                price,
                category,
                image,
            },
            { new: true }
        );
        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await productModel.findByIdAndDelete({ _id: id });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

export { registerProduct, getProducts, getProduct, updateProduct, deleteProduct };
