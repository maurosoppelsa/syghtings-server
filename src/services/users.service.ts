import { hash } from 'bcrypt';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import MongoService from '@services/mongo-service';

class UserService {
  public users = userModel;
  private mongoService = new MongoService();

  private handleUnexpectedError = err => {
    console.log(err);
    throw new HttpException(500, 'something went wrong, try later');
  };

  public async findAllUser(): Promise<User[]> {
    try {
      await this.mongoService.connect();
      const users: User[] = await this.users.find({});
      await this.mongoService.close();
      return users;
    } catch (err) {
      this.handleUnexpectedError(err);
    }
  }

  public async findUserById(userId: String): Promise<User> {
    try {
      await this.mongoService.connect();
      const findUser: User = await this.users.findOne({ _id: userId });
      if (!findUser) throw new HttpException(409, 'User not found');
      await this.mongoService.close();
      return findUser;
    } catch (err) {
      this.handleUnexpectedError(err);
    }
  }

  public async createUser(userData: User): Promise<User> {
    try {
      await this.mongoService.connect();
      if (isEmpty(userData)) throw new HttpException(400, 'Wrong user data');
      const findUser = await this.users.find({ username: userData.username });

      if (findUser.length !== 0) throw new HttpException(409, `The user ${userData.username} already exists`);

      const hashedPassword = await hash(userData.password, 10);
      const createUserData: User = { ...userData };
      const user = new userModel({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      });
      user.save(err => {
        if (err) {
          return err;
        }
      });
      await this.mongoService.close();
      return createUserData;
    } catch (err) {
      this.handleUnexpectedError(err);
    }
  }

  public async updateUser(userId: String, userData: CreateUserDto): Promise<User> {
    try {
      await this.mongoService.connect();
      if (isEmpty(userData)) throw new HttpException(400, 'Wrong user data');
      const findUser = await this.users.findByIdAndUpdate({ _id: userId }, userData);
      if (!findUser) throw new HttpException(409, 'User not found');
      await this.mongoService.close();
      return findUser;
    } catch (err) {
      this.handleUnexpectedError(err);
    }
  }

  public async deleteUser(userId: String): Promise<User> {
    try {
      await this.mongoService.connect();
      const findUser = this.users.findByIdAndRemove({ _id: userId });
      if (!findUser) throw new HttpException(409, 'User not found');
      await this.mongoService.close();
      return findUser;
    } catch (err) {
      this.handleUnexpectedError(err);
    }
  }
}

export default UserService;
