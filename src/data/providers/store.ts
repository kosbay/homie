const getJWT = () => {
  return localStorage.getItem("JWT");
};

const setJWT = value => {
  return localStorage.setItem("JWT", value);
};

const getLastOpenedBudget = id => {
  return localStorage.getItem(id);
};

const setLastOpenedBudget = (userId, projectId) => {
  return localStorage.setItem(userId, projectId);
};

const removeLastOpenedBudget = id => {
  return localStorage.removeItem(id);
};

const clearCache = () => {
  localStorage.removeItem("JWT");
};

export default {
  getJWT,
  setJWT,
  getLastOpenedBudget,
  setLastOpenedBudget,
  removeLastOpenedBudget,
  clearCache
};
