import { Request, Response, NextFunction } from 'express';
import SchoolService from '../services/SchoolService';

class SchoolController {
  private schoolService: SchoolService;

  constructor() {
    this.schoolService = new SchoolService();
  }

  public async createSchool(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.user._id;
      const school = await this.schoolService.createSchool(userId, req.body);
      res.status(201).sendCustomBody(school);
    } catch (error) {
      next(error);
    }
  }
}

export default new SchoolController();
