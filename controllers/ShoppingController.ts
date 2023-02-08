import { NextFunction, Request, Response } from "express";
import { Product } from "../models";

export const GetProductAvailiability = async (req: Request, res: Response, next: NextFunction) => {


}

export const GetTopProducts = async (req: Request, res: Response, next: NextFunction) => {
        const result = await Product.find().sort([['rating', 'descending']]).limit(2)

        if(result.length > 0) {
            return res.status(200).json(result)
        }

        return res.status(400).json({ message: "No product found"})
}

export const SearchProducts = async (req:Request, res: Response, next: NextFunction) => {

        const result = await Product.find()

        if(result.length > 0) {
            
            return res.json(result)
        }

        return res.status(200).json(result)
}

export const GetProductById = async (req: Request, res: Response, next: NextFunction) => {

        const id = req.params.id;

        const result = await Product.findById(id)

        if(result !== null) {
            return res.json(result)
        }

        return res.json({message : "No product found!"})

}