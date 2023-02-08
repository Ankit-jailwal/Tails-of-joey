import express, {Request , Response, NextFunction} from "express";
import { FindProductById, GetTopProducts, SearchProducts } from "../controllers/ShoppingController";

const router = express.Router();


// Todo: Top products
router.get('/top-products', GetTopProducts)

// Todo: Search products
router.get('/search', SearchProducts)

// Todo: Find product by id
router.get('/product/:id', FindProductById)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Shopping route is working"})
})

export { router as ShoppingRoute };