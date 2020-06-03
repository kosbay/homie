export const enum UserRoles {
  ADMIN = "admin", // ?? TODO decide uppercase or not
  CUSTOMER = "Customer" // ?? TODO decide uppercase or not
}

export interface IUser {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  lastLogin: Date | null;
  role: UserRoles;
  projects: any[];
  budgets: any[];
  phoneNumber: string;
  notificationType?: string;
}

export interface IUsersState {
  readonly usersList: IUser[];
  readonly currentUser: IUser | null;
  readonly error: string | null;
  readonly isLoading: boolean;
  readonly budgetIdFromSMS: string;
}

export const enum IUsersActions {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SET_CURRENT_USER_TO_REDUX = "SET_CURRENT_USER_TO_REDUX",
  SET_USERS_ERROR = "SET_USERS_ERROR",
  SET_LOADING = "SET_LOADING",
  SET_USER_BUDGET_ID_FORM_SMS = "SET_USER_BUDGET_ID_FORM_SMS"
}
