import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TodoDto } from './dto/todo.dto';
import { TodoService } from './todo.service';

@Controller('todo-items')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllTodo(@Query('activity_group_id') activity_id: string) {
    return this.todoService.getAll(activity_id);
  }

  @Get(':id')
  getOneTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.getById(id);
  }

  @Post()
  postTodo(@Body() data: TodoDto) {
    return this.todoService.addOneTodo(data);
  }

  @Delete(':id')
  deleteTodo(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.deleteById(id);
  }

  @Patch(':id')
  updateTodo(@Body() data: any, @Param('id', ParseIntPipe) id: number) {
    return this.todoService.updateById(id, data);
  }
}
