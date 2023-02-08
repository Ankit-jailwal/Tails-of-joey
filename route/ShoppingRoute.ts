import express, {Request , Response, NextFunction} from "express";
import { GetProductById, GetProductAvailiability, GetTopProducts, SearchProducts } from "../controllers/ShoppingController";

const router = express.Router();

// router.get('/:pincode', GetProductAvailiability) 

router.get('/top-products', GetTopProducts)

// Todo: Search products
router.get('/search', SearchProducts)

router.get('/product/:id', GetProductById)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Shopping route is working"})
})

export { router as ShoppingRoute };