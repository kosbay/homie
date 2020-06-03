import { action } from "typesafe-actions";

import { IBudgetsActions, IBudget } from "./types";

export const getAllBudgetsFromServer = () =>
  action(IBudgetsActions.GET_ALL_BUDGETS_FROM_SERVER);

export const getBudgetDetails = (budgetId: string) =>
  action(IBudgetsActions.GET_BUDGET_DETAILS, {
    budgetId
  });

export const getCustomerBudgetsFromServer = () =>
  action(IBudgetsActions.GET_CUSTOMERS_BUDGETS_FROM_SERVER);

export const setBudgetListToRedux = (budgetList: IBudget[]) =>
  action(IBudgetsActions.SET_BUDGET_LIST_TO_REDUX, {
    budgetList
  });

export const createBudgetAction = (
  name: string,
  initialBudget: number,
  monthlyBudget: number,
  createDate: Date
) =>
  action(IBudgetsActions.CREATE_BUDGET, {
    name,
    initialBudget,
    monthlyBudget,
    createDate
  });

export const upsertBudgetToRedux = (budget: IBudget) =>
  action(IBudgetsActions.UPSERT_BUDGET_TO_REDUX, {
    budget
  });

export const setCreateBudgetError = (errText: string) =>
  action(IBudgetsActions.SET_CREATE_BUDGET_ERROR, {
    errText
  });

export const clearBudgetErrors = () => action(IBudgetsActions.CLEAR_ERRORS);

export const startLoading = () => action(IBudgetsActions.START_BUDGETS_LOADING);

export const stopLoading = () => action(IBudgetsActions.STOP_BUDGETS_LOADING);

export const updateBudgetAction = (
  budgetId: string,
  initialBudget: number,
  monthlyBudget: number
) =>
  action(IBudgetsActions.UPDATE_BUDGET, {
    budgetId,
    initialBudget,
    monthlyBudget
  });

export const getAdditionalBudgetsAction = budgetId => {
  return action(IBudgetsActions.GET_ADDITIONAL_BUDGETS, {
    budgetId
  });
};

export const setAdditionalBudgets = (budgetId, additionalBudgets) =>
  action(IBudgetsActions.SET_ADDITIONAL_BUDGETS, {
    budgetId,
    additionalBudgets
  });

export const setAdditionalBudget = (budgetId, additionalBudgets) =>
  action(IBudgetsActions.SET_ADDITIONAL_BUDGET, {
    budgetId,
    additionalBudgets
  });

export const addAdditionalBudgetAction = (budgetId: string, hours: number) =>
  action(IBudgetsActions.ADD_ADDITIONAL_BUDGET, {
    budgetId,
    hours
  });

export const removeAdditionalBudgetAction = (budgetId: string, id: string) =>
  action(IBudgetsActions.REMOVE_ADDITIONAL_BUDGET, {
    budgetId,
    id
  });
