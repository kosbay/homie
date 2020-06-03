import express from "express";
import asyncHandler from "express-async-handler";

import { ProjectController } from "../controllers";
import JiraAPIController from "../services/JiraAPIController";

const router = express.Router();
const jiraAPIController = new JiraAPIController();

router.get(
  "/",
  asyncHandler(async (_, res) => {
    const jiraProjects = await jiraAPIController.getProjectsWithComponentsFromCache(
      "projects"
    );
    const SCProjects = await ProjectController.getAllProjects();

    for (const p of jiraProjects) {
      const SCProject = SCProjects.find(sc => sc.key === p.key);
      if (SCProject) {
        p.budgetId = SCProject.budgetId;
      }
    }
    jiraProjects.sort((a, b) => b.id - a.id);

    return res.json({ projects: jiraProjects });
  })
);

export default router;
