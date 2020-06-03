import { call, put, select } from "redux-saga/effects";

import { login, verifyCode, getUser } from "../../providers/api";
import store from "../../providers/store";

import { setUsersError, setLoading } from "./actions";
import { getCurrentUserSelector } from "./selectors";

export function* loginSaga({ username, password, type, verifyInfo }) {
  try {
    yield setUsersError("");
    yield put(setLoading(true));
    const res =
      type === "number"
        ? yield call(verifyCode, verifyInfo)
        : yield call(login, username, password);

    if (res && res.user) {
      yield call(store.setJWT, res.token);

      return res.user;
    }
    if (res && res.message) {
      yield put(setLoading(false));
      yield put(setUsersError(res.message));
    }
  } catch (err) {
    yield put(setLoading(false));
    yield put(setUsersError("Service is unavailable. Please, try later"));
  }
}

export function* getCurrentUserFromServerSaga() {
  try {
    const user = yield select(getCurrentUserSelector);
    if (user) {
      const res = yield call(getUser, user._id);
      if (res && res.user) {
        return res.user;
      }
    }
  } catch (err) {
    yield put(setUsersError(err.message));
  }

  return null;
}
