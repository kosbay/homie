import { action } from "typesafe-actions";

import { IUsersActions, IUser } from "./types";

export const loginAction = ({ username, password, type, verifyInfo }) =>
  action(IUsersActions.LOGIN, {
    username,
    password,
    type,
    verifyInfo
  });

export const setBudgetFromSMSAction = budgetId =>
  action(IUsersActions.SET_USER_BUDGET_ID_FORM_SMS, {
    budgetId
  });

export const logoutAction = () => action(IUsersActions.LOGOUT);

export const setCurrentUserToRedux = (user: IUser) =>
  action(IUsersActions.SET_CURRENT_USER_TO_REDUX, {
    user
  });

export const setUsersError = (error: string) =>
  action(IUsersActions.SET_USERS_ERROR, {
    error
  });

export const setLoading = (isLoading: boolean) =>
  action(IUsersActions.SET_LOADING, {
    isLoading
  });
