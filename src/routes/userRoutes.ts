import { Router } from 'express';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';

const router = Router();

router.get('/', UserController.getUsers);
router.post('/', UserController.createUser);
router.post('/', AuthController.checkLogin);

export default router;
