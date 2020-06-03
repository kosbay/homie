import { IAppState } from "reduxFiles/types";
import { UserRoles } from "reduxFiles/users/types";

export const userIsNotExist = (state: IAppState): boolean => {
  return !state.users.currentUser;
};

export const isCustomer = (state: IAppState): boolean => {
  const currentUser = state.users.currentUser;
  return !!currentUser && currentUser.role === UserRoles.CUSTOMER;
};

export const isAdmin = (state: IAppState): boolean => {
  const currentUser = state.users.currentUser;
  return !!currentUser && currentUser.role === UserRoles.ADMIN;
};

export const customerHasManyProjects = (state: IAppState): boolean => {
  const projects = state.projects.projects;
  return !!projects && projects.length > 1;
};

export const customerHasOneBudget = (state: IAppState): boolean => {
  const currentUser = state.users.currentUser;
  return currentUser ? currentUser.budgets.length === 1 : false;
};

export const customerHasBudgetFromSMS = (state: IAppState): string => {
  return state.users.budgetIdFromSMS || "";
};

export const customerHasManyBudgets = (state: IAppState): boolean => {
  const currentUser = state.users.currentUser;
  return currentUser ? currentUser.budgets.length > 1 : false;
};

export const budgetsAreInRedux = (state: IAppState): boolean => {
  return state.budgets.budgetList.length > 0;
};
