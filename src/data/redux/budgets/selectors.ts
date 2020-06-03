import _ from "lodash";
import { createSelector } from "reselect";

import { IAppState } from "../types";
import { IBudget } from "./types";
import { IProject } from "../projects/types";

const getBudget = (state: IAppState, budgetId: string): IBudget =>
  state.budgets.budgetList.find(({ _id }) => _id === budgetId)!;

const getBudgetProjects = (
  state: IAppState,
  propBudgetId: string
): IProject[] | null => {
  return state.projects.projects
    ? state.projects.projects.filter(
        ({ budgetId }) => budgetId === propBudgetId
      )
    : null;
};

const getBudgetList = (state: IAppState): IBudget[] => state.budgets.budgetList;

export const makeGetBudgetSelector = () =>
  createSelector(
    [getBudget],
    budget => budget
  );

export const makeGetBudgetProjectsSelector = () =>
  createSelector(
    [getBudgetProjects],
    budgetProjects => budgetProjects
  );

export const getBudgetListSelector = createSelector(
  [getBudgetList],
  budgetList => budgetList
);

const getAdditionalBudget = (state: IAppState, budgetId: string) => {
  return state.budgets && state.budgets.additionalBudgets
    ? _.get(state.budgets.additionalBudgets, budgetId, [])
    : [];
};

export const getAdditionalBudgetSelector = createSelector(
  [getAdditionalBudget],
  additionalBudget => additionalBudget
);
