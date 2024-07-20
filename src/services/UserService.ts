import User, { IUser } from '../models/User';

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
}

export default UserService;
