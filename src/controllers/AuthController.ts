import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  public async checkLogin(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.login(email, password);

      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
