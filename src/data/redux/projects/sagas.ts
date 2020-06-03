import { call, put, select } from "redux-saga/effects";

import {
  getProjects,
  addProjectToBudget,
  removeProjectFromBudget
} from "../../providers/api";
import { upsertProjectsToRedux, setProjectDetails } from "./actions";
import { getProjectByKeyFromReduxSelector } from "./selectors";

export function* getAllProjectsSaga() {
  try {
    const response = yield call(getProjects);
    if (response.projects) {
      yield put(upsertProjectsToRedux(response.projects));
    }
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}

export function* addProjectToBudgetSaga(key: string, budgetId: string) {
  try {
    const project = yield select(getProjectByKeyFromReduxSelector, key);

    const response = yield call(
      addProjectToBudget,
      key,
      project.name,
      budgetId
    );
    if (!response || response.message) {
      throw new Error("Failed to add project. Server error");
    }

    yield put(setProjectDetails(key, response.project));
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}

export function* removeProjectFromBudgetSaga(key: string, budgetId: string) {
  try {
    const response = yield call(removeProjectFromBudget, key, budgetId);
    if (!response || response.message) {
      throw new Error("Failed to remove project. Server error");
    }

    yield put(setProjectDetails(key, response.project));
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}
