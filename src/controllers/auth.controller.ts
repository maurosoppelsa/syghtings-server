import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const findUser = await this.authService.login(userData);
      const tokenData = this.authService.createToken(findUser);
      res.status(200).json({ sessionToken: { token: tokenData.token, expiresIn: tokenData.expiresIn }, user: findUser, success: true });
    } catch (error) {
      if (error.status === 403) {
        res.status(403).json({ message: error.message, success: false, verified: false });
      }
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
