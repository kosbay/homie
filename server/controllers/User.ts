import bcrypt from "bcrypt";
import createError from "http-errors";

import { User, Budget, IUserModel } from "../models";

export const UserController = {
  addBudgetToUser: async (uid: string, budgetId: string) => {
    const user = await UserController.getUserById(uid);

    const budget = await Budget.findById(budgetId);

    if (!user || !budget) {
      throw createError(404, "User or budget not found");
    }

    if (user.budgets.indexOf(budgetId) === -1) {
      user.budgets = [...user.budgets, budgetId];
      await user.save();
    }

    return { user, budget };
  },

  getAllUsers: async (params: Partial<IUserModel> = {}) => {
    try {
      return await User.find(params);
    } catch (err) {
      throw err;
    }
  },

  getUser: async param => {
    try {
      if (!param) {
        throw createError(400, "getUser param argument not found");
      }

      const user = await User.findOne({
        $or: [{ email: param }, { username: param }, { phoneNumber: param }]
      });

      return user;
    } catch (err) {
      throw err;
    }
  },

  getUserByPhoneNumber: async param => {
    try {
      if (!param) {
        throw createError(400, "getUserByPhoneNumber param argument not found");
      }

      const phoneNumber = param.startsWith("0")
        ? param.replace("0", "+31")
        : param;

      return await User.findOne({
        $or: [{ phoneNumber }]
      });
    } catch (err) {
      throw err;
    }
  },

  getUserById: async id => {
    try {
      return await User.findById(id);
    } catch (err) {
      throw err;
    }
  },

  addUser: async ({
    email,
    username,
    password,
    fullName,
    lastLogin,
    role,
    budgets,
    phoneNumber,
    notificationType,
    isClient
  }: IUserModel) => {
    const user = await UserController.getUser(email);
    const isPhoneNumberExist =
      phoneNumber && (await UserController.getUser(phoneNumber));

    if (phoneNumber && phoneNumber.startsWith("0")) {
      phoneNumber = phoneNumber.replace("0", "+31");
    }

    if (isPhoneNumberExist && isPhoneNumberExist.email !== email) {
      return {
        status: 400,
        isPhoneNumberExist: true
      };
    }

    if (user) {
      if (user.budgets.indexOf(budgets[0]) > -1) {
        return { status: 400, isUserAlreadyExist: true };
      }

      user.budgets = user.budgets.concat(budgets);
      user.phoneNumber = phoneNumber;

      const userWithNewData = await user.save();

      if (!userWithNewData) {
        return { status: 500, message: "Internal server error" };
      }

      return { status: 200, user, isUserAlreadyExist: true };
    }

    try {
      const newUser = new User({
        email,
        username,
        password,
        fullName,
        lastLogin,
        role,
        budgets,
        phoneNumber,
        notificationType,
        isClient
      });

      await newUser.save();

      return { status: 200, user: newUser, isUserAlreadyExist: false };
    } catch (err) {
      throw err;
    }
  },

  removeUserFromBudget: async (email: string, budgetId: string) => {
    try {
      const user = await User.findOne({
        email,
        budgets: { $in: budgetId }
      });

      if (!user) {
        throw createError(404, "User not found");
      }

      user.budgets = user.budgets.filter(
        userBudgetId => userBudgetId.toString() !== budgetId.toString()
      );

      await user.save();

      return true;
    } catch (err) {
      throw err;
    }
  },

  updateUser: async ({
    _id,
    fullName,
    lastLogin,
    email,
    phoneNumber,
    notificationType,
    isClient
  }) => {
    try {
      const userByPhoneNumber =
        phoneNumber && (await UserController.getUser(phoneNumber));
      const currentUser = await UserController.getUserById(_id);

      if (!currentUser) {
        return { status: 400, message: "Bad request" };
      }

      if (phoneNumber && phoneNumber.startsWith("0")) {
        phoneNumber = phoneNumber.replace("0", "+31");
      }

      if (
        phoneNumber &&
        userByPhoneNumber &&
        currentUser &&
        userByPhoneNumber.email !== currentUser.email
      ) {
        return {
          status: 400,
          message: "User with provided phone number already exist"
        };
      }

      currentUser.isClient = isClient;
      currentUser.fullName = fullName;
      currentUser.lastLogin = lastLogin;
      currentUser.email = email;
      currentUser.phoneNumber = phoneNumber;
      currentUser.notificationType = notificationType;

      await currentUser.save();

      const updatedUser = await UserController.getUserById(_id);

      return {
        status: 200,
        message: "The user has been updated",
        user: updatedUser
      };
    } catch (err) {
      throw err;
    }
  },

  updateLastLogin: async ({ _id, lastLogin }) => {
    try {
      const user = await UserController.getUserById(_id);

      if (!user) {
        throw createError(404, "User not found");
      }

      user.lastLogin = lastLogin;
      await user.save();

      return user;
    } catch (err) {
      throw err;
    }
  },

  generatePasswordHash: async (password = "") => {
    const saltRounds = 10;
    const passwordForHash = password || generatePassword();
    const hash = await bcrypt.hash(passwordForHash, saltRounds);

    return {
      password: passwordForHash,
      hash
    };
  },

  updatePassword: async (_id: string, newPassword: string) => {
    try {
      const user = await UserController.getUserById(_id);

      if (!user) {
        throw createError(404, "User not found");
      }

      const { hash } = await UserController.generatePasswordHash(newPassword);
      user.password = hash;
      await user.save();

      return user;
    } catch (err) {
      throw err;
    }
  },

  getUsersForReport: async () => {
    return await User.find({ isClient: true })
      .populate({
        path: "budgets",
        select: { name: 1 }
      })
      .select({
        fullName: 1,
        phoneNumber: 1,
        email: 1
      });
  }
};

const generatePassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let retVal = "";

  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }

  return retVal;
};
