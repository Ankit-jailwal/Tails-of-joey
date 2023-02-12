import { IsEmail, IsEmpty, Length } from "class-validator";

export class CreateCustomerInputs {
    
    @IsEmail()
    email : string;

    @IsEmpty()
    @Length(10)
    phone : string;

    @IsEmpty()
    @Length(6, 12)
    password : string;

}