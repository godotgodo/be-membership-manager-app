import { Router } from 'express';
import userRoutes from './userRoutes';
import schoolRoutes from './schoolRoutes';

const router = Router();

router.use('users', userRoutes);
router.use('schools', schoolRoutes);

export default router;
