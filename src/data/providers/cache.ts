const CACHE_PREFIX = "@cache/";
const CACHE_PROJECT_BUDGET = CACHE_PREFIX + "project_budget";

const setProjectBudget = (key, budget) => {
  localStorage.setItem(
    CACHE_PROJECT_BUDGET + "/" + key,
    JSON.stringify(budget)
  );
};

const getProjectBudget = key => {
  const budgetJson = localStorage.getItem(CACHE_PROJECT_BUDGET + "/" + key);
  return budgetJson ? JSON.parse(budgetJson) : null;
};

export default {
  setProjectBudget,
  getProjectBudget
};
