import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import LessonController from '../controllers/LessonController';
const router = Router();

router.get('/:id', AuthController.checkAuth, LessonController.getLessonDetails);
router.get('/:courseId', AuthController.checkAuth, LessonController.getLessonsByCourseId);
router.post('/:courseId', AuthController.checkAuth, LessonController.createNewLesson);
router.delete('/:id', AuthController.checkAuth, LessonController.deleteLesson);
router.post('/:id/addAttendance', AuthController.checkAuth, LessonController.addAttendance);
router.delete('/:id/removeAttendance', AuthController.checkAuth, LessonController.removeAttendance);

export default router;
