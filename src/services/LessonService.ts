import mongoose from 'mongoose';
import Course, { ICourse, ILesson } from '../models/Course';
import { IUser } from '../models/User';

class LessonService {
  async getLessonsByCourseId(courseId: mongoose.Types.ObjectId): Promise<ILesson[]> {
    try {
      const course = await Course.findById(courseId).select('-_id date lessons');
      if (!course) {
        throw { message: 'Course not found', statusCode: 404 };
      }
      const lessons = course.lessons;
      return lessons;
    } catch (error) {
      throw { message: 'Error occure when getting lessons', statusCode: 500 };
    }
  }
  async getLessonDetails(lessonId: mongoose.Types.ObjectId): Promise<ILesson> {
    try {
      const course = await Course.findOne({ 'lessons._id': lessonId })
        .select('-_id lessons')
        .populate('lessons.attendance');
      if (!course) {
        throw { message: 'Course not found', statusCode: 404 };
      }
      const lesson = course.lessons.find(lesson => lesson.id.equals(lessonId));

      if (!lesson) {
        throw { message: 'Lesson not found', statusCode: 404 };
      }
      return lesson;
    } catch (error) {
      throw { message: 'Error occurred when getting lesson details', statusCode: 500 };
    }
  }
  async createNewLesson(
    courseId: mongoose.Types.ObjectId,
    lessonData: Partial<ILesson>,
  ): Promise<ICourse> {
    try {
      const course = await Course.findByIdAndUpdate(
        courseId,
        {
          $push: { lessons: lessonData },
        },
        { new: true },
      );
      if (!course) {
        throw { message: 'Error ocured when createing new lesson', statusCode: 500 };
      }
      return course;
    } catch (error) {
      throw { message: 'Error ocured when createing new lesson', statusCode: 500 };
    }
  }
  async deleteLesson(lessonId: mongoose.Types.ObjectId): Promise<ILesson> {
    try {
      const course = await Course.findOne({ 'lessons._id': lessonId }).select('lessons');

      if (!course) {
        throw { message: 'Course not found', statusCode: 404 };
      }

      const lesson = course.lessons.find(lesson => lesson.id.equals(lessonId));

      if (!lesson) {
        throw { message: 'Lesson not found', statusCode: 404 };
      }

      await Course.findByIdAndUpdate(
        course._id,
        { $pull: { lessons: { _id: lessonId } } },
        { new: true },
      );
      return lesson;
    } catch (error) {
      throw { message: 'Error ocured when deleting lesson', statusCode: 500 };
    }
  }
  async addAttendance(
    lessonId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ): Promise<Partial<IUser>[]> {
    try {
      const course = await Course.findOneAndUpdate(
        { 'lessons._id': lessonId },
        {
          $addToSet: { 'lessons.$.attendance': userId },
        },
        {
          new: true,
        },
      ).populate('lessons.attendance');
      if (!course) {
        throw { message: 'Error when adding attendance', statusCode: 500 };
      }
      const attendances = course.lessons.find(lesson => lesson._id === lessonId)
        ?.attendance as unknown as Partial<IUser>[];
      if (!attendances) {
        throw { message: 'Error when adding attendance', statusCode: 500 };
      }
      return attendances;
    } catch (error) {
      throw { message: 'Error ocured when adding attendance', statusCode: 500 };
    }
  }
  async removeAttendance(
    lessonId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
  ): Promise<Partial<IUser>[]> {
    try {
      const course = await Course.findOneAndUpdate(
        { 'lessons._id': lessonId },
        {
          $pull: { 'lessons.$.attendance': userId },
        },
        {
          new: true,
        },
      ).populate('lessons.attendance');
      if (!course) {
        throw { message: 'Error when removing attendance', statusCode: 500 };
      }
      const attendances = course.lessons.find(lesson => lesson._id === lessonId)
        ?.attendance as unknown as Partial<IUser>[];
      if (!attendances) {
        throw { message: 'Error when removing attendance', statusCode: 500 };
      }
      return attendances;
    } catch (error) {
      throw { message: 'Error ocured when removing attendance', statusCode: 500 };
    }
  }
}
export default LessonService;
