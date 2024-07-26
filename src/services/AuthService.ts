import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import getConfig from '../config/getConfig';

const config = getConfig();
class AuthService {
  private jwtString: string;

  constructor() {
    this.jwtString = config.JWT_SECRET;
  }

  public async register(userData: IUser): Promise<IUser> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
      });
      return await user.save();
    } catch (error) {
      throw { message: 'Failed to register user', statusCode: 500 };
    }
  }

  public async login(
    email: string,
    password: string,
  ): Promise<{ user: IUser; token: string }> {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw { message: 'Invalid email or password', statusCode: 401 };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw { message: 'Invalid email or password', statusCode: 401 };
      }

      const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, {
        expiresIn: '1h',
      });

      //TODO, the password will be remove, btw generally solution maybe more rasionable
      return { user, token };
    } catch (error) {
      throw { message: 'Failed to login', statusCode: 500 };
    }
  }

  public async getUserById(userId: string) {
    try {
      return await User.findById(userId).exec();
    } catch (error) {
      throw new Error('User lookup failed');
    }
  }
}

export default AuthService;
