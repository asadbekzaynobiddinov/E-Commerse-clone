import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';
import { comparePasswords, hashPassword } from 'src/utils/index';
import { JwtService } from '@nestjs/jwt';
import { Otp } from './entities/otp.entity';
import { MailService } from './mail.service';
import { generateOtp } from 'src/utils/otp';
import { OtpDto } from './dto/otp.dto';

config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
    private readonly jwt: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(user: CreateUserDto) {
    const { email } = user;
    const userExists = await this.userRepo.find({ where: { email } });

    if (userExists.length !== 0) {
      throw new ConflictException('Email already exists');
    }

    user.password = await hashPassword(user.password);

    const newUser = this.userRepo.create(user);
    await this.userRepo.save(newUser);

    const otpCode = generateOtp();

    const DbOtp: OtpDto = {
      user_email: newUser.email,
      otp_code: otpCode,
      expire_time: new Date(Date.now() + 10 * 60 * 1000),
    };

    const newDbOtp = this.otpRepo.create(DbOtp);
    await this.otpRepo.save(newDbOtp);

    this.mailService.sendMail(newUser.email, 'Verification code', otpCode);

    return `"${newUser.email}"  manziliga tasdiqlash kodi yuborildi`;
  }

  async login(user: LoginDto) {
    const currentUser = await this.userRepo.findOne({
      where: { email: user.email },
    });

    if (!currentUser) {
      throw new BadRequestException('Email or password incorrect');
    }

    const passwordsEqual = await comparePasswords(
      user.password,
      currentUser.password,
    );

    if (!passwordsEqual) {
      throw new BadRequestException('Email or password incorrect');
    }

    if (!currentUser.is_active) {
      throw new BadRequestException('User is no active');
    }

    const payload = {
      sub: currentUser.id,
      role: currentUser.role,
    };

    const accessToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRER,
      expiresIn: '1d',
    });

    const refreshToken = this.jwt.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verify(email: string, otp: number) {
    const currentOtp = await this.otpRepo.findOne({
      where: { user_email: email },
    });

    if (!currentOtp) {
      throw new NotFoundException(`Otp: ${otp} not found`);
    }

    if (Date.now() > currentOtp.expire_time.getTime()) {
      await this.otpRepo.delete({ id: currentOtp.id });
      await this.userRepo.delete(email);
      throw new ConflictException(`This OTP: ${otp} is expires`);
    }

    await this.userRepo.update({ email }, { is_active: true });

    return 'user is active';
  }
}
