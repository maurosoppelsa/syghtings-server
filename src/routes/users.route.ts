import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto, ForgotPasswordDto, ResendVerificationEmailDto, UpdatePasswordDto, UpdateUserDto, VerifyUserDto } from '@dtos/users.dto';
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
    // for some reason if I move this route to the top of the file it doesn't break
    this.router.put(`${this.path}/auth-update-password`, validationMiddleware(UpdatePasswordDto, 'body'), this.usersController.updatePassword);

    this.router.get(`${this.path}`, authMiddleware, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, authMiddleware, this.usersController.getUserById);
    this.router.get(`${this.path}/verify/:id/:token?`, validationMiddleware(VerifyUserDto, 'params'), this.usersController.verifyUserRegistration);
    this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.put(`${this.path}/:id`, authMiddleware, validationMiddleware(UpdateUserDto, 'body', true), this.usersController.updateUser);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.usersController.deleteUser);
    this.router.get(
      `${this.path}/resend-verification/:id`,
      validationMiddleware(ResendVerificationEmailDto, 'params'),
      this.usersController.resendVerificationEmail,
    );
    this.router.get(`${this.path}/forgot-password/:email`, validationMiddleware(ForgotPasswordDto, 'params'), this.usersController.forgotPassword);
    this.router.get(
      `${this.path}/auth-reset-password/:id/:token?`,
      validationMiddleware(VerifyUserDto, 'params'),
      this.usersController.verifyResetPassword,
    );
    this.router.get(
      `${this.path}/auth-verify-allow-reset/:email`,
      validationMiddleware(ForgotPasswordDto, 'params'),
      this.usersController.verifyUserAllowResetPass,
    );
    this.router.get(
      `${this.path}/auth-cancel-reset-password/:email`,
      validationMiddleware(ForgotPasswordDto, 'params'),
      this.usersController.cancelResetPassword,
    );
  }
}

export default UsersRoute;
