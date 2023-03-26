import express, {Request , Response, NextFunction} from "express";
import { AddProduct, GetProducts, GetManagerProfile, ManagerLogin, UpdateManagerProfile } from "../controllers";
import { Authenticate } from "../middlewares";


const router = express.Router();

router.post('/login', ManagerLogin)

router.use(Authenticate)
router.get('/profile', GetManagerProfile)
router.patch('/profile', UpdateManagerProfile)

router.post('/product', AddProduct)
router.get('/product', GetProducts)

// Orders 
router.get('/orders');
router.put('/order/:id/process');
router.get('/order/:id')



router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Manager"})
})

export { router as ManagerRoute };