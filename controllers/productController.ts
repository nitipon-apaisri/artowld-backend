import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import { productType } from "../types/productTypes";
import productModel from "../models/productModel";
import path from "path";
import * as fs from "fs";
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

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    const readFile = fs.readFileSync(path.join("./uploads/" + file?.filename));
    const imgObj = {
        _id: uuidv4(),
        name: file?.filename,
        data: readFile,
        contentType: file?.mimetype,
    };
    try {
        await imageModel.create(imgObj);
        setTimeout(() => {
            fs.unlinkSync(path.join("./uploads/" + file?.filename));
        }, 1000);
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
            const buffer = Buffer.from(img?.data, "base64");
            res.writeHead(200, { "Content-Type": img?.contentType, "Content-Length": img?.data.length });
            res.end(buffer);
            // res.set("Content-Type", "text/html");
            // res.send(`<img src="https://pbs.twimg.com/media/F21OcvXbIAAc6JQ?format=jpg&name=small"/>`);
            // res.send(`
            // <img src="data:${img?.contentType};base64,${buffer}" alt="img"/>
            // `);
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

export { registerProduct, uploadFile, retrieveImg };
