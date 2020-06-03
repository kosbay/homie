import { action } from "typesafe-actions";

import { IWorklogActions, IWorklog } from "./types";

export const setWorklogsByBudgetIdFromCache = budgetWorklogs =>
  action(IWorklogActions.SET_WORKLOGS_BY_BUDGET_ID_FROM_CACHE, {
    budgetWorklogs
  });

export const setWorklogsByBudgetId = (budgetId, worklogs) =>
  action(IWorklogActions.SET_WORKLOGS_BY_BUDGET_ID, {
    budgetId,
    worklogs
  });

export const setPreviousWorklogs = (budgetId, worklogs) =>
  action(IWorklogActions.SET_PREVIOUS_WORKLOGS, {
    budgetId,
    worklogs
  });

export const setWorklogsFilter = (budgetId, limit) =>
  action(IWorklogActions.SET_WORKLOGS_FILTER, { budgetId, limit });

export const getWorklogsFilter = () =>
  action(IWorklogActions.SET_WORKLOGS_FILTER);

export const updateWorklogsOnBudget = ({
  budgetId,
  worklogId,
  worklogThumbs
}) =>
  action(IWorklogActions.UPDATE_WORKLOGS_BY_BUDGET_ID, {
    budgetId,
    worklogId,
    worklogThumbs
  });

export const setWorklogsLoadingStatus = (status: boolean) =>
  action(IWorklogActions.SET_WORKLOGS_LOADING_STATUS, {
    status
  });

export const loadWorklogsForBudget = (budgetId: string, limit: number) =>
  action(IWorklogActions.LOAD_BUDGETS_WORKLOGS, {
    budgetId,
    limit
  });

export const loadPreviousWorklogs = (budgetId: string, limit: number) =>
  action(IWorklogActions.LOAD_PREVIOUS_WORKLOGS, {
    budgetId,
    limit
  });

export const setBudgetWorklogsToRedux = (
  budgetId: string,
  worklogs: IWorklog[]
) =>
  action(IWorklogActions.SET_BUDGETS_WORKLOGS_TO_REDUX, {
    budgetId,
    worklogs
  });

export const clearFilter = (budgetId: string) =>
  action(IWorklogActions.CLEAR_FILTER, {
    budgetId
  });
