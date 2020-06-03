import Email from "email-templates";
import nodemailer from "nodemailer";

import config from "../config/connections";
import emailConfig from "../config/emailTransport";
import { IBudgetModel, IUserModel } from "../models";

const env = process.env.NODE_ENV || "development";
const domain = config.domain || "http://platform.secondcompany.nl";

export const sendEmailToNewUser = (user: any, budget: any) => {
  const email = createEmailSender();
  const resetHash = createResetHash(user);
  email
    .send({
      template: "new-user",
      message: {
        subject: "Second Company platform",
        to: user.email
      },
      locals: {
        username: user.fullName,
        budgetName: budget.name,
        budgetId: budget._id,
        resetHash,
        domain
      }
    })
    .catch(console.error); // tslint:disable-line
};

export const notifyAboutNewBudget = (user: IUserModel | any, budget: any) => {
  const email = createEmailSender();
  email.send({
    template: "new-budget",
    message: {
      subject: "Second Company platform",
      to: user.email
    },
    locals: {
      username: user.fullName,
      budgetName: budget.name,
      budgetId: budget._id,
      domain
    }
  });
};

export const notifyUserRemovedFromBudget = (
  user: IUserModel,
  budget: IBudgetModel
) => {
  const email = createEmailSender();
  email
    .send({
      template: "remove-user-from-budget",
      message: {
        subject: "Second Company platform",
        to: user.email
      },
      locals: {
        username: user.fullName,
        budgetName: budget.name,
        domain
      }
    })
    .catch(console.error); // tslint:disable-line
};

export const sendResetPasswordEmail = (user: any) => {
  const email = createEmailSender();
  const resetHash = createResetHash(user);

  email
    .send({
      template: "restore-password",
      message: {
        subject: "Second Company platform",
        to: user.email
      },
      locals: {
        username: user.fullName,
        domain,
        resetHash
      }
    })
    .catch(console.error); // tslint:disable-line
};

export const notifyUserAboutReport = (user: IUserModel) => {
  const email = createEmailSender();
  email
    .send({
      template: "report",
      message: {
        subject: "Second Company platform",
        to: user.email
      },
      locals: {
        username: user.fullName,
        domain
      }
    })
    .catch(console.error); // tslint:disable-line
};

const createEmailSender = () => {
  const transportOptions =
    env === "development" ? emailConfig.devTransport : emailConfig.transport;

  return new Email({
    ...emailConfig.emailtemplatesConfig,
    transport: nodemailer.createTransport(transportOptions as any)
  });
};

const createResetHash = (user: any) => {
  const uid = user._id.toString();
  return (uid.slice(10) + uid.slice(5, 10) + uid.slice(0, 5))
    .split("")
    .reverse()
    .join("");
};

export default {
  sendEmailToNewUser,
  notifyAboutNewBudget,
  notifyUserRemovedFromBudget,
  sendResetPasswordEmail
};
