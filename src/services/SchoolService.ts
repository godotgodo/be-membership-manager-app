import { ObjectId } from 'mongoose';
import User, { ISchool } from '../models/User';

class SchoolService {
  public async createSchool(
    userId: ObjectId,
    schoolData: ISchool,
  ): Promise<ISchool> {
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
}

export default SchoolService;
