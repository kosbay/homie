import { createSelector } from "reselect";

const isUserClicked = (_id, worklogThumbs) =>
  worklogThumbs && worklogThumbs.users.includes(_id);

const getWorklogsOfBudget = (state, propBudgetId) => {
  const worklogs = state.worklogs[propBudgetId];
  const { currentUser } = state.users;

  if (!worklogs) {
    return [];
  }

  const worklogsWithThumbs = worklogs.map(worklog => {
    if (
      isUserClicked(currentUser._id, worklog.worklogThumbs) &&
      worklog.worklogThumbs
    ) {
      worklog.worklogThumbs.clicked = true;
    }

    return worklog;
  });

  return worklogsWithThumbs;
};

const getFilters = (state, budgetId) => state.worklogs.filters[budgetId];

export const makeGetWorklogsOfBudget = () =>
  createSelector(
    [getWorklogsOfBudget],
    worklogs => worklogs
  );

export const getFiltersSelector = createSelector(
  [getFilters],
  filter => filter
);
