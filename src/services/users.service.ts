import { hash } from 'bcrypt';
import { UpdateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import MongoService from '@services/mongo.service';
import * as bcrypt from 'bcrypt';
import EmailService from '@services/email.service';
import regCodeModel from '@/models/reg-code.model';
import { logger } from '@/utils/logger';
import { EmailTypes } from '@/constants';
class UserService {
  private users = userModel;
  private regCodes = regCodeModel;
  private mongoService = new MongoService();
  private emailService = new EmailService();

  private generateValidationCode(): string {
    const codeLength = 6;
    let validationCode = '';

    for (let i = 0; i < codeLength; i++) {
      const randomDigit = Math.floor(Math.random() * 10);
      validationCode += randomDigit.toString();
    }
    return validationCode;
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

    const validationCode = this.generateValidationCode();

    const registrationCode = new regCodeModel({
      userId: user._id,
      code: validationCode,
      expiresAt: new Date(),
    });

    await Promise.all([registrationCode.save(), this.emailService.sendVerifyEmail(userData.email, validationCode, EmailTypes.REGISTRATION)]);
    createUserData.id = user._id.toString();
    createUserData.verified = false;
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
      logger.error(error);
      return false;
    }
  }

  public async deleteUser(userId: String): Promise<User> {
    await this.mongoService.connect();
    const findUser = await this.users.findByIdAndRemove({ _id: userId });
    if (!findUser) throw new HttpException(409, 'User not found');
    return findUser;
  }

  public async verifyUser(userId: String, code: number): Promise<boolean> {
    await this.mongoService.connect();
    return new Promise((resolve, reject) => {
      this.regCodes.findOne({ userId: userId, code: code }, async (err, code) => {
        if (err) {
          reject(err);
        }
        if (!code) {
          resolve(false);
        } else {
          await this.regCodes.deleteMany({ userId: userId });
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
        await this.regCodes.deleteMany({ userId: userId });
        const validationCode = this.generateValidationCode();
        const registrationCode = new regCodeModel({
          userId: user._id,
          code: validationCode,
          expiresAt: new Date(),
        });
        await Promise.all([registrationCode.save(), this.emailService.sendVerifyEmail(user.email, validationCode, EmailTypes.REGISTRATION)]);
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
        await this.regCodes.deleteMany({ userId: user._id });
        const validationCode = new regCodeModel({
          userId: user._id,
          code: this.generateValidationCode(),
          expiresAt: new Date(),
        });
        await validationCode.save();
        await this.emailService.sendVerifyEmail(email, validationCode.code.toString(), EmailTypes.RESET_PASSWORD);
        resolve(true);
      }
    });
  }

  public verifyUserRequestByEmail(email: string, code: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.mongoService.connect();
      this.users.findOne({ email }, async (err, user) => {
        if (err || !user) {
          reject(false);
        } else {
          await this.users.updateOne({ email: email }, { $set: { allowResetPassword: true } });
          resolve(await this.verifyUser(user.id, code));
        }
      });
    });
  }

  public async cancelResetPassword(email: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.mongoService.connect();
      const user = await this.users.findOne({ email });
      if (!user) {
        reject(false);
      } else {
        await this.regCodes.deleteMany({ userId: user._id });
        await this.users.updateOne({ _id: user._id }, { $set: { allowResetPassword: false } });
        resolve(true);
      }
    });
  }

  public async cleanupSubscriptions(): Promise<void> {
    await this.mongoService.connect();
    await this.users.find({ verified: false }, async (err, users) => {
      if (err) {
        logger.error(err);
      } else {
        for (const user of users) {
          await this.users.deleteOne({ _id: user._id });
        }
      }
    });
  }
}

export default UserService;
