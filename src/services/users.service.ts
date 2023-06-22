import { hash } from 'bcrypt';
import { UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import MongoService from '@services/mongo-service';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import EmailService from './email.service';
import regTokenModel from '@/models/reg-token.model';
class UserService {
  private users = userModel;
  private regTokens = regTokenModel;
  private mongoService = new MongoService();

  private generateRegistrationToken(): string {
    const jwtSecret = 'mysecretstring';
    const jwtExpirationTime = '1h';
    const payload = {
      type: 'registration',
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpirationTime });
    return token;
  }

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

    const registrationToken = new regTokenModel({
      userId: user._id,
      token: this.generateRegistrationToken(),
      expiresAt: new Date(),
    });

    await Promise.all([registrationToken.save(), EmailService.sendRegistrationEmail(userData.email, user._id, this.generateRegistrationToken())]);
    createUserData.id = user._id.toString();
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

  public async verifyUser(userId: String, token: String): Promise<boolean> {
    await this.mongoService.connect();
    return new Promise((resolve, reject) => {
      this.regTokens.findOne({ userId: userId, token: token }, async (err, token) => {
        if (err || !token) {
          reject(false);
        } else {
          await this.regTokens.deleteMany({ userId: userId });
          await this.users.updateOne({ _id: userId }, { $set: { verified: true } });
          resolve(true);
        }
      });
    });
  }

  public async checkUserRegistration(userId: String): Promise<boolean> {
    await this.mongoService.connect();
    return new Promise((resolve, reject) => {
      this.users.findOne({ _id: userId }, async (err, user) => {
        if (err || !user) {
          console.log('user', user);
          console.log('err', err);
          reject(false);
        } else {
          resolve(user.verified);
        }
      });
    });
  }

  public resendEmailVerification(userId: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.mongoService.connect();
      const user = await this.users.findById(userId);
      if (!user) {
        reject(false);
      } else {
        await this.regTokens.deleteMany({ userId: userId });
        const registrationToken = new regTokenModel({
          userId: user._id,
          token: this.generateRegistrationToken(),
          expiresAt: new Date(),
        });
        await Promise.all([registrationToken.save(), EmailService.sendRegistrationEmail(user.email, user._id, this.generateRegistrationToken())]);
        resolve(true);
      }
    });
  }
}

export default UserService;
