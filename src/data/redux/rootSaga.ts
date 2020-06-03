import { all, fork, take, call, put, cancel } from "redux-saga/effects";

import { IProjectsActions, IProject } from "./projects/types";
import {
  getAllProjectsSaga,
  addProjectToBudgetSaga,
  removeProjectFromBudgetSaga
} from "./projects/sagas";
import { IUsersActions, IUser } from "./users/types";
import { loginSaga, getCurrentUserFromServerSaga } from "./users/sagas";
import { clearProjectsState, upsertProjectsToRedux } from "./projects/actions";
import { setLoading } from "./users/actions";
import { WholeStoreActions } from "./types";
import { IBudgetsActions } from "./budgets/types";
import { IWorklogActions } from "./worklogs/types";
import {
  getAllBudgetsFromServerSaga,
  createBudgetSaga,
  updateBudgetSaga,
  getBudgetDetailsSaga,
  getAdditionalBudgetsSaga,
  addAdditionalBudgetSaga,
  removeAdditionalBudgetSaga
} from "./budgets/sagas";
import {
  getBudgetWorklogsSaga,
  getPreviousWorklogsSaga
} from "./worklogs/sagas";
import { getProjectsForBudget } from "../providers/api";
import {
  customerRefreshAll,
  adminRefreshAll,
  loadingSpinnerSaga
} from "./sagaHelper";
import { setWorklogsLoadingStatus } from "./worklogs/actions";
import { removeAdditionalBudgetAction } from "./budgets/actions";

let refresh: any = null;

export const cancelRefresher = function*() {
  if (refresh) {
    yield cancel(refresh);
    refresh = null;
  }
};

function* rootSaga(): any {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
    fork(watchRefreshCache),

    fork(watchGetAllProjects),

    fork(watchCreateBudget),
    fork(watchUpdateBudget),

    fork(watchGetBudgets),
    fork(watchGetBudgetDetails),
    fork(watchLoadBudgetsWorklogs),
    fork(watchLoadPreviousWorklogs),
    fork(watchGetAdditionalBudgets),
    fork(watchAddAdditionalBudget),
    fork(watchRemoveAdditionalBudget),

    fork(addProjectToBudget),
    fork(removeProjectFromBudget),

    fork(watchLoadBudgetProjects)
  ]);
}
export default rootSaga;

function* watchLogin() {
  while (true) {
    const { payload } = yield take(IUsersActions.LOGIN);
    const user: IUser = yield call(loginSaga, payload);
    yield call(customerRefreshAll, user);
    yield call(adminRefreshAll, user);
    yield put(setLoading(false));
  }
}

function* watchRefreshCache() {
  while (true) {
    const { payload } = yield take(WholeStoreActions.REFRESH_CACHE);

    if (payload.refresh) {
      const user: IUser | null = yield call(getCurrentUserFromServerSaga);
      refresh = yield fork(customerRefreshAll, user);

      yield call(adminRefreshAll, user);

      yield put(setWorklogsLoadingStatus(false));
    }
  }
}

function* watchLogout() {
  while (true) {
    yield take(IUsersActions.LOGOUT);
    yield put(clearProjectsState());
  }
}

function* watchGetAllProjects() {
  while (true) {
    yield take(IProjectsActions.GET_ALL_PROJECTS_FROM_SERVER);
    yield fork(getAllProjectsSaga);
  }
}

function* watchGetBudgetDetails() {
  while (true) {
    const { payload } = yield take(IBudgetsActions.GET_BUDGET_DETAILS);
    yield call(getBudgetDetailsSaga, payload.budgetId);
  }
}

function* watchGetBudgets() {
  while (true) {
    yield take(IBudgetsActions.GET_ALL_BUDGETS_FROM_SERVER);
    yield loadingSpinnerSaga(getAllBudgetsFromServerSaga);
  }
}

function* watchGetAdditionalBudgets() {
  while (true) {
    const { payload } = yield take(IBudgetsActions.GET_ADDITIONAL_BUDGETS);
    yield call(getAdditionalBudgetsSaga, payload.budgetId);
  }
}

function* watchAddAdditionalBudget() {
  while (true) {
    const { payload } = yield take(IBudgetsActions.ADD_ADDITIONAL_BUDGET);
    yield call(addAdditionalBudgetSaga, payload.budgetId, payload.hours);
  }
}

function* watchRemoveAdditionalBudget() {
  while (true) {
    const { payload } = yield take(IBudgetsActions.REMOVE_ADDITIONAL_BUDGET);
    yield call(removeAdditionalBudgetSaga, payload.budgetId, payload.id);
  }
}

function* watchCreateBudget() {
  while (true) {
    const { payload } = yield take(IBudgetsActions.CREATE_BUDGET);
    const { name, initialBudget, monthlyBudget, createDate } = payload;
    yield call(
      createBudgetSaga,
      name,
      initialBudget,
      monthlyBudget,
      createDate
    );
  }
}

function* watchUpdateBudget() {
  while (true) {
    const { payload } = yield take(IBudgetsActions.UPDATE_BUDGET);
    const { budgetId, initialBudget, monthlyBudget } = payload;
    yield call(updateBudgetSaga, budgetId, initialBudget, monthlyBudget);
  }
}

function* watchLoadBudgetsWorklogs() {
  while (true) {
    const { payload } = yield take(IWorklogActions.LOAD_BUDGETS_WORKLOGS);
    yield call(getBudgetWorklogsSaga, payload.budgetId, payload.limit);
  }
}

function* watchLoadPreviousWorklogs() {
  while (true) {
    const { payload } = yield take(IWorklogActions.LOAD_PREVIOUS_WORKLOGS);
    yield call(getPreviousWorklogsSaga, payload.budgetId, payload.limit);
  }
}

function* addProjectToBudget() {
  while (true) {
    const { payload } = yield take(IProjectsActions.ADD_PROJECT_TO_BUDGET);
    yield call(addProjectToBudgetSaga, payload.key, payload.budgetId);
    yield call(getBudgetDetailsSaga, payload.budgetId);
  }
}

function* removeProjectFromBudget() {
  while (true) {
    const { payload } = yield take(IProjectsActions.REMOVE_PROJECT_FROM_BUDGET);
    yield call(removeProjectFromBudgetSaga, payload.key, payload.budgetId);
    yield call(getBudgetDetailsSaga, payload.budgetId);
  }
}

function* watchLoadBudgetProjects() {
  while (true) {
    const { payload } = yield take(IProjectsActions.LOAD_BUDGET_PROJECTS);
    const response = yield call(getProjectsForBudget, payload.budgetId);
    if (response && response.projects) {
      const projects: IProject[] = response.projects;
      yield put(upsertProjectsToRedux(projects));
    }
  }
}
