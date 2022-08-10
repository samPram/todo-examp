import { Controller, Get } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activity-groups')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  getActivity() {
    return this.activityService.getAll();
  }
}
