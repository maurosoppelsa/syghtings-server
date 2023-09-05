import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import userService from '@services/users.service';

class UsersController {
  public userService = new userService();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: User[] = await this.userService.findAllUser();
      res.status(200).json({ user: findAllUsersData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const findOneUserData: User = await this.userService.findUserById(userId);
      res.status(200).json({ user: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.userService.createUser(userData);
      res.status(201).json({ user: createUserData, message: 'created', success: true });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.userService.updateUser(userId, userData);
      res.status(200).json({ user: updateUserData, message: 'updated', success: true });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const deleteUserData: User = await this.userService.deleteUser(userId);
      res.status(200).json({ user: deleteUserData, message: 'deleted', success: true });
    } catch (error) {
      next(error);
    }
  };

  public verifyUserRegistration = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      const userRegistrationCode: number = parseInt(req.params.code);
      let isUserVerified = false;
      if (userRegistrationCode) {
        isUserVerified = await this.userService.verifyUser(userId, userRegistrationCode);
      } else {
        isUserVerified = await this.userService.checkUserRegistration(userId);
      }
      if (isUserVerified) {
        res.status(200).json({ message: 'User verified', verified: true });
      } else {
        res.status(400).json({ message: 'User not verified', verified: false });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public resendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = String(req.params.id);
      await this.userService.resendEmailVerification(userId);
      res.status(200).json({ message: 'Email sent' });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = String(req.params.email);
      await this.userService.sendResetEmailVerification(email);
      res.status(200).json({ message: 'Email sent', notified: true });
    } catch (error) {
      next(error);
    }
  };

  public verifyUserAllowResetPass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = String(req.params.email);
      const userRegistrationCode: number = parseInt(req.params.code);
      const allowResetPass = await this.userService.verifyUserRequestByEmail(email, userRegistrationCode);
      if (allowResetPass) {
        res.status(200).json({ message: 'User is allow to proceed', allowed: true });
      } else {
        res.status(401).json({ message: 'User is not allowed', allowed: false });
      }
    } catch (error) {
      next(error);
    }
  };

  public cancelResetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = String(req.params.email);
      const wasAbletoCancel = await this.userService.cancelResetPassword(email);
      if (wasAbletoCancel) {
        res.status(200).json({ message: 'Canceled', sucess: true });
      } else {
        res.status(401).json({ message: 'Invalid operation', success: false });
      }
    } catch (error) {
      next(error);
    }
  };

  public updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = String(req.body.email);
      const password = String(req.body.password);
      const wasAbletoUpdate = await this.userService.updateUserPassword(email, password);
      if (wasAbletoUpdate) {
        res.status(200).json({ message: 'Updated', sucess: true });
      } else {
        res.status(401).json({ message: 'Invalid operation', success: false });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
