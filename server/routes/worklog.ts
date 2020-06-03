import express from "express";
import asyncHandler from "express-async-handler";

import { WorklogController } from "../controllers";

const router = express.Router();

router.post(
  "/worklogThumbs",
  asyncHandler(async (req, res) => {
    const { _id, worklogId, userIds } = req.body;
    const params = { _id, userIds, worklogId };

    const worklogThumbs = await WorklogController.updateOrCreateWorklogThumbs(
      params
    );

    return res.json(worklogThumbs);
  })
);

router.post(
  "/removeThumb",
  asyncHandler(async (req, res) => {
    const { userId, _id } = req.body;
    const params = { _id, userId };

    const worklogThumbs = await WorklogController.removeUserWorklogThumb(
      params
    );

    return res.json(worklogThumbs);
  })
);

export default router;
