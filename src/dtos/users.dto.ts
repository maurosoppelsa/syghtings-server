import { IsEmail, IsString, NotEquals, ValidateIf } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  @IsString()
  public name: string;

  @IsString()
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  public occupation: string;
}

export class UpdateUserDto {
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public id?: string;

  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public name?: string;

  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public lastName?: string;

  @IsEmail()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public email?: string;

  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public password?: string;

  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public newPassword?: string;

  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public occupation?: string;
}

export class LoginUserDto {
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public id?: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;
}
