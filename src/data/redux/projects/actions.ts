import { action } from "typesafe-actions";

import { IProjectsActions, IProject } from "./types";

export const clearProjectsState = () => action(IProjectsActions.CLEAR_STATE);

export const loadBudgetProjects = (budgetId: string) =>
  action(IProjectsActions.LOAD_BUDGET_PROJECTS, {
    budgetId
  });

export const getAllProjectsFromServer = () =>
  action(IProjectsActions.GET_ALL_PROJECTS_FROM_SERVER);

export const getProjectsFromServer = () =>
  action(IProjectsActions.GET_PROJECTS_FROM_SERVER);

export const upsertProjectsToRedux = (projects: IProject[]) =>
  action(IProjectsActions.UPSERT_PROJECTS_TO_REDUX, {
    projects
  });

export const getProjectDetailsFromServer = (key: string) =>
  action(IProjectsActions.GET_PROJECT_DETAILS_FROM_SERVER, {
    key
  });

export const setProjectDetails = (key: string, project: IProject) =>
  action(IProjectsActions.SET_PROJECT_DETAILS_TO_REDUX, {
    key,
    project
  });

export const addProjectToBudget = (key: string, budgetId: string) =>
  action(IProjectsActions.ADD_PROJECT_TO_BUDGET, {
    key,
    budgetId
  });

export const removeProjectFromBudget = (key: string, budgetId: string) =>
  action(IProjectsActions.REMOVE_PROJECT_FROM_BUDGET, {
    key,
    budgetId
  });
