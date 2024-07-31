import { Request, Response, NextFunction } from 'express';
import SchoolService from '../services/SchoolService';
import mongoose from 'mongoose';

class SchoolController {
  private schoolService: SchoolService;

  constructor() {
    this.schoolService = new SchoolService();
  }

  public async createSchool(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user._id;
      const school = await this.schoolService.createSchool(userId, req.body);
      res.status(201).sendCustomBody(school);
    } catch (error) {
      next(error);
    }
  }

  public async updateSchool(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user._id;
      const schoolId = new mongoose.Types.ObjectId(req.params.id);

      const updatedSchool = await this.schoolService.updateSchool(userId, schoolId, req.body);

      res.status(200).sendCustomBody(updatedSchool);
    } catch (error) {
      next(error);
    }
  }

  public async deleteSchool(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.id;
      const schoolId = new mongoose.Types.ObjectId(req.params.id);

      const deletedSchool = await this.schoolService.deleteSchool(userId, schoolId);

      res.status(200).sendCustomBody(deletedSchool);
    } catch (error) {
      next(error);
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user._id;
      const schools = await this.schoolService.getAll(userId);
      res.status(200).send(schools);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user._id;
      const schoolId = new mongoose.Types.ObjectId(req.params.id);
      const school = await this.schoolService.getSchoolById(userId, schoolId);
      res.status(200).sendCustomBody(school);
    } catch (error) {
      next(error);
    }
  }
}

export default new SchoolController();
