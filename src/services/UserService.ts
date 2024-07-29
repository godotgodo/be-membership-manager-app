import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import Course from '../models/Course';

class UserService {
  public async getUsers(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (error) {
      throw { message: 'Failed to fetch users', statusCode: 500 };
    }
  }

  public async createUser(userData: IUser): Promise<IUser> {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw { message: 'Failed to create user', statusCode: 500 };
    }
  }

  public async searchUsers(
    name?: string,
    courseId?: mongoose.Types.ObjectId,
  ): Promise<Partial<IUser[]>> {
    try {
      if (name && !courseId) {
        const users = await User.find({ name: name });
        return users;
      } else if (!name && courseId) {
        const users = (await Course.findById(courseId)
          .populate('members')
          .select('members')) as unknown as IUser[];
        return users;
      } else if (name && courseId) {
        const course = await Course.findById(courseId).populate('members');

        if (!course) {
          throw { message: 'Course not found', statusCode: 404 };
        }

        const members = course.members as unknown as IUser[];

        const filteredMembers = members.filter(
          member => new RegExp(name, 'i').test(member.name), // 'i' case-insensitive arama
        );

        if (filteredMembers.length > 0) {
          const result = filteredMembers.map(member => ({
            _id: member._id,
            name: member.name,
          })) as Partial<IUser[]>;
          return result;
        }
      }
      return [];
    } catch (error) {
      throw { message: 'Failed to search user by name', statusCode: 500 };
    }
  }
}

export default UserService;
