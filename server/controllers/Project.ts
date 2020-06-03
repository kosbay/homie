import moment from "moment";
import createError from "http-errors";

import { Project, IProjectModel } from "../models";

export const ProjectController = {
  getAllProjects: async (
    params = {} as Partial<IProjectModel>
  ): Promise<IProjectModel[]> => {
    try {
      const projects = await Project.find(params);

      return projects;
    } catch (err) {
      throw err;
    }
  },

  addProjectToBudget: async (key: string, name: string, budgetId: string) => {
    let project = await Project.findOne({ key });

    if (project) {
      if (project.budgetId) {
        throw createError(400, "The project has been added to another budget");
      } else {
        project.name = name;
        project.budgetId = budgetId;
      }
    } else {
      project = new Project({
        key,
        name,
        budgetId,
        createDate: moment().toDate()
      });
    }

    await project.save();

    return { project };
  },

  removeProjectFromBudget: async (key: string, budgetId: string) => {
    const { deletedCount } = await Project.deleteOne({
      key,
      budgetId
    });

    return deletedCount ? deletedCount > 0 : false;
  }
};
