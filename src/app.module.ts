import { Module } from '@nestjs/common';
import { KnexModule } from './knex/knex.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AddressModule } from './address/address.module';

@Module({
  imports: [
    KnexModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AddressModule,
  ],
})
export class AppModule {}
