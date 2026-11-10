import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassWord: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassWord: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  confirmPassWord: string;
}
