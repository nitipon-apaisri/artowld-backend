import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { productType } from "../types/productTypes";
import productModel from "../models/productModel";
import path from "path";
import { readFileSync } from "fs";
import imageModel from "../models/imageModel";

const registerProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, category, image } = req.body;
    const product: productType = new productModel({
        _id: uuidv4(),
        name,
        description,
        price,
        category,
        image,
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

const getImg = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    console.log(file);
    const readFile = readFileSync(path.join("./uploads/" + file?.filename));
    const imgObj = {
        _id: uuidv4(),
        name: file?.filename,
        data: readFile,
        contentType: file?.mimetype,
    };
    try {
        await imageModel.create(imgObj);
        res.status(200).json({ message: "Image uploaded successfully" });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

const retrieveImg = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        await imageModel.findById(id).then((img: any) => {
            const buffer = Buffer.from(img?.data).toString("base64");
            console.log(buffer);
            res.send(`
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<img src="data:${img?.contentType};base64,${buffer}" alt="img"/>
    
</body>
</html>
            
            `);
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

export { registerProduct, getImg, retrieveImg };
