import { Request, Response, NextFunction } from "express";
import { ManagerLoginInput } from "../dto";
import { ValidatePassword } from "../utility";
import { FindManager } from "./AdminController";

export const ManagerLogin = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password} = <ManagerLoginInput>req.body;

    const existingManager = await FindManager('', email)

    if(existingManager !== null) {
            // Validation and giving access

            const validation = await ValidatePassword(password, existingManager.password, existingManager.salt)

            if(validation) {
                return res.json(existingManager)
            }
            else {
                return res.json({"message" : "Password is wrong"})
            }
    }

    return res.json({"message": "Email or password is incorrect"});
}