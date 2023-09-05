import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RegistrationCode {
  userId: string;
  code: number;
  expiresAt: Date;
}

export interface RequestWithUser extends Request {
  user: User;
}
