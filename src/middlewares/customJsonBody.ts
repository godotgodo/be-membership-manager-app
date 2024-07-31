import { Request, Response, NextFunction } from 'express';

export const customBodyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.sendCustomBody = (data: unknown, error: boolean = false, message?: string) => {
    return res.json({
      error,
      data,
      message,
    });
  };
  next();
};
