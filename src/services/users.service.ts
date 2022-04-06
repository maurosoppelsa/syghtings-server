import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import MongoService from '@services/mongo-service';

class UserService {
  private users = userModel;
  private mongoService = new MongoService();

  public async findAllUser(): Promise<User[]> {
    await this.mongoService.connect();
    const users: User[] = await this.users.find({});
    await this.mongoService.close();
    return users;
  }

  public async findUserById(userId: String): Promise<User> {
    await this.mongoService.connect();
    const findUser: User = await this.users.findOne({ _id: userId });
    if (!findUser) throw new HttpException(409, 'User not found');
    await this.mongoService.close();
    return findUser;
  }

  public async createUser(userData: User): Promise<User> {
    await this.mongoService.connect();
    if (isEmpty(userData)) throw new HttpException(400, 'Wrong user data');
    const findUser = await this.users.find({ $or: [{ username: userData.username }, { email: userData.email }] });
    if (findUser.length !== 0) throw new HttpException(409, `The user or email already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = { ...userData };
    const user = new userModel({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    });
    await user.save(async err => {
      if (err) {
        return err;
      } else {
        await this.mongoService.close();
      }
    });
    return createUserData;
  }

  public async updateUser(userId: String, userData: CreateUserDto): Promise<User> {
    await this.mongoService.connect();
    if (isEmpty(userData)) throw new HttpException(400, 'Wrong user data');
    const findUser = await this.users.findByIdAndUpdate({ _id: userId }, userData);
    if (!findUser) throw new HttpException(409, 'User not found');
    await this.mongoService.close();
    return findUser;
  }

  public async deleteUser(userId: String): Promise<User> {
    await this.mongoService.connect();
    const findUser = await this.users.findByIdAndRemove({ _id: userId });
    if (!findUser) throw new HttpException(409, 'User not found');
    await this.mongoService.close();
    return findUser;
  }
}

export default UserService;
