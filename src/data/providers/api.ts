import request from "../../request";

export const getUser = (uid: string) => {
  return request.get(`/user/${uid}`);
};

export const getAllBudgets = () => {
  return request.get("/budget/all");
};

export const getBudgetDetails = (budgetId: string) => {
  return request.get(`/budget/byId/${budgetId}`);
};

export const getProjectsForBudget = (budgetId: string) => {
  return request.get(`/budget/${budgetId}/projects`);
};

export const getBudgetsForCustomer = (uid: string) => {
  return request.get(`/users/${uid}/budgets`);
};

export const getBudgetWorklogs = (budgetId: string, params) => {
  return request.get(`/budget/${budgetId}/worklogs`, { params });
};

export const getProjects = () => {
  return request.get("/projects");
};

export const getUsers = () => {
  return request.get("/user");
};

export const getGrapsBars = params => {
  return request.get("/budget/graphs", { params });
};

/**
 * Updates, should invalidate cache
 */

export const login = async (username: string, password: string) => {
  return request.post("/auth/loginUser", { username, password });
};

export const loginWithNumber = async (phoneNumber: string) => {
  try {
    return request.post("/auth/sendCode", { phoneNumber });
  } catch (error) {
    return error;
  }
};

export const verifyCode = async ({ id, token, phoneNumber }) => {
  try {
    const response = await fetch(`/api/auth/sendVerify`, {
      method: "POST",
      headers: {
        Authorization: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id, token, phoneNumber })
    });

    return response.json();
  } catch (error) {
    return error;
  }
};

export const sendResetPasswordEmail = async (email: string) => {
  try {
    const response = await fetch(`/api/auth/sendResetPasswordEmail`, {
      method: "POST",
      headers: {
        Authorization: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    return response.json();
  } catch (error) {
    return error;
  }
};

export const resetUserPassword = async (
  userId: string,
  newPassword: string
) => {
  try {
    return request.post("/auth/resetUserPassword", { userId, newPassword });
  } catch (error) {
    return error;
  }
};

export const createBudget = async params => {
  return request.post("/budget", { params });
};

export const updateBudget = async (budgetId: string, params) => {
  return request.patch(`/budget/update/${budgetId}`, { params });
};

export const addProjectToBudget = async (
  key: string,
  name: string,
  budgetId: string
) => {
  return request.post(`/budget/add-project`, { key, name, budgetId });
};

export const removeProjectFromBudget = async (
  key: string,
  budgetId: string
) => {
  return request.post(`/budget/remove-project`, { key, budgetId });
};

export const removeUserFromBudget = async params => {
  return request.post("/user/del-from-budget", { params });
};

export const updateUser = async params => {
  return request.patch(`/user`, { params });
};

export const addUser = async params => {
  return request.post("/user", { params });
};

export const addWorklogThumb = async params => {
  return request.post(`/worklog/worklogThumbs`, params);
};

export const removeUserWorklogThumb = async params => {
  return request.post(`/worklog/removeThumb`, params);
};

export const getReportData = async params => {
  return request.get("/budget/report", { params });
};

export const addAdditionalBudget = async (budgetId: string, hours: number) => {
  return request.post("/budget/additional-budget", { budgetId, hours });
};

export const getAdditionalBudgets = async (budgetId: string) => {
  return request.get(`/budget/additional-budgets/${budgetId}`);
};

export const removeAdditionalBudget = async (id: string) => {
  return request.delete(`/budget/additional-budget/${id}`);
};
