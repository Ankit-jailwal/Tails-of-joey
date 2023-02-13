import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateCustomerInputs {
    
    @IsEmail()
    email : string;

    @IsNotEmpty()
    @Length(10)
    phone : string;

    @IsNotEmpty()
    @Length(6, 12)
    password : string;

}

export class UserLoginInputs {

    @IsEmail()
    email : string;

    @IsNotEmpty()
    @Length(6, 12)
    password : string;

}

export class EditCustomerProfileInput {
   
    firstName: string;

    lastName: string;
    
    address: string;
}

export interface CustomerPayload {
    _id: string,
    email: string,
    verified: boolean
}