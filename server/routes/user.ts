import express from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";

import { UserController, BudgetController } from "../controllers";
import mailerHelper from "../helpers/mailerHelper";
import smsSender from "../helpers/smsSender";

const router = express.Router();

router.get(
  "/:uid/budgets",
  asyncHandler(async (req, res) => {
    const uid = req.params.uid;

    const user = await UserController.getUserById(uid);
    const budgets = await BudgetController.getAllBudgets({
      _id: { $in: user && user.budgets }
    });

    return res.json({ budgets });
  })
);

router.get(
  "/:uid",
  asyncHandler(async (req, res) => {
    const uid = req.params.uid;

    const user = await UserController.getUserById(uid);

    return res.json({ user });
  })
);

router.get(
  "/",
  asyncHandler(async (_, res) => {
    const users = await UserController.getAllUsers();

    return res.json(users);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      budgetId,
      fullName,
      email,
      phoneNumber,
      notifyPhone,
      notifyEmail,
      isClient
    } = req.body.params;

    const { hash } = await UserController.generatePasswordHash();
    let notificationType = "mail";

    if (notifyPhone && notifyEmail) {
      notificationType = "both";
    } else if (notifyPhone) {
      notificationType = "phone";
    } else if (notifyEmail) {
      notificationType = "mail";
    }

    const currentUser: any = {
      fullName,
      email,
      lastLogin: null,
      password: hash,
      username: email,
      role: "Customer",
      budgets: [budgetId],
      phoneNumber,
      notificationType,
      isClient
    };

    const response = await UserController.addUser(currentUser);
    const { status, user, isUserAlreadyExist, isPhoneNumberExist } = response;
    const budget = await BudgetController.getBudget({ _id: budgetId });
    const sendSMS = notifyPhone && phoneNumber;

    if (response.status === 200) {
      if (isUserAlreadyExist && user && budget) {
        // send appropriate notification with request to project
        notifyEmail && mailerHelper.notifyAboutNewBudget(user, budget);
        sendSMS && smsSender.sendSMSToNewUser(phoneNumber, budget);
      } else {
        // send appropriate notification with new password
        notifyEmail && mailerHelper.sendEmailToNewUser(user, budget);
        sendSMS && smsSender.sendSMSToNewUser(phoneNumber, budget);
      }

      return res
        .status(status)
        .json({ status, user, isUserAlreadyExist, isPhoneNumberExist });
    }

    return res
      .status(status)
      .json({ status, isUserAlreadyExist, isPhoneNumberExist });
  })
);

router.patch(
  "/",
  asyncHandler(async (req, res) => {
    const {
      fullName,
      lastLogin,
      email,
      id,
      phoneNumber,
      notifyPhone,
      notifyEmail,
      budgetId,
      isClient
    } = req.body.params;
    let notificationType = "mail";

    if (notifyPhone && notifyEmail) {
      notificationType = "both";
    } else if (notifyPhone) {
      notificationType = "phone";
    } else if (notifyEmail) {
      notificationType = "mail";
    }

    const userUpdatedDate = {
      _id: id,
      fullName,
      lastLogin,
      email,
      phoneNumber,
      notificationType,
      isClient
    };

    const budget = await BudgetController.getBudget({ _id: budgetId });
    const sendSMS = notifyPhone && phoneNumber;

    const { status, message, user } = await UserController.updateUser(
      userUpdatedDate
    );

    notifyEmail && mailerHelper.notifyAboutNewBudget(user, budget);
    sendSMS && smsSender.sendSMSToNewUser(phoneNumber, budget);

    return res.json({ status, message, user });
  })
);

router.post(
  "/add-budget",
  asyncHandler(async (req, res) => {
    const { uid, budgetId } = req.body.params;
    const { user, budget } = await UserController.addBudgetToUser(
      uid,
      budgetId
    );

    return res.json({ user, budget });
  })
);

router.post(
  "/del-from-budget",
  asyncHandler(async (req, res, next) => {
    const { email, budgetId } = req.body.params;

    const response = await UserController.removeUserFromBudget(email, budgetId);
    const user = await UserController.getUser(email);
    const budget = await BudgetController.getBudget({ _id: budgetId });

    if (user && budget) {
      switch (user.notificationType) {
        case "mail":
          email && mailerHelper.notifyUserRemovedFromBudget(user, budget);
          break;
        case "phone":
          user.phoneNumber &&
            smsSender.sendSMSToUserRemovedFromBudget(user, budget);
          break;
        case "both":
          email && mailerHelper.notifyUserRemovedFromBudget(user, budget);
          user.phoneNumber &&
            smsSender.sendSMSToUserRemovedFromBudget(user, budget);
          break;
        default:
          email && mailerHelper.notifyUserRemovedFromBudget(user, budget);
      }
    } else {
      next(
        createError(
          404,
          "User or budget not found. Mail notification wasn't sent"
        )
      );
    }

    return res.json(response);
  })
);

export default router;
