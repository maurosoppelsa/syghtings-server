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
      const userRegistrationToken: string = req.params.token;
      const isUserVerified: boolean = await this.userService.verifyUser(userId, userRegistrationToken);
      if (isUserVerified) {
        res.status(200).json({ message: 'User verified', success: true });
      } else {
        res.status(400).json({ message: 'User not verified', success: false });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
