import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import SchoolController from '../controllers/SchoolController';

const router = Router();

router.get('/', AuthController.checkAuth, SchoolController.getAll);
router.get('/:id', AuthController.checkAuth, SchoolController.getById);
router.post('/', AuthController.checkAuth, SchoolController.createSchool);
router.put('/:id', AuthController.checkAuth, SchoolController.updateSchool);
router.delete('/:id', AuthController.checkAuth, SchoolController.deleteSchool);

export default router;
