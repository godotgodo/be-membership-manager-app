import { Request, Response, NextFunction } from 'express';
import PaymentService from '../services/PaymentService';
import mongoose from 'mongoose';
import { IPayment } from '../models/Payment';

class PaymentController {
  private paymentService: PaymentService;
  constructor() {
    this.paymentService = new PaymentService();
  }
  public async searchPayments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, course, month, recipient } = req.query;

      const userId = user ? new mongoose.Types.ObjectId(user as string) : undefined;
      const courseId = course ? new mongoose.Types.ObjectId(course as string) : undefined;
      const monthDate = month ? new Date(month as string) : undefined;
      const recipientId = recipient ? new mongoose.Types.ObjectId(recipient as string) : undefined;

      const payments = await this.paymentService.searchPayments(
        userId,
        courseId,
        monthDate,
        recipientId,
      );

      res.status(200).sendCustomBody(payments);
    } catch (error) {
      next(error);
    }
  }
  public async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paymentData: IPayment = req.body;
      const payment = await this.paymentService.createPayment(paymentData);

      res.status(201).sendCustomBody(payment);
    } catch (error) {
      next(error);
    }
  }

  public async deletePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paymentId = new mongoose.Types.ObjectId(req.params.id);
      const payment = await this.paymentService.deletePayment(paymentId);

      res.status(200).sendCustomBody(payment);
    } catch (error) {
      next(error);
    }
  }

  public async updatePayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const paymentId = new mongoose.Types.ObjectId(req.params.id);
      const updateData: Partial<IPayment> = req.body;
      const payment = await this.paymentService.updatePayment(paymentId, updateData);

      res.status(200).sendCustomBody(payment);
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
