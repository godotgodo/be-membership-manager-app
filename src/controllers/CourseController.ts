import { Request, Response, NextFunction } from 'express';
import CourseService from '../services/CourseService';
import mongoose from 'mongoose';

class CourseController {
  private courseService: CourseService;

  constructor() {
    this.courseService = new CourseService();
  }

  public async getCoursesBySchoolId(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId } = req.body;
      const courses = await this.courseService.getCoursesBySchoolId(schoolId);
      res.status(200).sendCustomBody(courses);
    } catch (error) {
      next(error);
    }
  }

  public async addCourseToSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const { schoolId, name, teacher, lessonDate } = req.body;
      const newCourse = { name, teacher, lessonDate };
      const savedCourse = await this.courseService.addCourseToSchool(schoolId, newCourse);
      res.status(200).sendCustomBody(savedCourse);
    } catch (error) {
      next(error);
    }
  }

  public async updateCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = new mongoose.Types.ObjectId(req.params.id);
      delete req.body.members;
      const updatedCourse = await this.courseService.updateCourse(courseId, req.body);
      res.status(200).sendCustomBody(updatedCourse);
    } catch (error) {
      next(error);
    }
  }

  public async addMembersToCourse(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = new mongoose.Types.ObjectId(req.params.id);
      const members: mongoose.Types.ObjectId[] = req.body;
      const addedMembers = await this.courseService.addMembersToCourse(courseId, members);
      res.status(200).sendCustomBody(addedMembers);
    } catch (error) {
      next(error);
    }
  }

  public async searchMembersByName(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = new mongoose.Types.ObjectId(req.params.id);
      const { name } = req.body;
      const members = await this.courseService.searchMembersByName(courseId, name);
      res.status(200).sendCustomBody(members);
    } catch (error) {
      next(error);
    }
  }
}

export default new CourseController();
