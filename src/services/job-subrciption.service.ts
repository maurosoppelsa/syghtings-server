const cron = require('node-cron');
import { CRON_JOB_CLEANUP_TIME } from '@/config';
import UserService from './users.service';

class JobSubscriptionService {
  public static startCheck() {
    const userService = new UserService();
    cron.schedule(CRON_JOB_CLEANUP_TIME, async () => {
      await userService.cleanupSubscriptions();
    });
  }
}

export default JobSubscriptionService;
