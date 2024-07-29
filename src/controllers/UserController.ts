import { Request, Response, NextFunction } from 'express';
import UserService from '../services/UserService';
import mongoose from 'mongoose';

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async getUsers(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await this.userService.getUsers();
      res.status(200).sendCustomBody(users);
    } catch (error) {
      next(error);
    }
  }

  public async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).sendCustomBody(user);
    } catch (error) {
      next(error);
    }
  }

  public async searchUser(req: Request, res: Response, next: NextFunction) {
    try {
      const name = req.query.name as string;
      const courseId = new mongoose.Types.ObjectId(req.query?.course as string);
      const users = await this.userService.searchUsers(name, courseId);
      res.status(200).sendCustomBody(users);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
