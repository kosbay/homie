import { call, put } from "redux-saga/effects";
import { batchActions } from "redux-batched-actions";

import { getBudgetWorklogs } from "../../providers/api";
import {
  setWorklogsByBudgetId,
  setWorklogsFilter,
  setWorklogsLoadingStatus,
  setPreviousWorklogs
} from "./actions";
import { cancelRefresher } from "../rootSaga";

export function* getBudgetWorklogsSaga(budgetId: string, limit: number = 0) {
  yield cancelRefresher();
  yield put(setWorklogsLoadingStatus(true));
  try {
    const response = yield call(getBudgetWorklogs, budgetId, { limit });
    if (!response || response.message) {
      throw new Error("error"); // todo add error text
    }

    yield put(
      batchActions([
        setWorklogsFilter(budgetId, limit),
        setWorklogsByBudgetId(budgetId, response.worklogs),
        setWorklogsLoadingStatus(false)
      ])
    );
  } catch (err) {
    yield put(setWorklogsLoadingStatus(false));
  }
}

export function* getPreviousWorklogsSaga(budgetId: string, limit: number = 0) {
  yield cancelRefresher();
  yield put(setWorklogsLoadingStatus(true));
  try {
    const response = yield call(getBudgetWorklogs, budgetId, { limit });
    if (!response || response.message) {
      throw new Error("error"); // todo add error text
    }

    yield put(
      batchActions([
        setWorklogsFilter(budgetId, limit),
        setPreviousWorklogs(budgetId, response.worklogs),
        setWorklogsLoadingStatus(false)
      ])
    );
  } catch (err) {
    yield put(setWorklogsLoadingStatus(false));
  }
}
