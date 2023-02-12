import express, {  Response, NextFunction, Request } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateCustomerInputs } from '../dto/Customer.dto';
import { validate } from 'class-validator';
import { GeneratePassword, GenerateSalt, GenerateSignature } from '../utility';
import { Customer } from '../models/Customer';
import { GenerateOtp, onRequestOtp } from '../utility/NotificationUtility';


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
  
    const existCustomer = await Customer.findOne({ email : email})

    if(existCustomer !== null) {
        return res.status(409).json({ message: 'An user with email already exists'})
    }

    console.log(otp, expiry)

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
        await onRequestOtp(otp, phone)
        // generate the signature
        const signature = await GenerateSignature({
            _id : result._id,
            email: result.email,
            verified: result.verified
        })

        // send the result to client

        return res.status(201).json({ signature: signature, verified: result.verified, email: result.email})
    }

    return res.status(400).json({"message": "Error with Signup"})
}

export const CustomerLogin =async (req: Request, res: Response, next: NextFunction) => {
    
}

export const CustomerVerify =async (req: Request, res: Response, next: NextFunction) => {
    
    const {otp} = req.body
    const user = req.user

    if(user) {
        const profile = await Customer.findById(user._id)

        if(profile) {
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = await profile.save()

                const signature = await GenerateSignature({
                    _id : updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })

                return res.status(200).json({ signature: signature, verified: updatedCustomerResponse.verified, email: updatedCustomerResponse.email})
            }
        }
    }

    return res.status(400).json({"message": "Error with OTP validation"})
}

export const RequestOtp =async (req: Request, res: Response, next: NextFunction) => {
    
}

export const GetCustomerProfile =async (req: Request, res: Response, next: NextFunction) => {
    
}

export const EditCustomerProfile =async (req: Request, res: Response, next: NextFunction) => {
    
}