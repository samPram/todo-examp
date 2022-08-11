import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { writeFileSync } from 'fs';
import * as TODO from '../../common/constants/TODO.json';
import { TodoDto } from './dto/todo.dto';

@Injectable()
export class TodoService {
  private saveFile(data) {
    const list_json = JSON.stringify(data);
    // Write testlist back to the file
    writeFileSync(
      `${process.cwd()}/src/common/constants/TODO.json`,
      list_json,
      'utf8',
    );
  }

  /**
   * Function for get all todo list
   *
   * @param {string} [activity_id='']
   * @return {*}
   * @memberof TodoService
   */
  getAll(activity_id = '') {
    let result;

    if (activity_id) {
      result = TODO.filter((obj) => {
        return obj.activity_group_id === activity_id;
      });
    } else {
      result = TODO;
    }

    return { status: 'Success', message: 'Success', data: result };
  }

  /**
   * Function for get one todo
   *
   * @param {number} id
   * @return {*}
   * @memberof TodoService
   */
  getById(id: number) {
    const result = TODO.find((obj) => obj.id === id);

    if (!result) {
      throw new NotFoundException(`Todo with ID ${id} Not Found`);
    }

    return {
      status: 'Success',
      message: 'Success',
      data: result,
    };
  }

  /**
   * function for add todo item
   *
   * @param {TodoDto} data
   * @return {*}
   * @memberof TodoService
   */
  addOneTodo(data: TodoDto) {
    const { title, activity_group_id } = data;

    const data_all: Array<Todo> = TODO;

    if (!title || !activity_group_id) {
      throw new BadRequestException(
        `${!title ? 'title' : 'activityID'} cannot be null`,
      );
    }

    const payload = {
      id: Math.max(...TODO.map((o) => o.id)) + 1,
      activity_group_id: activity_group_id.toString(),
      title,
      is_active: '1',
      priority: 'very-high',
      created_at: `${new Date().toISOString()}`,
      updated_at: `${new Date().toISOString()}`,
      deleted_at: null,
    };

    // add data
    data_all.push(payload);

    // save file
    this.saveFile(data_all);

    return {
      status: 'Success',
      message: 'Success',
      data: payload,
    };
  }

  /**
   * Function for delete one todo item
   *
   * @param {number} id
   * @return {*}
   * @memberof TodoService
   */
  deleteById(id: number) {
    const data: Array<Todo> = TODO;
    const find_one = data.find((item) => {
      return item?.id === id;
    });

    if (!find_one) {
      throw new NotFoundException(`Todo with ID ${id} Not Found`);
    }

    const result = data.filter((item) => {
      return item?.id !== id;
    });

    this.saveFile(result);

    return { status: 'Success', message: 'Success', data: {} };
  }

  /**
   * Function for update todo
   *
   * @param {number} id
   * @param {*} data
   * @return {*}
   * @memberof TodoService
   */
  updateById(id: number, data: any) {
    const { activity_group_id = '', title = '' } = data;
    const data_all: Array<Todo> = TODO;

    const find_one = data_all.find((item) => {
      return item?.id === id;
    });

    if (!data) {
      throw new BadRequestException(`body cannot be null`);
    }

    if (!find_one) {
      throw new NotFoundException(`Todo with ID ${id} Not Found`);
    }

    const index = data_all.findIndex((obj) => obj.id === id);

    data_all[index] = {
      ...find_one,
      activity_group_id: activity_group_id
        ? activity_group_id
        : find_one?.activity_group_id,
      title: title ? title : find_one?.title,
      updated_at: `${new Date().toISOString()}`,
    };

    this.saveFile(data_all);

    return {
      status: 'Success',
      message: 'Success',
      data: data_all[index],
    };
  }
}
