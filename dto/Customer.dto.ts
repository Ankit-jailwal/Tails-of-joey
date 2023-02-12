import { IsEmail, IsEmpty, IsNotEmpty, Length } from "class-validator";

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