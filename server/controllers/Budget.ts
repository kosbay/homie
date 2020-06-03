import moment from "moment";
import createError from "http-errors";

import {
  BudgetPeriods,
  IBudgetPeriodModel,
  IBudgetModel,
  Budget,
  AdditionalBudget
} from "../models";
import JiraAPIController from "../services/JiraAPIController";
import { WorklogController } from "./Worklog";
import { UserController } from "./User";
import { ProjectController } from "./Project";
import calculations from "../helpers/calculations";

const jiraAPIController = new JiraAPIController();

export const BudgetController = {
  getBudget: async (params: Partial<IBudgetModel>) => {
    return await Budget.findOne(params);
  },

  getBudgetStartDate: async (
    budgetId: string,
    incomingBudgetPeriods?: IBudgetPeriodModel[]
  ) => {
    let budgetPeriods = incomingBudgetPeriods;
    if (!budgetPeriods) {
      budgetPeriods = await BudgetController.getAllBudgetPeriods({
        budgetId
      });
    }

    return budgetPeriods.length > 0
      ? budgetPeriods[0].start
      : moment().toDate();
  },

  getAllBudgets: async (params = {}) => {
    return await Budget.find(params);
  },

  getAllBudgetPeriods: async (params = {} as Partial<IBudgetPeriodModel>) => {
    return await BudgetPeriods.find(params);
  },

  getWorklogsForBudgetByDate: async (
    budgetId: string,
    dateFrom?: Date,
    dateTo?: Date
  ) => {
    const projectList = await ProjectController.getAllProjects({
      budgetId
    });

    const budgetPeriods = await BudgetController.getAllBudgetPeriods({
      budgetId
    });

    const budgetStartDate =
      budgetPeriods.length > 0 ? budgetPeriods[0].start : undefined;

    const worklogsList = await Promise.all(
      projectList.map(project => {
        dateFrom = dateFrom ? dateFrom : budgetStartDate;
        return jiraAPIController.getWorklogs({
          dateFrom,
          projectKey: project.key,
          dateTo
        });
      })
    );

    return worklogsList.reduce((acc, val) => acc.concat(val), []);
  },

  getLastWorklogsForBudget: async (
    budgetId: string,
    limit: number = 0,
    cache: boolean = false
  ) => {
    const projectList = await ProjectController.getAllProjects({
      budgetId
    });

    const projectKeys = projectList.map(({ key }) => key);
    return await jiraAPIController.getLastWorklogs(projectKeys, limit, cache);
  },

  addBudget: async (
    name: string,
    startDate: Date,
    initialBudget: number,
    monthlyBudget: number
  ) => {
    const existingBudget = await Budget.findOne({ name });

    if (existingBudget) {
      throw createError(404, "Budget with the same name is already exist");
    }

    const budget = new Budget({
      name,
      start: startDate,
      initialBudget
    });

    await budget.save();
    await BudgetController.addBudgetPeriod(
      budget._id,
      startDate,
      monthlyBudget
    );

    return budget;
  },

  addBudgetPeriod: async (
    budgetId: string,
    start: Date,
    monthly_budget: number
  ) => {
    const budgetPeriod = new BudgetPeriods({
      budgetId,
      start,
      monthly_budget
    });

    await budgetPeriod.save();

    return budgetPeriod;
  },

  updateBudget: async (params: {
    budgetId: string;
    initialBudget: number;
    monthlyBudget: number;
  }) => {
    const { budgetId, initialBudget, monthlyBudget } = params;
    const budget = await Budget.findById(budgetId);

    if (!budget) {
      throw createError(404, "Budget not found");
    }

    budget.initialBudget = initialBudget;
    await budget.save();

    const actualBudgetPeriod = await BudgetController.getActualBudgetPeriod(
      budgetId
    );

    if (
      actualBudgetPeriod &&
      actualBudgetPeriod.monthly_budget !== monthlyBudget
    ) {
      const endOfCurrentMonth = moment()
        .endOf("month")
        .toDate();
      const startOfNextMonth = moment()
        .add(1, "month")
        .startOf("month")
        .toDate();
      actualBudgetPeriod.end = endOfCurrentMonth;

      await actualBudgetPeriod.save();
      await BudgetController.addBudgetPeriod(
        budgetId,
        startOfNextMonth,
        monthlyBudget
      );
    }

    return budget;
  },

  /**
   * Returns a budget's period that is currently used by the budget
   */
  getActualBudgetPeriod: async (budgetId: string) => {
    return await BudgetPeriods.findOne({
      budgetId,
      end: { $exists: false }
    });
  },

  getBudgetDetails: async (budget: IBudgetModel) => {
    const budgetId = budget._id;

    const budgetStartDate = await BudgetController.getBudgetStartDate(budgetId);

    const startOfCurrentMonth = moment()
      .startOf("month")
      .toDate();

    const worklogsFromDate = moment(budgetStartDate).isAfter(
      startOfCurrentMonth
    )
      ? budgetStartDate
      : startOfCurrentMonth;
    const worklogs = await BudgetController.getWorklogsForBudgetByDate(
      budgetId,
      worklogsFromDate
    );
    const lastWorklogs = await BudgetController.getLastWorklogsForBudget(
      budgetId,
      20
    );

    const spentBudgetThisMonth = WorklogController.calculateWorkedHours(
      worklogs
    );
    const budgetDetail = await calculations.getBudgetDetails(budget);
    const budgetUsers = await UserController.getAllUsers({
      budgets: budgetId
    });

    return {
      ...budget.toObject(),
      budgetUsers,
      worklogs: lastWorklogs,
      spentBudgetThisMonth,
      startDate: moment(budgetDetail.budgetStartDate).format(
        "YYYY-MM-DD 00:00:00"
      ),
      remainingBudget:
        +budgetDetail.budget_left - +budgetDetail.spent_given_week,
      monthlyBudget: budgetDetail.monthlyBudget
    };
  },

  getBudgetAdditionals: async (budgetId: string) =>
    await AdditionalBudget.find({ budgetId }).select({
      hours: 1,
      created_at: 1
    }),

  addAdditionalBudget: async (budgetId: string, hours: number) =>
    await AdditionalBudget.create({ budgetId, hours }),

  removeAdditionalBudget: async (id: string) => {
    await AdditionalBudget.findByIdAndRemove(id);
  }
};
