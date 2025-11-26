import exprees from 'express'
import { LoginController, RegisterController } from '../controllers/authController.js';

const authRouter = exprees.Router();

authRouter.post('/register',RegisterController)
authRouter.post('/login',LoginController)

export default authRouter;