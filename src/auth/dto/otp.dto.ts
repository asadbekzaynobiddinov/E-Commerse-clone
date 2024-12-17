import { IsEmail, IsNumber, IsOptional } from 'class-validator';

export class OtpDto {
  @IsEmail()
  user_email: string;

  @IsNumber()
  otp_code: number;

  @IsOptional()
  expire_time: Date;
}
