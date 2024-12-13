import { Inject, Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import * as knex from 'knex';
import { ResponseMessage } from 'src/utils/index';

@Injectable()
export class AddressService {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: knex.Knex) {}
  async create(createAddressDto: CreateAddressDto): Promise<ResponseMessage> {
    const createdAddress = await this.knex('address')
      .insert(createAddressDto)
      .returning('*');
    if (createdAddress.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Address not found',
      };
    }
    return {
      success: true,
      status: 200,
      message: createdAddress[0],
    };
  }

  async findAll(page: number, limit: number): Promise<ResponseMessage> {
    const offset = (page - 1) * limit;
    const address: CreateAddressDto[] = await this.knex('address')
      .select('*')
      .offset(offset)
      .limit(limit);
    if (address.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Address not found',
      };
    }
    return {
      success: true,
      status: 200,
      message: address,
    };
  }

  async findOne(id: string): Promise<ResponseMessage> {
    const address: CreateAddressDto[] = await this.knex('address')
      .select('*')
      .where('id', '=', id);
    if (address.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Address not found',
      };
    }
    return {
      success: true,
      status: 200,
      message: address,
    };
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<ResponseMessage> {
    const updatedAddress: UpdateAddressDto[] = await this.knex('address')
      .update(updateAddressDto)
      .where('id', '=', id)
      .returning('*');
    if (updatedAddress.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Address not found',
      };
    }
    return {
      success: true,
      status: 200,
      message: updatedAddress,
    };
  }

  async remove(id: string): Promise<ResponseMessage> {
    const deletedAddress: UpdateAddressDto[] = await this.knex('address')
      .delete()
      .where('id', '=', id)
      .returning('*');
    if (deletedAddress.length === 0) {
      return {
        success: false,
        status: 404,
        message: 'Address not found',
      };
    }
    return {
      success: true,
      status: 200,
      message: deletedAddress,
    };
  }
}
