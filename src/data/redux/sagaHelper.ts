import { call, all, put, select } from "redux-saga/effects";
import { batchActions } from "redux-batched-actions";

import { IUser, UserRoles } from "./users/types";
import { IProject, IProjectsActions } from "./projects/types";
import { getAllProjectsSaga } from "./projects/sagas";
import { IBudget, IBudgetsActions } from "./budgets/types";
import { IWorklogActions } from "./worklogs/types";
import { getFiltersSelector } from "./worklogs/selectors";
import {
  getBudgetDetails,
  getProjectsForBudget,
  getAllBudgets,
  getBudgetWorklogs
} from "../providers/api";
import { upsertProjectsToRedux } from "./projects/actions";
import {
  setBudgetListToRedux,
  startLoading,
  stopLoading
} from "./budgets/actions";
import { setWorklogsByBudgetIdFromCache } from "./worklogs/actions";
import { setCurrentUserToRedux } from "./users/actions";
import { refreshCacheAction } from "./types";

export function* customerRefreshAll(user: IUser | null) {
  try {
    if (user && user.role === UserRoles.CUSTOMER) {
      const budgetList: IBudget[] = [];
      let projectList: IProject[] = [];
      const budgetWorklogs = {};

      for (const budgetId of user.budgets) {
        const limit = yield select(getFiltersSelector, budgetId);

        const [responseBudgets, responseProjects, responseWorklogs] = yield all(
          [
            call(getBudgetDetails, budgetId),
            call(getProjectsForBudget, budgetId),
            call(getBudgetWorklogs, budgetId, { limit, cache: true })
          ]
        );

        if (responseBudgets && responseBudgets.budget) {
          budgetList.push(responseBudgets.budget);
        }

        if (responseProjects && responseProjects.projects) {
          const projects: IProject[] = responseProjects.projects;
          projectList = [...projectList, ...projects];
        }

        if (responseWorklogs && responseWorklogs.worklogs) {
          budgetWorklogs[budgetId] = responseWorklogs.worklogs;
        }
      }

      yield put(
        batchActions([
          { type: IProjectsActions.CLEAR_STATE },
          { type: IBudgetsActions.CLEAR_BUDGET_STATE },
          { type: IWorklogActions.CLEAR_WORKLOGS },
          upsertProjectsToRedux(projectList),
          setBudgetListToRedux(budgetList),
          setCurrentUserToRedux(user),
          setWorklogsByBudgetIdFromCache(budgetWorklogs),
          refreshCacheAction(false)
        ])
      );
    }
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}

export function* adminRefreshAll(user: IUser | null) {
  try {
    if (user && user.role === UserRoles.ADMIN) {
      const [responseBudgets, _] = yield all([
        yield call(getAllBudgets),
        yield call(getAllProjectsSaga)
      ]);

      if (responseBudgets && responseBudgets.budgets) {
        yield put(
          batchActions([
            put({ type: IBudgetsActions.CLEAR_BUDGET_STATE }),
            put(setBudgetListToRedux(responseBudgets.budgets)),
            put(setCurrentUserToRedux(user))
          ])
        );
      } else {
        yield put(setCurrentUserToRedux(user));
      }
    }
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}

export function* loadingSpinnerSaga(fn: any, ...args: any[]) {
  yield put(startLoading());
  yield call(fn, args);
  yield put(stopLoading());
}
