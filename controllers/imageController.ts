import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import imageModel from "../models/imageModel";

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    const fileSize = file?.size;
    const host = req.headers.host;
    const imgObj = {
        _id: uuidv4(),
        name: file?.filename,
        data: file?.buffer,
        contentType: file?.mimetype,
    };
    const fileLimit = 5 * 1024 * 1024; // 5MB
    if (fileSize! < fileLimit) {
        try {
            await imageModel.create(imgObj); // save the image to the db
            res.status(200).json({ message: "Image uploaded successfully", link: `http://${host}/api/v1/image/${imgObj._id}` });
        } catch (error) {
            const err = error as Error;
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(400).json({ message: "File too large" });
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

export { uploadFile, retrieveImg };
