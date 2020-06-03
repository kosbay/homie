import { call, put, select } from "redux-saga/effects";

import {
  getAllBudgets,
  getBudgetsForCustomer,
  createBudget,
  updateBudget,
  getBudgetDetails,
  getAdditionalBudgets,
  addAdditionalBudget,
  removeAdditionalBudget
} from "../../providers/api";
import {
  setBudgetListToRedux,
  setCreateBudgetError,
  upsertBudgetToRedux,
  setAdditionalBudgets,
  setAdditionalBudget,
  removeAdditionalBudgetAction
} from "./actions";
import { getCurrentUserSelector } from "../users/selectors";

export function* getAllBudgetsFromServerSaga() {
  try {
    const response = yield call(getAllBudgets);
    if (!response || response.message) {
      throw new Error("error"); // todo add error text
    }

    yield put(setBudgetListToRedux(response.budgetList));
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}

export function* getBudgetDetailsSaga(budgetId: string) {
  try {
    const response = yield call(getBudgetDetails, budgetId);
    if (!response || response.message) {
      throw new Error("error"); // todo add error text
    }

    yield put(upsertBudgetToRedux(response.budget));
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}

export function* getCustomerBudgetsFromServerSaga() {
  try {
    const user = yield select(getCurrentUserSelector);
    if (!user) {
      throw new Error("error");
    }

    const response = yield call(getBudgetsForCustomer, user._id);
    if (!response || response.message) {
      throw new Error("error"); // todo add error text
    }

    yield put(setBudgetListToRedux(response.budgetList));
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}

export function* createBudgetSaga(
  name: string,
  initialBudget: number,
  monthlyBudget: number,
  createDate: Date
) {
  try {
    const response = yield call(createBudget, {
      name,
      initialBudget,
      monthlyBudget,
      createDate
    });
    if (!response || response.message) {
      throw new Error("Failed to create budget. Server error");
    }

    yield put(upsertBudgetToRedux(response.budget));
  } catch (err) {
    yield put(setCreateBudgetError(err.message));
  }
}

export function* updateBudgetSaga(
  budgetId: string,
  initialBudget: number,
  monthlyBudget: number
) {
  try {
    const response = yield call(updateBudget, budgetId, {
      initialBudget,
      monthlyBudget
    });
    if (!response || response.message) {
      throw new Error("Failed to update budget. Server error");
    }

    yield put(upsertBudgetToRedux(response.budget));
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}

export function* getAdditionalBudgetsSaga(budgetId: string) {
  try {
    const response: any = yield call(getAdditionalBudgets, budgetId);

    if (!response || response.message) {
      throw new Error("Failed to update budget. Server error");
    }

    yield put(setAdditionalBudgets(budgetId, response));
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}

export function* addAdditionalBudgetSaga(budgetId: string, hours: number) {
  try {
    const response: any = yield call(addAdditionalBudget, budgetId, hours);

    if (!response || response.message) {
      throw new Error("Failed to update budget. Server error");
    }

    yield put(setAdditionalBudget(budgetId, response));
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}

export function* removeAdditionalBudgetSaga(budgetId: string, id: string) {
  try {
    const response = yield call(removeAdditionalBudget, id);
    if (!response) {
      throw new Error("Failed to update budget. Server error");
    }

    yield put(removeAdditionalBudgetAction(budgetId, id));
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log(err);
  }
}
