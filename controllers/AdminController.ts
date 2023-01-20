import {Request, Response, NextFunction} from 'express'
import { CreateManagerInput } from '../dto'
import { Manager } from '../models';
import { GenerateSalt, GeneratePassword } from "../utility"

export const FindManager = async (id: String | undefined, email?: string) => {

    if(email){
        return await Manager.findOne({ email: email})
    }else{
        return await Manager.findById(id);
    }

}


export const CreateManager =async (req: Request, res: Response, next: NextFunction) => {
    const {name, address, pincode, productType, email, password, ownerName, phone} = <CreateManagerInput> req.body;

    const existManager = await FindManager('', email)

    if(existManager !== null) {
        return res.json("A manager already exists with that email")
    }

    // Generate salt and password

    const salt = await GenerateSalt()

    const userPassword = await GeneratePassword(password, salt)

    const createdManager = await Manager.create({
        name: name,
        address: address, 
        pincode: pincode,
        productType: productType,
        email: email,
        password: userPassword,
        salt: salt,
        ownerName: ownerName,
        phone: phone,
        rating: 0,
        serviceAvailable: false,
        coverImages: []
    })

    return res.json(createdManager)
}

export const GetManagers =async (req: Request, res: Response, next: NextFunction) => {
    const managers = await Manager.find()

    console.log(managers)
    if(managers !== null) {
        return res.json(managers)
    }

    return res.json({"message" : "No managers exist"})
}

export const GetManagerByID =async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const manager = await FindManager(id)

    if(manager !== null) {
        return res.json(manager)
    }

    return res.json({"message" : "No manager exist with this ID"})
}