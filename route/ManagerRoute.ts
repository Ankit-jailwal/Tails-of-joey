import express, {Request , Response, NextFunction} from "express";
import { GetManagerProfile, ManagerLogin, UpdateManagerProfile } from "../controllers";
import { Authenticate } from "../middlewares";


const router = express.Router();

router.post('/login', ManagerLogin)

router.use(Authenticate)
router.get('/profile', GetManagerProfile)
router.patch('/profile', UpdateManagerProfile)

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "Hello from Manager"})
})

export { router as ManagerRoute };