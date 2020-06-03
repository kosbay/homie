import express from "express";
import asyncHandler from "express-async-handler";
import createError from "http-errors";
import moment from "moment";

import calculations, { IGetBudgetParams } from "../helpers/calculations";
import { BudgetController, ProjectController } from "../controllers";
import JiraAPIController from "../services/JiraAPIController";

const router = express.Router();
const jiraAPIController = new JiraAPIController();

router.get(
  "/all",
  asyncHandler(async (_, res) => {
    const budgetList = await BudgetController.getAllBudgets();

    const budgetWithDetailsList = await Promise.all(
      budgetList.map(
        async budget => await BudgetController.getBudgetDetails(budget)
      )
    );

    return res.json({ budgetList: budgetWithDetailsList });
  })
);

router.get(
  "/byId/:budgetId",
  asyncHandler(async (req, res, next) => {
    const { budgetId } = req.params;

    if (!budgetId) {
      next(createError(400, "Budget id is empty"));
    }

    const budget = await BudgetController.getBudget({ _id: budgetId });

    if (!budget) {
      return next(createError(200, "Budget is not found"));
    }

    const budgetWithDetails = await BudgetController.getBudgetDetails(budget);

    return res.json({ budget: budgetWithDetails });
  })
);

router.get(
  "/:budgetId/projects",
  asyncHandler(async (req, res, next) => {
    const budgetId = req.params.budgetId;

    if (!budgetId) {
      return next(createError(400, "Budget id is empty"));
    }

    const projects = await ProjectController.getAllProjects({
      budgetId
    });

    return res.json({ projects });
  })
);

router.get(
  "/:budgetId/worklogs",
  asyncHandler(async (req, res, next) => {
    const budgetId = req.params.budgetId;
    const { limit = 0, cache = false } = req.query;

    if (!budgetId) {
      return next(createError(400, "Budget id is empty"));
    }

    const worklogs = await BudgetController.getLastWorklogsForBudget(
      budgetId,
      limit,
      cache
    );

    return res.json({ worklogs });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res, next) => {
    const { name, initialBudget, monthlyBudget, createDate } = req.body.params;

    const budget = await BudgetController.addBudget(
      name,
      moment(createDate).toDate(),
      initialBudget,
      monthlyBudget
    );

    if (!budget) {
      return next(createError(404, "Budget is not found"));
    }

    return res.json({
      budget: await BudgetController.getBudgetDetails(budget)
    });
  })
);

router.patch(
  "/update/:budgetId",
  asyncHandler(async (req, res, next) => {
    const { initialBudget, monthlyBudget } = req.body.params;
    const budgetId = req.params.budgetId;

    if (!budgetId) {
      return next(createError(400, "Budget id is empty"));
    }

    const budget = await BudgetController.updateBudget({
      budgetId,
      initialBudget,
      monthlyBudget
    });

    if (!budget) {
      return next(createError(404, "Budget is not found"));
    }

    return res.json({
      budget: await BudgetController.getBudgetDetails(budget)
    });
  })
);

router.post(
  "/add-project",
  asyncHandler(async (req, res) => {
    const { budgetId, name, key } = req.body;

    const { project } = await ProjectController.addProjectToBudget(
      key,
      name,
      budgetId
    );

    return res.json({ project });
  })
);

router.post(
  "/remove-project",
  asyncHandler(async (req, res, next) => {
    const { budgetId, key } = req.body;

    const jiraProject = await jiraAPIController.getProjectByKey(key);
    const isRemoved = await ProjectController.removeProjectFromBudget(
      key,
      budgetId
    );

    if (!isRemoved) {
      return next(createError(400, "Failed to remove project"));
    }

    return res.json({ project: jiraProject });
  })
);

router.get(
  "/graphs",
  asyncHandler(async (req, res) => {
    const { budgetId } = req.query;

    const [budget, worklogs, budgetPeriods] = await Promise.all([
      BudgetController.getBudget({ _id: budgetId }),
      BudgetController.getWorklogsForBudgetByDate(budgetId),
      BudgetController.getAllBudgetPeriods({
        budgetId
      })
    ]);

    const weeks = calculations.getWeeks(moment(budgetPeriods![0].start));
    const additionalBudgetHours = await BudgetController.getBudgetAdditionals(
      budgetId
    );

    const params = {
      initialBudget: budget!.initialBudget,
      worklogs,
      budgetPeriods
    };

    const budgets = weeks.map(({ startWeek, endWeek, state }) => {
      const currentBudget = calculations.getBudget({
        ...params,
        startWeek,
        endWeek,
        additionalBudgetHours
      } as IGetBudgetParams);
      return { ...currentBudget, state };
    });

    const mutatedWeeksBars = calculations.fillEmptyBars(budgets);
    const weeksLabel = calculations.setWeekLabels(mutatedWeeksBars);
    const barValues = calculations.setBarsValue(mutatedWeeksBars);

    return res.json({
      status: 200,
      weeksBars: mutatedWeeksBars,
      weeksLabel,
      barValues
    });
  })
);

router.get(
  "/user-worklogs",
  asyncHandler(async (req, res) => {
    const result = await jiraAPIController.getUserWorklogs(req.query);

    return res.json(result);
  })
);

router.get(
  "/report",
  asyncHandler(async (req, res) => {
    const { projectKeys } = req.query;

    const result = await jiraAPIController.getProjectReport({ projectKeys });

    return res.json(result);
  })
);

router.get(
  "/additional-budgets/:budgetId",
  asyncHandler(async (req, res) => {
    const { budgetId } = req.params;

    const budgetAdditionals = await BudgetController.getBudgetAdditionals(
      budgetId
    );

    return res.status(200).send(budgetAdditionals.reverse());
  })
);

router.post(
  "/additional-budget",
  asyncHandler(async (req, res) => {
    const { budgetId, hours } = req.body;

    const additionalBudget = await BudgetController.addAdditionalBudget(
      budgetId,
      hours
    );

    return res.status(200).send(additionalBudget);
  })
);

router.delete(
  "/additional-budget/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await BudgetController.removeAdditionalBudget(id);

    return res.status(200).send("OK!");
  })
);

export default router;
