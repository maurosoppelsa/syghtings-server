import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public id: string;

  @IsString()
  public username: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}
