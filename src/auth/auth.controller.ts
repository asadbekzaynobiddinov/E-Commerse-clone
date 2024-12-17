import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { OtpDto } from './dto/otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.register(user);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }

  @Post('verify')
  @HttpCode(200)
  verify(@Body() user: OtpDto) {
    return this.authService.verify(user.user_email, user.otp_code);
  }
}
