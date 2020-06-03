import { createSelector } from "reselect";
import { IAppState } from "../types";
import { IProject } from "./types";

const getProjectByKeyFromRedux = (
  state: IAppState,
  searchKey: string
): IProject | undefined => {
  const projectList = state.projects.projects;
  return projectList
    ? projectList.find(({ key }) => key === searchKey)
    : undefined;
};

const getProjects = (state: IAppState): IProject[] | undefined =>
  state.projects.projects;

export const getProjectByKeyFromReduxSelector = createSelector(
  [getProjectByKeyFromRedux],
  projectByKey => projectByKey
);

export const getProjectsSelector = createSelector(
  [getProjects],
  projects => projects
);
