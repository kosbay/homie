import moment from "moment";
import createError from "http-errors";

import { WorklogThumbs } from "../models/WorklogThumbs";

// TODO get rid of any
export const WorklogController = {
  calculateWorkedHours: (
    worklogList: any,
    from?: number,
    to?: number
  ): number => {
    const workedHours = worklogList.reduce(
      (hours, { dateStarted, timeSpentSeconds }) => {
        const dateStartedUnix = moment(dateStarted).unix();

        const tempStart = from ? from - 3600 : 0;
        const tempEnd =
          to ||
          moment()
            .add(100, "year")
            .unix();

        if (tempStart < dateStartedUnix && dateStartedUnix < tempEnd) {
          return hours + timeSpentSeconds / 3600;
        }

        return hours;
      },
      0
    );

    return Math.ceil(workedHours);
  },

  updateOrCreateWorklogThumbs: async ({ _id, userIds, worklogId }) => {
    try {
      const users = userIds.filter(
        (item, pos, self) => self.indexOf(item) === pos
      );

      const worklogThumbs = _id
        ? await WorklogThumbs.findOneAndUpdate(
            {
              _id
            },
            { users },
            {
              new: true,
              upsert: true
            }
          ).lean()
        : await WorklogThumbs.create({
            users,
            worklogId
          });

      if (!worklogThumbs) {
        throw createError(
          400,
          "An error occured during worklog thumb creation"
        );
      }

      return worklogThumbs;
    } catch (err) {
      throw err;
    }
  },

  removeUserWorklogThumb: async ({ _id, userId }) => {
    try {
      const worklogThumbs = await WorklogThumbs.findOneAndUpdate(
        {
          _id
        },
        { $pullAll: { users: [userId] } },
        {
          new: true,
          upsert: true
        }
      ).lean();

      if (!worklogThumbs) {
        throw createError(400, "An error occured during worklog thumb removal");
      }

      return worklogThumbs;
    } catch (err) {
      throw err;
    }
  }
};
