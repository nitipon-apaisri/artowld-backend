import { Request, Response } from "express";
import { getHelloworld } from "../models/exempleModel";

export const getHelloworldController = async (req: Request, res: Response) => {
    try {
        const response = await getHelloworld();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
};
