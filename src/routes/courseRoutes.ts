import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import CourseController from '../controllers/CourseController';

const router = Router();

router.get('/', AuthController.checkAuth, CourseController.getCoursesBySchoolId);
