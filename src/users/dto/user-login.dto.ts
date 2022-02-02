import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserLoginDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
