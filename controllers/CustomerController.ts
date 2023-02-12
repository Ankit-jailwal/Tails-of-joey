import express, {  Response, NextFunction, Request } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateCustomerInputs } from '../dto/Customer.dto';
import { validate } from 'class-validator';
import { GeneratePassword, GenerateSalt } from '../utility';
import { Customer } from '../models/Customer';
import { GenerateOtp } from '../utility/NotificationUtility';


export const CustomerSignUp =async (req: Request, res: Response, next: NextFunction) => {
    
    const customerInputs = plainToClass(CreateCustomerInputs, req.body);

    const InputErrors = await validate(customerInputs, { validationError: {target : true}});

    if(InputErrors.length > 0) {
        return res.status(400).json("Not working");
    }
    
    const {email, phone, password} = customerInputs;

    const salt = await GenerateSalt()

    const userPassword = await GeneratePassword(password, salt);

    const {otp , expiry} = GenerateOtp();
  
    console.log(otp, expiry)

    return res.status(200).json("working")

    const result = await Customer.create({
        email: email,
        password: userPassword,
        phone: phone,
        salt: salt,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0
    }) 

    if(result) {
        
        // send the OTP to customer

        // generate the signature

        // send the result to client
    }
}

export const CustomerLogin =async (req: Request, res: Response, next: NextFunction) => {
    
}

export const CustomerVerify =async (req: Request, res: Response, next: NextFunction) => {
    
}

export const RequestOtp =async (req: Request, res: Response, next: NextFunction) => {
    
}

export const GetCustomerProfile =async (req: Request, res: Response, next: NextFunction) => {
    
}

export const EditCustomerProfile =async (req: Request, res: Response, next: NextFunction) => {
    
}