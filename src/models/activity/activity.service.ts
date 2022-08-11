import { Injectable, NotFoundException } from '@nestjs/common';
import * as ACTIVITY from '../../common/constants/ACTIVITY.json';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ActivityService {
  /**
   * Function for get all activity from JSON data activity
   *
   * @return {*}
   * @memberof ActivityService
   */
  getAll() {
    const data = ACTIVITY;

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
}
