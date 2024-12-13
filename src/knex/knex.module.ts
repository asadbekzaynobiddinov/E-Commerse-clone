import { Module, Global } from '@nestjs/common';
import * as knex from 'knex';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'KNEX_CONNECTION',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return knex({
          client: 'pg',
          connection: {
            host: configService.get<string>('PG_HOST'),
            user: configService.get<string>('PG_USER'),
            password: configService.get<string>('PG_PASSWORD'),
            database: configService.get<string>('PG_DATABASE'),
            port: configService.get<number>('PG_PORT'),
          },
        });
      },
    },
  ],
  exports: ['KNEX_CONNECTION'],
})
export class KnexModule {}
