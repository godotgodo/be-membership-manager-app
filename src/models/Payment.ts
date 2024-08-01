import mongoose, { model, Schema } from 'mongoose';

export interface IPayment {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  amount?: number;
  month: Date;
  recipient?: mongoose.Types.ObjectId;
}

const paymentSchema = new Schema<IPayment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User required for payment'],
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course required for payment'],
  },
  amount: {
    type: Number,
  },
  month: {
    type: Date,
    required: [true, 'Month required for payment'],
  },
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Payment = model<IPayment>('Payment', paymentSchema);

export default Payment;
