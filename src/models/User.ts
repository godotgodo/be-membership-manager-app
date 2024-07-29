import { Schema, model, Document, ObjectId } from 'mongoose';

export interface ISchool extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  courses: ObjectId[];
}

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
  phoneNumber: string;
  schools: ISchool[];
}

const schoolShema = new Schema<ISchool>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [6, 'Name must be at least 6 characters long'],
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
});

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [3, 'Name must be at least 3 characters long'],
    },
    email: {
      type: String,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number required.'],
      minlength: [6, 'Phone number must be at least 6 characters long'],
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    schools: [schoolShema],
    role: {
      type: String,
      enum: ['admin', 'moderator', 'user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    methods: {
      // findSimilarTypes(cb) {
      //   return mongoose.model('Animal').find({ type: this.type }, cb);
      // },
    },
  },
);

userSchema.virtual('courses', {
  ref: 'course',
  localField: '_id',
  foreignField: 'members',
});

userSchema.pre<IUser>('save', function (next) {
  if (
    (this.role === 'admin' || this.role === 'moderator') &&
    (!this.email || !this.password)
  ) {
    const err = new Error(
      'Email and password are required for admin or moderator roles',
    );
    next(err);
  } else {
    next();
  }
});

const User = model<IUser>('User', userSchema);

export default User;
