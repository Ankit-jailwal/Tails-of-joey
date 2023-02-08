import express, {Request , Response, NextFunction} from "express";
import { CustomerLogin, CustomerSignUp, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOtp } from "../controllers";

const router = express.Router();


// Signup / Create Customer
router.post('/singup', CustomerSignUp)

// Login
router.post('/login', CustomerLogin)

// Authentication

// Verify customer account
router.patch('verify', CustomerVerify)

// OTP / Requesting OTP
router.get('/otp', RequestOtp)

// Profile
router.get('/profile', GetCustomerProfile)

router.patch('/profile', EditCustomerProfile)
// Cart

// Order

// Payment
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Customer route working"})
})

export { router as CustomerRoute };