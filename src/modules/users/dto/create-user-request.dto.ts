import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsNumber()
  @IsNotEmpty()
  phone: number;
}
