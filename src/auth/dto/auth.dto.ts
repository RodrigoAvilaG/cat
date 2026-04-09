import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Should be a valid email' })
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'The password should contain at least 6 characters' })
  password!: string;
}