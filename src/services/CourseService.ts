import mongoose, { ObjectId } from 'mongoose';
import Course, { ICourse } from '../models/Course';
import User, { IUser } from '../models/User';

type userSearchResponse = {
  courseMember: Partial<IUser>[];
  outOfCourse: Partial<IUser>[];
};

class CourseService {
  public async getCoursesBySchoolId(schoolId: mongoose.Types.ObjectId): Promise<ICourse[]> {
    try {
      const result = await User.aggregate([
        { $match: { 'schools._id': schoolId } },
        { $unwind: '$schools' },
        { $match: { 'schools._id': schoolId } },
        { $unwind: '$schools.courses' },
        {
          $lookup: {
            from: 'courses',
            localField: 'schools.courses',
            foreignField: '_id',
            as: 'courseDetails',
          },
        },
        { $unwind: '$courseDetails' },
        {
          $group: {
            _id: null,
            courses: { $push: '$courseDetails' },
          },
        },
        {
          $project: {
            _id: 0,
            courses: 1,
          },
        },
      ]);

      const courses: ICourse[] = result.length > 0 ? result[0].courses : [];
      return courses;
    } catch (error) {
      throw { message: 'Get courses error', statusCode: 500 };
    }
  }

  public async addCourseToSchool(
    schoolId: ObjectId,
    newCourseInfo: Partial<ICourse>,
  ): Promise<ICourse> {
    try {
      const newCourse = await Course.create(newCourseInfo);
      if (newCourse) {
        await User.findOneAndUpdate(
          { 'schools._id': schoolId },
          { $push: { 'schools.$.courses': newCourse._id } },
        );
      }
      return newCourse;
    } catch (error) {
      throw { message: 'Add course error', statusCode: 500 };
    }
  }

  public async updateCourse(courseId: mongoose.Types.ObjectId, courseInfo: Partial<ICourse>) {
    try {
      const updatedCourse = await User.findOneAndUpdate({ _id: courseId }, courseInfo, {
        new: true,
      });
      return updatedCourse;
    } catch (error) {
      throw { message: 'Update course error', statusCode: 500 };
    }
  }

  public async addMembersToCourse(
    courseId: mongoose.Types.ObjectId,
    members: mongoose.Types.ObjectId[],
  ) {
    try {
      const addedMembers = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { members: members } },
        { new: true },
      );

      return addedMembers;
    } catch (error) {
      throw { message: 'Add members to course error', statusCode: 500 };
    }
  }

  public async searchMembersByName(
    courseId: mongoose.Types.ObjectId,
    name: string,
  ): Promise<userSearchResponse> {
    try {
      const result: userSearchResponse = {
        courseMember: [],
        outOfCourse: [],
      };
      const course = await Course.findById(courseId).populate('members');

      if (!course) {
        throw { message: 'Course not found', statusCode: 404 };
      }

      const members = course.members as unknown as IUser[];

      const filteredMembers = members.filter(
        member => new RegExp(name, 'i').test(member.name), // 'i' case-insensitive arama
      );

      if (filteredMembers.length > 0) {
        filteredMembers.forEach(member => {
          result.courseMember.push({
            _id: member._id,
            name: member.name,
          });
        });
      } else {
        const users = await User.find({ name: name });
        users.forEach(user => {
          result.outOfCourse.push({
            _id: user._id,
            name: user.name,
          });
        });
      }
      return result;
    } catch (error) {
      throw { message: 'Search members error', statusCode: 500 };
    }
  }
}

export default CourseService;
