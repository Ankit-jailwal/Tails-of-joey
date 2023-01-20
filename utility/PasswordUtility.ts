import bcrypt from 'bcrypt';
import { ManagerPayload } from '../dto';
import  jwt  from 'jsonwebtoken';
import { APP_SECRET } from '../config';

export const GenerateSalt = async () => {

    return await bcrypt.genSalt()

} 

export const GeneratePassword = async (password: string, salt: string) => {

    return await bcrypt.hash(password, salt)

}

export const ValidatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {

    return await GeneratePassword(enteredPassword, salt) === savedPassword

}

export const GenerateSignature = async (payload: ManagerPayload) => {

    return jwt.sign(payload, APP_SECRET, {expiresIn: "1d"})

}