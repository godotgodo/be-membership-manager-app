import { IUser } from '../models/User';
import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    user?: Partial<IUser>;
    token?: string;
  }
  interface Response {
    sendCustomBody: (data: unknown, error?: boolean, message?: string) => Response;
  }
}
