import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ActivityDto } from './dto/activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entity/activity.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  /**
   * Function for get all activity from JSON data activity
   *
   * @return {*}
   * @memberof ActivityService
   */
  async getAll() {
    try {
      const data = await this.activityRepository.find();

      return {
        status: 'Success',
        message: 'Success',
        data: data,
      };
    } catch (error) {
      throw new InternalServerErrorException('server error');
    }
  }

  /**
   * Function for get one activity
   *
   * @param {number} id
   * @return {*}
   * @memberof ActivityService
   */
  async getOne(id: number) {
    try {
      const data = await this.activityRepository.findOneBy({ id });

      if (!data) {
        throw new NotFoundException(`Activity with ID ${id} Not Found`);
      }

      return {
        status: 'Success',
        message: 'Success',
        data: data,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new NotFoundException(error.message);
      }

      throw new Error('server error');
    }
  }

  /**
   * Function for add activity
   *
   * @param {ActivityDto} data
   * @return {*}
   * @memberof ActivityService
   */
  async addActivity(data: ActivityDto) {
    try {
      const { email, title } = data;

      if (!title || !email) {
        throw new BadRequestException(
          `${!email ? 'email' : 'title'} cannot be null`,
        );
      }

      const result = await this.activityRepository.create({
        email,
        title,
        updated_at: `${new Date().toISOString()}`,
        created_at: `${new Date().toISOString()}`,
      });

      await this.activityRepository.save(result);

      return {
        status: 'Success',
        message: 'Success',
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      }
      throw new Error('server error');
    }
  }

  /**
   * Function for delete item activity
   *
   * @param {number} id
   * @return {*}
   * @memberof ActivityService
   */
  async deleteById(id: number) {
    try {
      const data = await this.activityRepository.findOneBy({ id });
      if (!data) {
        throw new NotFoundException(`Activity with ID ${id} Not Found`);
      }

      await this.activityRepository.delete(id);

      return { status: 'Success', message: 'Success', data: {} };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error.message);
      }
    }
  }

  /**
   * function for update activity
   *
   * @param {number} id
   * @param {*} data
   * @return {*}
   * @memberof ActivityService
   */
  async updateById(id: number, data: any) {
    try {
      const { email = '', title = '' } = data;
      if (!data) {
        throw new BadRequestException(`body cannot be null`);
      }

      const item = await this.activityRepository.findOneBy({ id });

      if (!item) {
        throw new NotFoundException(`Activity with ID ${id} Not Found`);
      }

      const result = await this.activityRepository
        .createQueryBuilder()
        .update({
          email: email ? email : item?.email,
          title: title ? title : item?.title,
          updated_at: `${new Date().toISOString()}`,
        })
        .where({
          id: id,
        })
        .returning('*')
        .execute();

      return {
        status: 'Success',
        message: 'Success',
        data: result.raw[0],
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      }
    }
  }
}
