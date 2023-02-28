import { IsEmail, IsString, NotEquals, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  @IsString()
  public username: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public occupation: string;
}

export class LoginUserDto {
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public id?: string;

  @IsString()
  public username: string;

  @IsString()
  public password: string;
}
