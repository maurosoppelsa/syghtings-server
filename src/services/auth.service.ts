import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { LoginUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import userModel from '@models/users.model';
import { isEmpty } from '@utils/util';
import MongoService from '@services/mongo-service';

class AuthService {
  public users = userModel;
  private mongoService = new MongoService();

  public async login(userData: LoginUserDto): Promise<User> {
    await this.mongoService.connect();

    if (isEmpty(userData)) throw new HttpException(400, "You're not userData");

    const findUser = await this.users.findOne({ email: userData.email });

    if (!findUser) throw new HttpException(409, `User not found`);

    if (!findUser.verified) throw new HttpException(403, `User not verified`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");
    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = SECRET_KEY;
    // token expires in 14 days
    const expiresIn = 1209600;
    const now: number = Math.floor(Date.now() / 1000);
    const expiresAt: number = now + expiresIn;

    return { expiresIn: expiresAt, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }
}

export default AuthService;
