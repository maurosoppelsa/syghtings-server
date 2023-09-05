import { IsEmail, IsNumberString, IsOptional, IsString, Length, NotEquals, ValidateIf } from 'class-validator';

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

export class VerifyUserDto {
  @IsString()
  public id: string;

  @IsOptional()
  @IsNumberString()
  @Length(6, 6)
  public code?: number;
}

export class ResendVerificationEmailDto {
  @IsString()
  @NotEquals(null)
  public id: string;
}

export class ForgotPasswordDto {
  @IsString()
  @NotEquals(null)
  public email: string;

  @IsOptional()
  @IsNumberString()
  @Length(6, 6)
  public code?: number;
}

export class UpdatePasswordDto {
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public email: string;

  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public password: string;
}
