import { NextFunction, Request, Response } from "express";
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
    const readFile = fs.readFileSync(path.join("./uploads/" + file?.filename)); // read the file from uploads folder
    const imgObj = {
        _id: uuidv4(),
        name: file?.filename,
        data: readFile,
        contentType: file?.mimetype,
    };
    try {
        await imageModel.create(imgObj); // save the image to the db
        setTimeout(() => {
            fs.unlinkSync(path.join("./uploads/" + file?.filename)); // delete the file from uploads folder
        }, 1000);
        res.status(200).json({ message: "Image uploaded successfully" });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ message: err.message });
    }
};

const retrieveImg = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params; // get the id from the request
    try {
        await imageModel.findById(id).then((img: any) => {
            const buffer = Buffer.from(img?.data, "base64"); // decode the base64 from the db
            res.writeHead(200, { "Content-Type": img?.contentType, "Content-Length": img?.data.length }); // write the header of the response
            res.end(buffer); // send the buffer to the response
        });
    } catch (error) {
        const err = error as Error; // handle the error
        res.status(500).json({ message: err.message });
    }
};

export { registerProduct, uploadFile, retrieveImg };
