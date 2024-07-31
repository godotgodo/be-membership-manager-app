import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';
import jwt from 'jsonwebtoken';
import getConfig from '../config/getConfig';

class AuthController {
  private authService: AuthService;
  private config;

  constructor() {
    this.authService = new AuthService();
    this.config = getConfig();
  }

  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
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

  public async checkAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(401).sendCustomBody(null, true, 'No token provided');
        return;
      }

      let decoded: { userId: string };
      try {
        decoded = jwt.verify(token, this.config.JWT_SECRET) as {
          userId: string;
        };
      } catch {
        res.status(401).sendCustomBody(null, true, 'Invalid token');
        return;
      }

      const user = await this.authService.getUserById(decoded.userId);
      if (!user) {
        res.status(401).sendCustomBody(null, true, 'User not found');
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
