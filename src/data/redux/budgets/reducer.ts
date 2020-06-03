import { Reducer } from "react";

import { IBudgetsState, IBudgetsActions, IBudget } from "./types";
import { IReduxAction } from "../types";

const initialState: IBudgetsState = {
  budgetList: [],
  areLoading: false,
  createBudgetError: "",
  worklogsAreLoading: false,
  additionalBudgets: {}
};

const budgetsReducer: Reducer<IBudgetsState, IReduxAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case IBudgetsActions.SET_BUDGET_LIST_TO_REDUX: {
      return {
        ...state,
        budgetList: action.payload.budgetList,
        areLoading: false
      };
    }

    case IBudgetsActions.UPSERT_BUDGET_TO_REDUX: {
      const newBudget: IBudget = action.payload.budget;
      const isBudgetInRedux = !!state.budgetList.find(
        ({ _id }) => _id === newBudget._id
      );
      if (isBudgetInRedux) {
        return {
          ...state,
          budgetList: state.budgetList.map(budget => {
            return budget._id === newBudget._id ? newBudget : budget;
          })
        };
      } else {
        return {
          ...state,
          budgetList: [...state.budgetList, action.payload.budget]
        };
      }
    }

    case IBudgetsActions.SET_CREATE_BUDGET_ERROR: {
      return {
        ...state,
        createBudgetError: action.payload.errText,
        areLoading: false
      };
    }

    case IBudgetsActions.SET_BUDGET_USERS_TO_REDUX: {
      const { budgetId, budgetUsers } = action.payload;
      return {
        ...state,
        budgetList: state.budgetList.map(budget => {
          return budget._id !== budgetId ? budget : { ...budget, budgetUsers };
        })
      };
    }

    case IBudgetsActions.START_BUDGETS_LOADING: {
      return {
        ...state,
        areLoading: true
      };
    }
    case IBudgetsActions.STOP_BUDGETS_LOADING: {
      return {
        ...state,
        areLoading: false
      };
    }

    case IBudgetsActions.CLEAR_ERRORS: {
      return {
        ...state,
        createBudgetError: ""
      };
    }

    case IBudgetsActions.CLEAR_BUDGET_STATE: {
      return {
        ...initialState,
        additionalBudgets: state.additionalBudgets
      };
    }

    case IBudgetsActions.SET_ADDITIONAL_BUDGETS: {
      return {
        ...state,
        additionalBudgets: {
          [action.payload.budgetId]: action.payload.additionalBudgets
        }
      };
    }

    case IBudgetsActions.SET_ADDITIONAL_BUDGET: {
      const currentBudgets = state.additionalBudgets[action.payload.budgetId];
      currentBudgets.unshift(action.payload.additionalBudgets);

      return {
        ...state,
        additionalBudgets: {
          [action.payload.budgetId]: currentBudgets
        }
      };
    }

    case IBudgetsActions.REMOVE_ADDITIONAL_BUDGET: {
      const currentBudgets = state.additionalBudgets[action.payload.budgetId];
      const updatedBudgets = currentBudgets.filter(
        budget => budget._id !== action.payload.id
      );

      return {
        ...state,
        additionalBudgets: {
          [action.payload.budgetId]: updatedBudgets
        }
      };
    }

    default: {
      return state;
    }
  }
};

export default budgetsReducer;
