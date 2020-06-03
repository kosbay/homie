import scheduler from "node-schedule";

import { UserController } from "../controllers";
import { notifyUserAboutReport } from "./mailerHelper";
import { sendSMSToUserAboutReport } from "./smsSender";

export const reportNotificationScheduler = async () => {
  try {
    await scheduler.scheduleJob("0 12 5 * *", async () => {
      const users = await UserController.getUsersForReport();

      await Promise.all(
        users.map(user => {
          notifyUserAboutReport(user);
          user && user.phoneNumber && sendSMSToUserAboutReport(user);
        })
      );
    });
  } catch (err) {
    throw err;
  }
};

export default {
  reportNotificationScheduler
};
