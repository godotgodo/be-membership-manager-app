import mongoose, { ObjectId } from 'mongoose';
import User, { ISchool } from '../models/User';

class SchoolService {
  public async getAll(userId: mongoose.Types.ObjectId): Promise<ISchool[]> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw { message: 'User not found', statusCode: 404 };
      }

      return user.schools;
    } catch (error) {
      throw {
        message: 'Failed to retrieve schools',
        statusCode: 500,
      };
    }
  }

  public async getSchoolById(
    userId: mongoose.Types.ObjectId,
    schoolId: mongoose.Types.ObjectId,
  ): Promise<ISchool> {
    try {
      const user = await User.findOne({
        _id: userId,
        'schools._id': schoolId,
      }).exec();
      if (!user) {
        throw { message: 'User or school not found', statusCode: 404 };
      }

      return user.schools[user.schools.length - 1];
    } catch (error) {
      throw {
        message: 'Failed to retrieve school',
        statusCode: 500,
      };
    }
  }

  public async createSchool(userId: ObjectId, schoolData: ISchool): Promise<ISchool> {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $push: { schools: schoolData },
        },
        { new: true },
      );

      if (!updatedUser) {
        throw { message: 'User not found', statusCode: 404 };
      } else {
        //temporarly
        return updatedUser.schools[updatedUser.schools.length - 1];
      }
    } catch (error) {
      throw { message: 'Failed to create school', statusCode: 500 };
    }
  }

  public async updateSchool(
    userId: mongoose.Types.ObjectId,
    schoolId: mongoose.Types.ObjectId,
    schoolData: Partial<ISchool>,
  ): Promise<ISchool> {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId, 'schools._id': schoolId },
        { $set: { 'schools.$': schoolData } },
        { new: true },
      );

      if (!updatedUser) {
        throw { message: 'School or user not found', statusCode: 404 };
      }

      //temporarily
      return updatedUser.schools[updatedUser.schools.length - 1];
    } catch (error) {
      throw {
        message: 'Failed to update school',
        statusCode: 500,
      };
    }
  }

  public async deleteSchool(
    userId: mongoose.Types.ObjectId,
    schoolId: mongoose.Types.ObjectId,
  ): Promise<ISchool> {
    try {
      const user = await User.findOneAndUpdate(
        { _id: userId, 'schools._id': schoolId },
        { $pull: { schools: { _id: schoolId } } },
        { new: true },
      );

      if (!user) {
        throw { message: 'User or school not found', statusCode: 404 };
      }
      //temporarly
      return user.schools[user.schools.length - 1];
    } catch (error) {
      throw { message: 'School delate failed', statusCode: 500 };
    }
  }
}

export default SchoolService;
