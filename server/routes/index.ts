import express from "express";
import passport from "passport";

import projectRoutes from "./project";
import authorizationRoutes from "./authorization";
import userRoutes from "./user";
import worklogRoutes from "./worklog";
import budgetRoutes from "./budget";

const router = express.Router();

router.use(
  "/projects",
  passport.authenticate("jwt", { session: false }),
  projectRoutes
);
router.use("/auth", authorizationRoutes);
router.use(
  "/user",
  passport.authenticate("jwt", { session: false }),
  userRoutes
);
router.use(
  "/worklog",
  passport.authenticate("jwt", { session: false }),
  worklogRoutes
);
router.use(
  "/budget",
  passport.authenticate("jwt", { session: false }),
  budgetRoutes
);

export default router;
