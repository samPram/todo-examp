import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { TodoDto } from './dto/todo.dto';
import { Todo } from './entity/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}

  /**
   * Function for get all todo list
   *
   * @param {string} [activity_id='']
   * @return {*}
   * @memberof TodoService
   */
  async getAll(activity_id = '') {
    try {
      const data = this.todoRepository
        .createQueryBuilder('todo')
        .leftJoinAndSelect('todo.activity', 'activity');

      if (activity_id) {
        data.where('todo.activity_group_id =:id', { id: activity_id });
      }

      const result = await data.getMany();
      return { status: 'Success', message: 'Success', data: result };
    } catch (error) {
      throw new HttpException(error.message, error.getStatus());
    }
  }

  /**
   * Function for get one todo
   *
   * @param {number} id
   * @return {*}
   * @memberof TodoService
   */
  async getById(id: number) {
    try {
      const data = await this.todoRepository.findOneBy({ id });
      if (!data) {
        throw new NotFoundException(`Todo with ID ${id} Not Found`);
      }

      return {
        status: 'Success',
        message: 'Success',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
    }
  }

  /**
   * function for add todo item
   *
   * @param {TodoDto} data
   * @return {*}
   * @memberof TodoService
   */
  async addOneTodo(data: TodoDto) {
    try {
      const { title, activity_group_id } = data;

      if (!title || !activity_group_id) {
        throw new BadRequestException(
          `${!title ? 'title' : 'activity_group_id'} cannot be null`,
        );
      }

      const result = await this.todoRepository.create({
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        title: title,
        activity: {
          id: activity_group_id,
        },
      });

      await this.todoRepository.save(result);

      return {
        status: 'Success',
        message: 'Success',
        data: { activity_group_id, ...result },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
    }
  }

  /**
   * Function for delete one todo item
   *
   * @param {number} id
   * @return {*}
   * @memberof TodoService
   */
  async deleteById(id: number) {
    try {
      const data = await this.todoRepository.findOneBy({ id });

      if (!data) {
        throw new NotFoundException(`Todo with ID ${id} Not Found`);
      }

      await this.todoRepository.delete(id);

      return { status: 'Success', message: 'Success', data: {} };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
    }
  }

  /**
   * Function for update todo
   *
   * @param {number} id
   * @param {*} data
   * @return {*}
   * @memberof TodoService
   */
  async updateById(id: number, data: any) {
    try {
      const { priority = '', title = '', is_active = '' } = data;

      const item = await this.todoRepository.findOneBy({ id });

      if (!data) {
        throw new BadRequestException(`body cannot be null`);
      }

      if (!item) {
        throw new NotFoundException(`Todo with ID ${id} Not Found`);
      }

      const result = await this.todoRepository.save({
        id: id,
        title: title ? title : item.title,
        priority: priority ? priority : item.priority,
        is_active: is_active ? is_active : item.is_active,
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
      });

      return {
        status: 'Success',
        message: 'Success',
        data: result,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
    }
  }
}
