import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { PostgresConfigService } from './config.service';

import configuration from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
      load: [configuration],
    }),
  ],
  providers: [ConfigService, PostgresConfigService],
  exports: [ConfigService, PostgresConfigService],
})
export class PostgresConfigModule {}
