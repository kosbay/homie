import messagebird from "messagebird";
import createError from "http-errors";

import config from "../config/connections";
import mbConfig from "../config/messageBirdConfig";

const mbClient = messagebird(mbConfig.token);

export const sendSMSToNewUser = (phoneNumber: string, budget: any) => {
  try {
    mbClient.messages.create(
      {
        originator: "Code",
        recipients: [phoneNumber],
        body: `U bent toegevoegd aan het ${budget.name} project. Klik op de link om aangemeld te worden. ${config.domain}/welcome/${phoneNumber}/${budget._id}` // tslint:disable-line
      },
      (err, response) => {
        if (err) {
          throw createError(400, "Error on sending SMS");
        } else {
          return {
            id: response && response.id,
            status: 200
          };
        }
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

export const sendSMSToUserRemovedFromBudget = (user, budget) => {
  try {
    mbClient.messages.create(
      {
        originator: "Code",
        recipients: [user.phoneNumber],
        body: `U bent verwijderd uit het ${budget.name} project.` // tslint:disable-line
      },
      (err, response) => {
        if (err) {
          throw createError(400, "Error on sending SMS");
        } else {
          return {
            id: response && response.id,
            status: 200
          };
        }
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

export const sendSMSToUserAboutReport = user => {
  try {
    mbClient.messages.create(
      {
        originator: "Code",
        recipients: [user.phoneNumber],
        body: `Goedendag, uw maandelijkse urenraportage staat klaar. Klik op de link om te bekijken: ${config.domain}. Met vriendelijke groeten, Second Company` // tslint:disable-line
      },
      (err, response) => {
        if (err) {
          throw createError(400, "Error on sending SMS");
        } else {
          return {
            id: response && response.id,
            status: 200
          };
        }
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  sendSMSToNewUser,
  sendSMSToUserRemovedFromBudget,
  sendSMSToUserAboutReport
};
