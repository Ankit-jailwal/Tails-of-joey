import express, {Request , Response, NextFunction} from "express";
import { CustomerLogin, CustomerSignUp, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOtp } from "../controllers";
import { Authenticate } from "../middlewares";

const router = express.Router();


// Signup / Create Customer
router.post('/signup', CustomerSignUp)

// Login
router.post('/login', CustomerLogin)

// Authentication
router.use(Authenticate)

// Verify customer account
router.patch('/verify', CustomerVerify)

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