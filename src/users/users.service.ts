import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as knex from 'knex';
import { hashPassword } from 'src/utils/index';
import { ResponseMessage } from 'src/utils/interfaces';

@Injectable()
export class UsersService {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: knex.Knex) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseMessage> {
    const userExists: CreateUserDto[] = await this.knex('users')
      .select('email')
      .where('email', '=', createUserDto.email);

    if (userExists.length !== 0) {
      return {
        success: false,
        status: 409,
        message: 'Email already exists',
      };
    }

    createUserDto.password = await hashPassword(createUserDto.password);
    let result: CreateUserDto[] = await this.knex('users')
      .insert(createUserDto)
      .returning('*');
    result = result.map((user) => {
      delete user.password;
      return user;
    });
    return {
      success: true,
      status: 201,
      message: result,
    };
  }

  async findAll(page: number, limit: number): Promise<ResponseMessage> {
    const offset = (page - 1) * limit;
    let users: CreateUserDto[] = await this.knex('users')
      .select('*')
      .offset(offset)
      .limit(limit);

    if (users.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Users not found',
      };
    }

    users = users.map((user) => {
      delete user.password;
      return user;
    });

    return {
      success: true,
      status: 200,
      message: users,
    };
  }

  async findOne(id: string): Promise<ResponseMessage> {
    let dbResponse = await this.knex('users').select('*').where('id', '=', id);
    if (dbResponse.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'User not found',
      };
    }
    dbResponse = dbResponse.map((user) => {
      delete user.password;
      return user;
    });
    return {
      success: true,
      status: 200,
      message: dbResponse,
    };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseMessage> {
    const userExists: UpdateUserDto[] = await this.knex('users')
      .select('*')
      .where('id', '=', id);

    if (userExists.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'User not found',
      };
    }

    let updatedUser: UpdateUserDto[] = await this.knex('users')
      .update(updateUserDto)
      .where('id', '=', id)
      .returning('*');

    updatedUser = updatedUser.map((user) => {
      delete user.password;
      return user;
    });

    return {
      success: true,
      status: 200,
      message: updatedUser,
    };
  }

  async remove(id: string) {
    const userExists: UpdateUserDto[] = await this.knex('users')
      .select('*')
      .where('id', '=', id);

    if (userExists.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'User not found',
      };
    }

    let deletedUser: UpdateUserDto[] = await this.knex('users')
      .delete()
      .where('id', '=', id)
      .returning('*');

    deletedUser = deletedUser.map((user) => {
      delete user.password;
      return user;
    });

    return {
      success: true,
      status: 200,
      message: deletedUser,
    };
  }
}
