import { IsString, NotEquals, ValidateIf, IsObject, IsOptional, ValidateNested } from 'class-validator';

export class BaseSightDto {
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public id?: string;

  @IsString()
  @IsOptional()
  public province: string;

  @IsString()
  public condition: string;

  @IsString()
  public placeName: string;

  @IsString()
  public animal: string;

  @IsObject()
  public picture: Object;

  @IsObject()
  public location: Object;

  @IsString()
  public description: string;

  @IsString()
  public createdAt: string;

  @IsString()
  public userId: string;
}

export class UpdateSightDto extends BaseSightDto {
  @IsOptional()
  @IsString()
  public imageId: string;

  @IsOptional()
  public sight: BaseSightDto | string;

  @IsOptional()
  @IsString()
  public photo: Object;
}

export class CreateSightDto {
  @IsString()
  public sight: BaseSightDto;

  @IsString()
  public photo: Object;
}

export class GetSightImageDto {
  @IsString()
  public imageId: string;
}
