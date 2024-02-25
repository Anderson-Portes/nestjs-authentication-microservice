import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ProfileDto {
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  roleId: string;
}
