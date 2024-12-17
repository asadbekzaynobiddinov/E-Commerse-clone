import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashPassword } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const exitingUser = await this.userRepo.find({ where: { email } });

    if (exitingUser.length !== 0) {
      throw new ConflictException('Email already exists');
    }

    createUserDto.password = await hashPassword(createUserDto.password);

    const newUser = this.userRepo.create(createUserDto);
    await this.userRepo.save(newUser);
    delete newUser.password;

    return newUser;
  }

  async findAll(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit;
    let users = await this.userRepo.find({
      skip,
      take: limit,
    });

    if (users.length === 0) {
      throw new NotFoundException('Users not found');
    }

    users = users.map((user) => {
      delete user.password;
      return user;
    });
    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    delete user.password;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const result = await this.userRepo.update(id, updateUserDto);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return 'User updated successfuly';
  }

  async remove(id: string) {
    const result = await this.userRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User Not Found');
    }
    return 'User deleted successfuly';
  }
}
