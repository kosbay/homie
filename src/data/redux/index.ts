import { createStore, combineReducers, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { enableBatching } from "redux-batched-actions";

import BudgetsReducer from "./budgets/reducer";
import ProjectsReducer from "./projects/reducer";
import UsersReducer from "./users/reducer";
import WorkllogsReducer from "./worklogs/reducer";

import { loadState, saveState } from "./redux-cache";
import { IAppState, refreshCacheAction } from "./types";

import rootSaga from "./rootSaga";

const persistedState: IAppState = loadState();
const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers<IAppState>({
  budgets: BudgetsReducer,
  projects: ProjectsReducer,
  users: UsersReducer,
  worklogs: WorkllogsReducer
});

export const ReduxStore = createStore(
  enableBatching(rootReducer),
  persistedState,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);
ReduxStore.subscribe(() => {
  saveState(ReduxStore.getState());
});

ReduxStore.dispatch(refreshCacheAction(false));
setInterval(() => ReduxStore.dispatch(refreshCacheAction(true)), 60000);
