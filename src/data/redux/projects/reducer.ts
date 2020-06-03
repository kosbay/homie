import { Reducer } from "react";

import { IProjectsState, IProjectsActions, IProject } from "./types";
import { IReduxAction } from "../types";

const initialState: IProjectsState = {
  projects: undefined,
  currentProject: ""
};

const projectsReducer: Reducer<IProjectsState, IReduxAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case IProjectsActions.UPSERT_PROJECTS_TO_REDUX: {
      const payloadProjects: IProject[] = action.payload.projects;
      const notUpdatedProjects = state.projects
        ? state.projects.filter(
            ({ key }) => !payloadProjects.find(pProj => pProj.key === key)
          )
        : [];
      return {
        ...state,
        projects: [...notUpdatedProjects, ...payloadProjects]
      };
    }

    case IProjectsActions.SET_PROJECT_DETAILS_TO_REDUX: {
      const { key, project } = action.payload;
      const projectsInState = state.projects;

      if (projectsInState) {
        const index = projectsInState.findIndex(project => project.key === key);
        return {
          ...state,
          projects: [
            ...projectsInState.slice(0, index),
            project,
            ...projectsInState.slice(index + 1)
          ]
        };
      } else {
        return {
          ...state,
          projects: [project]
        };
      }
    }

    case IProjectsActions.CLEAR_STATE: {
      return initialState;
    }

    default: {
      return state;
    }
  }
};

export default projectsReducer;
