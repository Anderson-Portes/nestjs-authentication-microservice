import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  name: string;
}
