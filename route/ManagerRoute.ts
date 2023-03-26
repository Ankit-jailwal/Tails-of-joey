import express, {Request , Response, NextFunction} from "express";
import { AddProduct, GetProducts, GetManagerProfile, ManagerLogin, UpdateManagerProfile, GetOrders, GetOrderDetails, ProcessOrder } from "../controllers";
import { Authenticate } from "../middlewares";


const router = express.Router();

router.post('/login', ManagerLogin)

router.use(Authenticate)
router.get('/profile', GetManagerProfile)
router.patch('/profile', UpdateManagerProfile)

router.post('/product', AddProduct)
router.get('/product', GetProducts)

// Orders 
router.get('/orders', GetOrders);
router.put('/order/:id/process', ProcessOrder);
router.get('/order/:id', GetOrderDetails)



router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Manager"})
})

export { router as ManagerRoute };