import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import PaymentController from '../controllers/PaymentController';

const router = Router();

router.get('/search', AuthController.checkAuth, PaymentController.searchPayments);
