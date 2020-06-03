import { createSelector } from "reselect";
import { IAppState } from "../types";
import { IUser } from "./types";

const getCurrentUser = (state: IAppState): IUser | null =>
  state.users.currentUser;

export const getCurrentUserSelector = createSelector(
  [getCurrentUser],
  currentUser => currentUser
);
