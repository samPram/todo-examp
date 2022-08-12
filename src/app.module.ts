import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionsFilter } from './common/exceptions/exception.filter';
import { AppConfigModule } from './config/app/config.module';
import { ActivityModule } from './models/activity/activity.module';
import { TodoModule } from './models/todo/todo.module';
import { PostgresProvicerModule } from './providers/database/postgre/provider.module';

@Module({
  imports: [
    AppConfigModule,
    PostgresProvicerModule,
    ActivityModule,
    TodoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsFilter,
    },
  ],
})
export class AppModule {}
