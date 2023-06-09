import { Request } from 'express';
import { User } from '@interfaces/users.interface';

export interface DataStoredInToken {
  id: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RegistrationToken {
  userId: string;
  token: string;
  expiresAt: Date;
}

export interface RequestWithUser extends Request {
  user: User;
}
