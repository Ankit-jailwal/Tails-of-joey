import express, {Request , Response, NextFunction} from "express";
import { CreateManager, GetManagerByID, GetManagers } from "../controllers";


const router = express.Router();

router.post('/manager', CreateManager)

router.get('/manager', GetManagers)

router.get('/manager/:id', GetManagerByID)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Admin"})
})

export { router as AdminRoute };