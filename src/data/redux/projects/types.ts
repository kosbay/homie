export interface IProject {
  id: string;
  name: string;
  key: string;
  budgetId?: string;
  initialBudget: number;
  threshold: number;
  createDate: string;
  remaining: number;
  spent: number;
  monthlyBudget: number;
  worklogs: any[]; // TODO extract to separate type and reducer
}

export interface IProjectsState {
  readonly projects?: IProject[];
  readonly currentProject: string;
  readonly lastVisitedProject?: string;
}

export const enum IProjectsActions {
  CLEAR_STATE = "CLEAR_STATE",
  LOAD_BUDGET_PROJECTS = "LOAD_BUDGET_PROJECTS",

  GET_ALL_PROJECTS_FROM_SERVER = "GET_ALL_PROJECTS_FROM_SERVER",
  GET_PROJECTS_FROM_SERVER = "GET_PROJECTS_FROM_SERVER",
  GET_PROJECT_DETAILS_FROM_SERVER = "GET_PROJECT_DETAILS_FROM_SERVER",
  UPSERT_PROJECTS_TO_REDUX = "UPSERT_PROJECTS_TO_REDUX",
  SET_PROJECT_DETAILS_TO_REDUX = "SET_PROJECT_DETAILS_TO_REDUX",

  ADD_PROJECT_TO_BUDGET = "ADD_PROJECT_TO_BUDGET",
  REMOVE_PROJECT_FROM_BUDGET = "REMOVE_PROJECT_FROM_BUDGET"
}
