import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as Joi from 'joi';

import { AppConfigService } from './config.service';
import configuration from './configuration';

const ENV = process.env.NODE_ENV;
console.log(ENV);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env.dev' : `.env.${ENV}`,
      validationSchema: Joi.object({
        PORT: Joi.number(),
      }),
      load: [configuration],
      // LOAD FROM RUNTIME ENV OS SHELL
      // ignoreEnvFile: true,
      // Increase performence
      cache: true,
    }),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
