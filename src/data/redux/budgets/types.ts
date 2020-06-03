import { IUser } from "../users/types";

export interface IWorklog {
  _id: string;
  worklogThumbs: {
    _id: string;
  };
}

export interface IBudget {
  _id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  initialBudget: number;
  remainingBudget: number;
  monthlyBudget: number;
  spentBudgetThisMonth: number;
  worklogs?: IWorklog[];
  budgetUsers?: IUser[];
}

export interface IBudgetsState {
  readonly budgetList: IBudget[];
  readonly areLoading: boolean;
  readonly createBudgetError: string;
  readonly worklogsAreLoading: boolean;
  readonly additionalBudgets: {};
}

export const enum IBudgetsActions {
  GET_ALL_BUDGETS_FROM_SERVER = "GET_ALL_BUDGETS_FROM_SERVER",
  GET_CUSTOMERS_BUDGETS_FROM_SERVER = "GET_CUSTOMERS_BUDGETS_FROM_SERVER",
  GET_BUDGET_DETAILS = "GET_BUDGET_DETAILS",
  SET_BUDGET_LIST_TO_REDUX = "SET_BUDGET_LIST_TO_REDUX",

  CLEAR_BUDGET_STATE = "CLEAR_BUDGET_STATE",

  CREATE_BUDGET = "CREATE_BUDGET",
  UPSERT_BUDGET_TO_REDUX = "UPSERT_BUDGET_TO_REDUX",

  SET_CREATE_BUDGET_ERROR = "SET_CREATE_BUDGET_ERROR",
  CLEAR_ERRORS = "CLEAR_ERRORS",
  START_BUDGETS_LOADING = "START_BUDGETS_LOADING",
  STOP_BUDGETS_LOADING = "STOP_BUDGETS_LOADING",

  UPDATE_BUDGET = "UPDATE_BUDGET",

  SET_BUDGET_USERS_TO_REDUX = "SET_BUDGET_USERS_TO_REDUX",

  GET_ADDITIONAL_BUDGETS = "GET_ADDITIONAL_BUDGETS",
  SET_ADDITIONAL_BUDGETS = "SET_ADDITIONAL_BUDGETS",
  SET_ADDITIONAL_BUDGET = "SET_ADDITIONAL_BUDGET",
  ADD_ADDITIONAL_BUDGET = "ADD_ADDITIONAL_BUDGET",
  REMOVE_ADDITIONAL_BUDGET = "REMOVE_ADDITIONAL_BUDGET"
}
