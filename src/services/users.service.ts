import { hash } from 'bcrypt';
import { UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import MongoService from '@services/mongo-service';
import * as bcrypt from 'bcrypt';

class UserService {
  private users = userModel;
  private mongoService = new MongoService();

  public async findAllUser(): Promise<User[]> {
    await this.mongoService.connect();
    const users: User[] = await this.users.find({});
    return users;
  }

  public async findUserById(userId: String): Promise<User> {
    await this.mongoService.connect();
    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, 'User not found');
    return findUser;
  }

  public async createUser(userData: User): Promise<User> {
    await this.mongoService.connect();
    if (isEmpty(userData)) throw new HttpException(400, 'Wrong user data');
    const findUser = await this.users.find({ $or: [{ email: userData.email }] });
    if (findUser.length !== 0) throw new HttpException(409, `The email already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = { ...userData };
    const user = new userModel({
      name: userData.name,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      occupation: userData.occupation,
    });
    await user.save(async err => {
      if (err) {
        return err;
      }
    });
    return createUserData;
  }

  public async updateUser(userId: string, userData: UpdateUserDto): Promise<User> {
    const saltRounds = 10;

    await this.mongoService.connect();
    if (isEmpty(userData)) throw new HttpException(400, 'Wrong user data');

    const user = await this.users.findById(userId);
    if (!user) {
      throw new HttpException(409, 'User not found');
    }

    // check if newPassword exists and update password if both passwords are provided in input
    if ('newPassword' in userData && userData.password) {
      const isMatch: boolean = await bcrypt.compare(userData.password, user.password);
      if (!isMatch) throw new HttpException(400, 'Invalid password');

      user.password = await bcrypt.hash(userData.newPassword, saltRounds);
    }

    // update non-password fields and save the user
    Object.keys(userData).forEach(key => {
      if (key !== 'password') {
        user[key] = userData[key];
      }
    });

    await user.save();

    return user;
  }

  public async deleteUser(userId: String): Promise<User> {
    await this.mongoService.connect();
    const findUser = await this.users.findByIdAndRemove({ _id: userId });
    if (!findUser) throw new HttpException(409, 'User not found');
    return findUser;
  }
}

export default UserService;
