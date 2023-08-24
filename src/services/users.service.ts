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
  private emailService = new EmailService();

  private generateValidationToken(): string {
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
      token: this.generateValidationToken(),
      expiresAt: new Date(),
    });

    await Promise.all([registrationToken.save(), this.emailService.sendRegistrationEmail(userData.email, user._id, this.generateValidationToken())]);
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

  public async updateUserPassword(email: string, password: string): Promise<boolean> {
    try {
      const saltRounds = 10;
      await this.mongoService.connect();
      const user = await this.users.findOne({ email });
      if (!user) {
        return false;
      }
      if (!user.allowResetPassword) {
        return false;
      }
      const newPassword = await bcrypt.hash(password, saltRounds);
      await this.users.updateOne({ email }, { $set: { allowResetPassword: false, password: newPassword } });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async deleteUser(userId: String): Promise<User> {
    await this.mongoService.connect();
    const findUser = await this.users.findByIdAndRemove({ _id: userId });
    if (!findUser) throw new HttpException(409, 'User not found');
    return findUser;
  }

  public async verifyUser(userId: String, token: String, allowResetPass = false): Promise<boolean> {
    await this.mongoService.connect();
    return new Promise((resolve, reject) => {
      this.regTokens.findOne({ userId: userId, token: token }, async (err, token) => {
        if (err || !token) {
          reject(false);
        } else {
          await this.regTokens.deleteMany({ userId: userId });
          if (allowResetPass) {
            await this.users.updateOne({ _id: userId }, { $set: { allowResetPassword: true } });
          } else {
            await this.users.updateOne({ _id: userId }, { $set: { verified: true } });
          }
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
          token: this.generateValidationToken(),
          expiresAt: new Date(),
        });
        await Promise.all([registrationToken.save(), this.emailService.sendRegistrationEmail(user.email, user._id, this.generateValidationToken())]);
        resolve(true);
      }
    });
  }

  public async sendResetEmailVerification(email: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.mongoService.connect();
      const user = await this.users.findOne({ email });
      if (!user) {
        reject(false);
      } else {
        await this.regTokens.deleteMany({ userId: user._id });
        const validationToken = new regTokenModel({
          userId: user._id,
          token: this.generateValidationToken(),
          expiresAt: new Date(),
        });
        await validationToken.save();
        await this.emailService.sendResetEmail(email, user._id, validationToken.token);
        resolve(true);
      }
    });
  }

  public verifyUserRequestByEmail(email: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.mongoService.connect();
      const user = await this.users.findOne({ email });
      if (!user) {
        reject(false);
      }
      resolve(user.allowResetPassword);
    });
  }

  public async cancelResetPassword(email: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.mongoService.connect();
      const user = await this.users.findOne({ email });
      if (!user) {
        reject(false);
      } else {
        await this.regTokens.deleteMany({ userId: user._id });
        await this.users.updateOne({ _id: user._id }, { $set: { allowResetPassword: false } });
        resolve(true);
      }
    });
  }
}

export default UserService;
