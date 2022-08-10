import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as ACTIVITY from '../../common/constants/ACTIVITY.json';

@Injectable()
export class ActivityService {
  getAll() {
    try {
      const data = ACTIVITY;

      return {
        status: 'Success',
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
