import { Document, model, ObjectId, Schema } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  teacher: string;
  lessonDate: Date;
  members: ObjectId[];
}

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: [true, 'Course name required'],
    minlength: [6, 'Length of course name, should be minimum 6 characters'],
  },
  teacher: {
    type: String,
    required: [true, 'Teacher required'],
    minlength: [6, 'Teacher of course, should be minimum 6 characters'],
  },
  lessonDate: {
    type: Date,
    required: [true, 'Lesson date required'],
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Course = model<ICourse>('Course', courseSchema);

export default Course;
