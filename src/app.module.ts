import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityModule } from './models/activity/activity.module';
import { TodoModule } from './models/todo/todo.module';

@Module({
  imports: [ActivityModule, TodoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
