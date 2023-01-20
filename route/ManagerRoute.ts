import express, {Request , Response, NextFunction} from "express";
import { GetManagerProfile, ManagerLogin, UpdateManagerProfile, UpdateManagerService, } from "../controllers";


const router = express.Router();

router.post('/login', ManagerLogin)
router.get('/profile', GetManagerProfile)
router.patch('/profile', UpdateManagerProfile)
router.patch('/service', UpdateManagerService)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Manager"})
})

export { router as ManagerRoute };