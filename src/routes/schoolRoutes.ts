import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import SchoolController from '../controllers/SchoolController';

const router = Router();

router.post(
  '/create',
  AuthController.checkLogin,
  SchoolController.createSchool,
);

export default router;
