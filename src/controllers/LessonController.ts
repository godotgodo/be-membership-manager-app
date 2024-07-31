import { NextFunction, Request, Response } from 'express';
import LessonService from '../services/LessonService';
import mongoose from 'mongoose';
import { ILesson } from '../models/Course';

class LessonController {
  private lessonService: LessonService;

  constructor() {
    this.lessonService = new LessonService();
  }

  async getLessonsByCourseId(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = new mongoose.Types.ObjectId(req.params.courseId);
      const lessons = await this.lessonService.getLessonsByCourseId(courseId);
      res.status(200).sendCustomBody(lessons);
    } catch (error) {
      next(error);
    }
  }

  async getLessonDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const lessonDetails = await this.lessonService.getLessonDetails(id);
      res.status(200).sendCustomBody(lessonDetails);
    } catch (error) {
      next(error);
    }
  }

  async createNewLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = new mongoose.Types.ObjectId(req.params.courseId);
      const lessonData: Partial<ILesson> = req.body;
      const lesson = await this.lessonService.createNewLesson(courseId, lessonData);
      res.status(200).sendCustomBody(lesson);
    } catch (error) {
      next(error);
    }
  }

  async deleteLesson(req: Request, res: Response, next: NextFunction) {
    try {
      const lessonId = new mongoose.Types.ObjectId(req.params.id);
      const deletedLesson = await this.lessonService.deleteLesson(lessonId);
      res.status(200).sendCustomBody(deletedLesson, false, 'Deleted succesfully');
    } catch (error) {
      next(error);
    }
  }

  async addAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const lessonId = new mongoose.Types.ObjectId(req.params.id);
      const userId = req.body.userId;
      const updatedAttendances = await this.lessonService.addAttendance(lessonId, userId);
      res.status(200).sendCustomBody(updatedAttendances);
    } catch (error) {
      next(error);
    }
  }

  async removeAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const lessonId = new mongoose.Types.ObjectId(req.params.id);
      const userId = req.body.userId;
      const removedAttendance = await this.lessonService.removeAttendance(lessonId, userId);
      res.status(200).sendCustomBody(removedAttendance);
    } catch (error) {
      next(error);
    }
  }
}

export default new LessonController();
