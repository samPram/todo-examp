import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityDto } from './dto/activity.dto';

@Controller('activity-groups')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getActivity() {
    return this.activityService.getAll();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.getOne(id);
  }

  @Post()
  postActivity(@Body() data: ActivityDto) {
    return this.activityService.addActivity(data);
  }

  @Delete(':id')
  deleteOneActivity(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.deleteById(id);
  }

  @Patch(':id')
  updateOneActivity(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.activityService.updateById(id, data);
  }
}
