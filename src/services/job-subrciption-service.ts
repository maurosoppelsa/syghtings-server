const cron = require('node-cron');
import UserService from './users.service';

class JobSubscriptionService {
  public static startCheck() {
    const userService = new UserService();
    cron.schedule('0 0 */1 * * *', async () => {
      await userService.cleanupSubscriptions();
    });
  }
}

export default JobSubscriptionService;
