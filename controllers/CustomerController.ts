import express, {  Response, NextFunction, Request } from 'express';
import { plainToClass } from 'class-transformer';
import { CreateCustomerInputs, UserLoginInputs, EditCustomerProfileInput, OrderInputs } from '../dto/Customer.dto';
import { validate } from 'class-validator';
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from '../utility';
import { Customer } from '../models/Customer';
import { GenerateOtp, onRequestOtp } from '../utility/NotificationUtility';
import { Order } from '../models';
import { Product } from '../models';



//   ----------AUTHENTICATION----------

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
        lng: 0,
        orders : []
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

    return res.status(400).json({message: "Error with Signup"})
}

export const CustomerLogin =async (req: Request, res: Response, next: NextFunction) => {

    const loginInputs = plainToClass(UserLoginInputs, req.body);
    const loginErrors = await validate(loginInputs, { validationError: { target: false}})

    if(loginErrors.length > 0) {
        return res.status(400).json(loginErrors)
    }

    const { email, password } = loginInputs

    const customer = await Customer.findOne({ email: email})

    if(customer) {

        const validation = await ValidatePassword(password, customer.password, customer.salt)

        if(validation) {

            const signature = await GenerateSignature({
                _id : customer._id,
                email: customer.email,
                verified: customer.verified
            })


            return res.status(201).json({ signature: signature, verified: customer.verified, email: customer.email})
        }
    } 

    return res.status(404).json({message: "Login error"})

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

    return res.status(400).json({message: "Error with OTP validation"})
}

export const RequestOtp =async (req: Request, res: Response, next: NextFunction) => {
    
    const customer = req.user

    if(customer) {

        const profile = await Customer.findById(customer._id)
        if(profile) {
            const {otp, expiry} = await GenerateOtp()
    
            profile.otp = otp
            profile.otp_expiry = expiry

            await profile.save()
            await onRequestOtp(otp, profile.phone)

            res.status(200).json({message: "OTP sent to your registered phone number!"})
        }
    }

    return res.status(400).json({ message: "Error with request OTP"})
}



//  ---------PROFILE----------

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.user;
 
    if(customer){
        
        const profile =  await Customer.findById(customer._id);
        
        if(profile){
             
            return res.status(201).json(profile);
        }

    }
    return res.status(400).json({ msg: 'Error while Fetching Profile'});

}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    const customerInputs = plainToClass(EditCustomerProfileInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { firstName, lastName, address } = customerInputs;

    if(customer){
        
        const profile =  await Customer.findById(customer._id);
        
        if(profile){
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save()
            
            return res.status(201).json(result);
        }

    }
    return res.status(400).json({ msg: 'Error while Updating Profile'});
}


//  --------CART--------

export const AddToCart = async(req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if(customer) {
        const profile = await Customer.findById(customer._id).populate('cart.product');
        let cartItems = Array();

        const {_id, unit} = <OrderInputs>req.body;

        const product = await Product.findById(_id);

        if(product) {

            if(profile != null) {
                cartItems = profile.cart;

                if(cartItems.length > 0) {
                    // check and update unit
                    let existProductItem = cartItems.filter((item) => item.product._id.toString() === _id);

                    if(existProductItem.length > 0) {
                        const index = cartItems.indexOf(existProductItem[0]);
                        if(unit > 0) {
                            cartItems[index] = { product, unit };
                        } else {
                            cartItems.splice(index, 1);
                        }
                    } else {
                        cartItems.push({ product , unit});
                    }
                } else {
                    // add new item to the cart
                    cartItems.push({ product , unit});
                }

                if(cartItems) {
                    profile.cart = cartItems as any;
                    const cartResult = await profile.save();

                    return res.status(200).json({cartResult})
                }
            }
        }
        
    } 
        return res.status(400).json({message: 'Unable to create cart!'})
}


export const GetCart = async(req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if(customer) {
        const profile = await Customer.findById(customer._id).populate('cart.product');

        if(profile) {
            return res.status(200).json(profile.cart)
        }
    }
    return res.status(400).json({message: 'Cart is empty!'})

}

export const DeleteCart = async(req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if(customer) {
        const profile = await Customer.findById(customer._id).populate('cart.product');

        if(profile != null) {
            profile.cart = [] as any;
            const cartResult = await profile.save();

            return res.status(200).json(cartResult)
        }
    }
    return res.status(400).json({message: 'Cart is already empty!'})
}

//    -------ORDERS--------

export const CreateOrder = async(req: Request, res: Response, next: NextFunction) => {
    // grab current login user
    const customer = req.user;

    if(customer) {
        // create an order ID
        const orderID = `${Math.floor(Math.random() * 89999) + 1000}`;

        const profile = await Customer.findById(customer._id);

        // grab order items from request
        const cart = <[OrderInputs]>req.body; 

        let cartItems = Array();

        let netAmount = 0.0;

        // calculate amount
        const products = await Product.find().where('_id').in(cart.map(item => item._id)).exec();

        products.map(product => {
            cart.map(({ _id, unit}) => {
                if(product._id == _id){
                    netAmount += (product.price * unit);
                    cartItems.push({ product, unit})
                }
            })
        })

        if(cartItems) {
        // create order with item descriptions
            const currentOrder = await Order.create({
                orderID: orderID,
                items: cartItems,
                totalAmount: netAmount,
                orderDate: new Date(),
                paidThrough: 'COD',
                PaymentResponse: '',
                orderSatus: 'Waiting'
            })

            if(currentOrder) {
                // finally update orders to user account
                profile?.orders.push(currentOrder);
                await profile?.save();

                return res.status(200).json(currentOrder)
            }
        }
        }
        
        return res.status(400).json({ message: 'Error with create order!'})
    
    }
    

export const GetOrders = async(req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if(customer) {
        const profile = await Customer.findById(customer._id).populate('orders');

        if(profile) {
            return res.status(200).json(profile.orders);
        }

        return res.json({message: "You haven't placed any order yet!"})
    }

    return res.json({message: "User not found"})
}

export const GetOrderById = async(req: Request, res: Response, next: NextFunction) => {

    const orderID = req.params.id;

    if(orderID) {
        const order = await Order.findById(orderID).populate('items');

        return res.json(order)
    }
}