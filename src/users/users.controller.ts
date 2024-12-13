import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { ResponseMessage, responseHandler } from 'src/utils/index';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const result: ResponseMessage =
      await this.usersService.create(createUserDto);
    responseHandler(res, result);
  }

  @Get()
  async findAll(
    @Query() query: { limit: number; page: number },
    @Res() res: Response,
  ) {
    const page: number = query.page || 1;
    const limit: number = query.limit || 10;

    const result: ResponseMessage = await this.usersService.findAll(
      page,
      limit,
    );

    responseHandler(res, result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result: ResponseMessage = await this.usersService.findOne(id);
    responseHandler(res, result);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res: Response,
  ) {
    const result: ResponseMessage = await this.usersService.update(
      id,
      updateUserDto,
    );
    responseHandler(res, result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result: ResponseMessage = await this.usersService.remove(id);
    responseHandler(res, result);
  }
}
