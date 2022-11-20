import { IsString, NotEquals, ValidateIf, IsObject } from 'class-validator';

export class CreateSightDto {
  @IsString()
  @NotEquals(null)
  @ValidateIf((object, value) => value !== undefined)
  public id?: string;

  @IsString()
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
