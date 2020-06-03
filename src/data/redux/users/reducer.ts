import { Reducer } from "react";

import { IUsersState, IUsersActions } from "./types";
import { IReduxAction } from "../types";

const initialState: IUsersState = {
  usersList: [],
  currentUser: null,
  error: null,
  isLoading: false,
  budgetIdFromSMS: ""
};

const projectsReducer: Reducer<IUsersState, IReduxAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case IUsersActions.SET_CURRENT_USER_TO_REDUX: {
      return {
        ...state,
        currentUser: action.payload.user
      };
    }

    case IUsersActions.SET_USERS_ERROR: {
      return {
        ...state,
        error: action.payload.error
      };
    }

    case IUsersActions.LOGOUT: {
      return initialState;
    }

    case IUsersActions.SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload.isLoading
      };
    }

    case IUsersActions.SET_USER_BUDGET_ID_FORM_SMS: {
      return {
        ...state,
        budgetIdFromSMS: action.payload.budgetId
      };
    }

    default: {
      return state;
    }
  }
};

export default projectsReducer;
