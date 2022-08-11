import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as ACTIVITY from '../../common/constants/ACTIVITY.json';
import * as bcrypt from 'bcrypt';
import { ActivityDto } from './dto/activity.dto';
import { readFileSync, writeFileSync } from 'fs';

@Injectable()
export class ActivityService {
  /**
   * Private function for saving JSON file
   *
   * @private
   * @param {*} data
   * @memberof ActivityService
   */
  private saveFile(data) {
    const list_json = JSON.stringify(data);
    // Write testlist back to the file
    writeFileSync(
      `${process.cwd()}/src/common/constants/ACTIVITY.json`,
      list_json,
      'utf8',
    );
  }

  /**
   * Function for get all activity from JSON data activity
   *
   * @return {*}
   * @memberof ActivityService
   */
  getAll() {
    const data = ACTIVITY.map((obj) => {
      // hash email
      const name = obj?.email.split('@');

      const hash_email = bcrypt.hashSync(name[0], 10);
      return {
        ...obj,
        email: hash_email + '@' + name[1],
      };
    });

    return {
      status: 'Success',
      message: 'Success',
      data: data,
    };
  }

  /**
   * Function for get one activity
   *
   * @param {number} id
   * @return {*}
   * @memberof ActivityService
   */
  async getOne(id: number) {
    // DB replacement
    const data: Array<Activity> = ACTIVITY;

    const result = data.find((item) => {
      return item?.id === id;
    });

    if (!result) {
      throw new NotFoundException(`Activity with ID ${id} Not Found`);
    }

    // encode email
    const name = result?.email.split('@');

    const hash_email = await bcrypt.hash(name[0], 10);

    return {
      status: 'Success',
      message: 'Success',
      data: { ...result, email: hash_email + '@' + name[1] },
    };
  }

  /**
   * Function for add activity
   *
   * @param {ActivityDto} data
   * @return {*}
   * @memberof ActivityService
   */
  addActivity(data: ActivityDto) {
    const { email, title } = data;

    const data_all = ACTIVITY;

    if (!title || !email) {
      throw new BadRequestException(
        `${!email ? 'email' : 'title'} cannot be null`,
      );
    }

    const payload = {
      id: Math.max(...ACTIVITY.map((o) => o.id)) + 1,
      email,
      title,
      created_at: `${new Date().toISOString()}`,
      updated_at: `${new Date().toISOString()}`,
      deleted_at: null,
    };

    // ADD data
    data_all.push(payload);

    // save file
    this.saveFile(data_all);
    return payload;
  }

  /**
   * Function for delete item activity
   *
   * @param {number} id
   * @return {*}
   * @memberof ActivityService
   */
  deleteById(id: number) {
    const data: Array<Activity> = ACTIVITY;
    const find_one = data.find((item) => {
      return item?.id === id;
    });

    if (!find_one) {
      throw new NotFoundException(`Activity with ID ${id} Not Found`);
    }

    const result = data.filter((item) => {
      return item?.id !== id;
    });

    this.saveFile(result);

    return { status: 'Success', message: 'Success', data: {} };
  }

  /**
   * function for update activity
   *
   * @param {number} id
   * @param {*} data
   * @return {*}
   * @memberof ActivityService
   */
  updateById(id: number, data: any) {
    const { email = '', title = '' } = data;
    const data_all: Array<Activity> = ACTIVITY;

    const find_one = data_all.find((item) => {
      return item?.id === id;
    });

    if (!data) {
      throw new BadRequestException(`body cannot be null`);
    }

    if (!find_one) {
      throw new NotFoundException(`Activity with ID ${id} Not Found`);
    }

    const index = data_all.findIndex((obj) => obj.id === id);

    data_all[index] = {
      ...find_one,
      email: email ? email : find_one?.email,
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
