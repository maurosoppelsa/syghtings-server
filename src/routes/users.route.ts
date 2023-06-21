import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, authMiddleware, this.usersController.getUserById);
    this.router.get(`${this.path}/verify/:id/:token?`, this.usersController.verifyUserRegistration);
    //this.router.get(`${this.path}/resend-verification/:id`, this.usersController.resendVerificationEmail);
    //this.router.get(`${this.path}/forgot-password/:id`, this.usersController.forgotPassword);
    this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(UpdateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.usersController.deleteUser);
  }
}

export default UsersRoute;
