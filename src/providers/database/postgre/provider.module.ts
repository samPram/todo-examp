import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgresConfigModule } from 'src/config/database/config.module';
import { PostgresConfigService } from 'src/config/database/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [PostgresConfigModule],
      useFactory: async (postgresConfigService: PostgresConfigService) => ({
        ...postgresConfigService.databaseOption,
      }),
      inject: [PostgresConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class PostgresProvicerModule {}
