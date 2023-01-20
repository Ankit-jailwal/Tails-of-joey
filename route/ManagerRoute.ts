import express, {Request , Response, NextFunction} from "express";
import { ManagerLogin } from "../controllers";


const router = express.Router();

router.post('/login', ManagerLogin)
router.get('/profile', )
router.patch('/profile', )
router.patch('/service', )

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Manager"})
})

export { router as ManagerRoute };