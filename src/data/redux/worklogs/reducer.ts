import { Reducer } from "react";

import { IWorklogActions } from "./types";

const initialState = {
  filters: {}
};

const worklogsReducer: Reducer<any, any> = (state = initialState, action) => {
  switch (action.type) {
    case IWorklogActions.CLEAR_WORKLOGS: {
      const { filters } = state;
      return {
        filters
      };
    }

    case IWorklogActions.CLEAR_FILTER: {
      const { budgetId } = action.payload;
      const filters = state.filters;
      filters[budgetId] = 0;

      return {
        ...state,
        filters
      };
    }

    case IWorklogActions.SET_WORKLOGS_BY_BUDGET_ID: {
      const { budgetId, worklogs } = action.payload;
      return {
        ...state,
        [budgetId]: worklogs
      };
    }

    case IWorklogActions.SET_PREVIOUS_WORKLOGS: {
      const { budgetId, worklogs } = action.payload;
      return {
        ...state,
        [budgetId]: [...state[budgetId], ...worklogs]
      };
    }

    case IWorklogActions.SET_WORKLOGS_BY_BUDGET_ID_FROM_CACHE: {
      const { budgetWorklogs } = action.payload;
      return {
        ...state,
        ...budgetWorklogs
      };
    }

    case IWorklogActions.SET_WORKLOGS_FILTER: {
      const { budgetId, limit } = action.payload;

      return {
        ...state,
        filters: {
          [budgetId]: limit
        }
      };
    }

    case IWorklogActions.UPDATE_WORKLOGS_BY_BUDGET_ID: {
      const { budgetId, worklogId, worklogThumbs } = action.payload;
      const worklogs = state[budgetId];
      const foundWorklog = worklogs.findIndex(
        worklog => worklog.id === worklogId
      );
      worklogs[foundWorklog].worklogThumbs = worklogThumbs;

      return {
        ...state,
        [budgetId]: worklogs
      };
    }

    case IWorklogActions.SET_WORKLOGS_LOADING_STATUS: {
      return {
        ...state,
        worklogsAreLoading: action.payload.status
      };
    }

    case IWorklogActions.SET_BUDGETS_WORKLOGS_TO_REDUX: {
      const { budgetId, worklogs } = action.payload;
      return {
        ...state,
        [budgetId]: worklogs
      };
    }

    default: {
      return state;
    }
  }
};

export default worklogsReducer;
