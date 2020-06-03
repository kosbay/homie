import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import messagebird from "messagebird";
import { Request, Response, NextFunction } from "express-serve-static-core";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import _ from "lodash";

import jwtSecret from "../config/jwtConfig";
import mbConfig from "../config/messageBirdConfig";
import mailerHelper from "../helpers/mailerHelper";
import { UserController } from "../controllers";
import JiraAPIController from "../services/JiraAPIController";

const jiraAPIController = new JiraAPIController();
const router = express.Router();
const mbClient = messagebird(mbConfig.token);

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout();
  req.session &&
    req.session.destroy(err => {
      if (err) {
        return next(err);
      }

      // destroy session data
      req.session = undefined;

      // redirect to homepage
      res.redirect("/");
    });
});

router.post(
  "/loginUser",
  asyncHandler((req, res, next) => {
    return passport.authenticate(
      "login",
      ({ err = null, user = false, info }) => {
        if (err) {
          return next(err);
        }

        if (info !== undefined) {
          return next(
            createError(401, "Access is denied due to invalid credentials")
          );
        } else {
          req.logIn(user, err => {
            const token = jwt.sign(
              { id: user.email, role: user.role },
              jwtSecret.secret
            );

            res.json({ token, user });
          });
        }
      }
    )(req, res, next);
  })
);

router.post(
  "/sendResetPasswordEmail",
  asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const matchedUser = await UserController.getUser(email);

    if (!matchedUser) {
      return next(createError(404, "User not found"));
    }

    mailerHelper.sendResetPasswordEmail(matchedUser);

    return res.json({ success: true });
  })
);

router.post(
  "/resetUserPassword",
  asyncHandler(async (req, res) => {
    const { userId, newPassword } = req.body;
    const user = await UserController.updatePassword(userId, newPassword);

    return res.json({ success: true, user });
  })
);

router.post(
  "/sendCode",
  asyncHandler(async (req, res, next) => {
    const { phoneNumber } = req.body;

    const user = await UserController.getUserByPhoneNumber(phoneNumber);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    mbClient.verify.create(
      phoneNumber,
      {
        originator: "Code",
        template: "Uw verificatiecode is: %token.",
        timeout: 60
      },
      (err, response) => {
        if (err) {
          return next(
            createError(400, _.get(err, "errors[0].description", "Error"))
          );
        } else {
          res.send({
            id: response && response.id,
            status: 200
          });
        }
      }
    );
  })
);

router.post(
  "/sendVerify",
  asyncHandler((req, res, next) => {
    const { id, token, phoneNumber } = req.body;

    return mbClient.verify.verify(id, token, async (err, response) => {
      if (err) {
        return res.send({
          error: _.get(err, "errors[0].description", "Error"),
          id
        });
      } else {
        const user: any = await UserController.getUserByPhoneNumber(
          phoneNumber
        );

        if (!user) {
          return next(createError(404, "User not found"));
        }

        if (user.role === "admin") {
          const allProjects = jiraAPIController.getAllProjects();
          user.projects = _.map(allProjects, "key");
        }

        const jwtToken = jwt.sign(
          { id: user.email, role: user.role },
          jwtSecret.secret
        );

        return res.send({ user, token: jwtToken });
      }
    });
  })
);

export default router;
