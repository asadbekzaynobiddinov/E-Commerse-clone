import {
  IsString,
  IsEmail,
  IsDate,
  IsOptional,
  Length,
  Matches,
  IsEnum,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  @Length(1, 50, { message: 'Name must be between 1 and 50 characters' })
  name: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  @Length(6, 100, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  role?: 'user' | 'admin';

  @IsOptional()
  @IsDate({ message: 'Invalid birth of date' })
  birth_of_date?: Date;

  @IsString()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'Phone number must be valid and contain 10-15 digits',
  })
  phone_number: string;
}
