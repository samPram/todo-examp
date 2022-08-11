import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ActivityService } from './activity.service';

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
}
