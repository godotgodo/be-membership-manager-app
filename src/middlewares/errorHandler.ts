import { Request, Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response) => {
  const statusCode = err.statusCode || 500;

  const message = err.message || 'An unknown error occurred';

  res.status(statusCode).sendCustomBody({
    data: null,
    error: true,
    message,
  });
};

export default errorHandler;
