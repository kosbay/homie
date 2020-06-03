import { action } from "typesafe-actions";

import { IProjectsState } from "./projects/types";
import { IUsersState } from "./users/types";
import { IBudgetsState } from "./budgets/types";
import { IWorklog } from "./worklogs/types";

export interface IReduxAction {
  type: string;
  payload: any;
}

export interface IAppState {
  readonly budgets: IBudgetsState;
  readonly projects: IProjectsState;
  readonly users: IUsersState;
  readonly worklogs: IWorklog;
}

export const enum WholeStoreActions {
  REFRESH_CACHE = "REFRESH_CACHE"
}

export const refreshCacheAction = refresh =>
  action(WholeStoreActions.REFRESH_CACHE, { refresh });
