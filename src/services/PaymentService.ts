import mongoose from 'mongoose';
import Payment, { IPayment } from '../models/Payment';

type PaymentQuery = {
  user?: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  month?: { $gte: Date; $lte: Date };
  recipient?: mongoose.Types.ObjectId;
};

class PaymentService {
  public async searchPayments(
    user?: mongoose.Types.ObjectId,
    course?: mongoose.Types.ObjectId,
    month?: Date,
    recipient?: mongoose.Types.ObjectId,
  ): Promise<IPayment[]> {
    try {
      const query: PaymentQuery = {};

      if (user) query.user = user;
      if (course) query.course = course;
      if (month) {
        const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
        const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
        query.month = { $gte: startOfMonth, $lte: endOfMonth };
      }
      if (recipient) query.recipient = recipient;

      const payments = await Payment.find(query).populate('user course recipient');
      return payments;
    } catch (error) {
      throw { message: 'Error occurred when searching payments', statusCode: 500 };
    }
  }
  public async createPayment(paymentData: IPayment): Promise<IPayment> {
    try {
      const payment = new Payment(paymentData);
      await payment.save();
      return payment;
    } catch (error) {
      throw { message: 'Error occurred when creating payment', statusCode: 500 };
    }
  }

  public async deletePayment(paymentId: mongoose.Types.ObjectId): Promise<IPayment> {
    try {
      const payment = await Payment.findByIdAndDelete(paymentId);
      if (!payment) {
        throw { message: 'Payment not found', statusCode: 404 };
      }
      return payment;
    } catch (error) {
      throw { message: 'Error occurred when deleting payment', statusCode: 500 };
    }
  }

  public async updatePayment(
    paymentId: mongoose.Types.ObjectId,
    updateData: Partial<IPayment>,
  ): Promise<IPayment> {
    try {
      const payment = await Payment.findByIdAndUpdate(paymentId, updateData, { new: true });
      if (!payment) {
        throw { message: 'Payment not found', statusCode: 404 };
      }
      return payment;
    } catch (error) {
      throw { message: 'Error occurred when updating payment', statusCode: 500 };
    }
  }
}

export default PaymentService;
