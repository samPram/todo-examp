import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionsFilter } from './common/exceptions/exception.filter';
import { ActivityModule } from './models/activity/activity.module';
import { TodoModule } from './models/todo/todo.module';

@Module({
  imports: [ActivityModule, TodoModule],
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
