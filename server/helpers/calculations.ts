import moment from "moment";

import { BudgetController } from "../controllers";
import { WorklogController } from "../controllers";
import {
  IBudgetPeriodModel,
  AdditionalBudget,
  IAdditionalBudgetModel
} from "../models";

interface IWeek {
  startWeek: moment.Moment;
  endWeek: moment.Moment;
  state: string;
  additionalBudget?: number;
}

export interface IGetBudgetParams {
  initialBudget: number;
  worklogs: any[];
  budgetPeriods: IBudgetPeriodModel[];
  startWeek: moment.Moment;
  endWeek: moment.Moment;
  additionalBudgetHours: IAdditionalBudgetModel[];
}

const getStartAndEndWeeks = (budgetPeriods: IBudgetPeriodModel[]) => {
  const createDate = moment(budgetPeriods[0].start);
  const currentMondayDate = moment().startOf("isoWeek");
  const startWeek = moment(currentMondayDate).isBefore(createDate)
    ? createDate
    : currentMondayDate;
  const endWeek = moment();

  return { startWeek, endWeek };
};

export const getAllAdditionalBudget = async budgetId => {
  const additionalBudgets = await AdditionalBudget.find({ budgetId });
  let additionalBudgetHours = 0;

  additionalBudgets.map(
    additionalBudget => (additionalBudgetHours += additionalBudget.hours)
  );

  return additionalBudgetHours;
};

export const getBudgetDetails = async (budget: any) => {
  const worklogsList = await BudgetController.getWorklogsForBudgetByDate(
    budget._id
  );

  const budgetPeriods = await BudgetController.getAllBudgetPeriods({
    budgetId: budget._id
  });

  const additionalBudgetHours = await BudgetController.getBudgetAdditionals(
    budget._id
  );

  const { startWeek, endWeek } = getStartAndEndWeeks(budgetPeriods);
  const budgetDetail = getBudget({
    initialBudget: budget.initialBudget,
    worklogs: worklogsList,
    budgetPeriods,
    startWeek,
    endWeek,
    additionalBudgetHours
  });

  return { ...budgetDetail, budgetId: budget._id };
};

export const getBudget = ({
  initialBudget,
  worklogs,
  budgetPeriods,
  startWeek,
  endWeek,
  additionalBudgetHours
}: IGetBudgetParams) => {
  let additionalHours = 0;
  let allAdditionalHours = 0;

  additionalBudgetHours.map(({ hours, created_at }) => {
    if (moment(created_at).isBetween(startWeek, endWeek, undefined, "[]")) {
      additionalHours += hours;
    }
    if (moment(created_at).isBefore(endWeek)) {
      allAdditionalHours += hours;
    }
  });

  const accumulated = budgetPeriods.reduce(
    (acc, { start, end, monthly_budget }) => {
      // this is needed to graph calculation
      if (startWeek.isBefore(start)) {
        return acc;
      }

      const momentStart = moment(start);
      const momentEnd = moment.min(
        endWeek,
        end ? moment(end) : moment().endOf("month")
      );
      const months = Math.ceil(momentEnd.diff(momentStart, "months", true));
      return acc + months * monthly_budget;
    },
    0
  );

  const budgetStartDateUnix = Math.min(
    ...budgetPeriods.map(({ start }) => moment(start).unix())
  );
  const worked = WorklogController.calculateWorkedHours(
    worklogs,
    budgetStartDateUnix,
    startWeek.unix()
  );

  const endOfNextMonth = moment()
    .add(1, "month")
    .endOf("month");
  const actualBudgetPeriod = budgetPeriods.find(({ start, end }) =>
    moment().isBetween(start, end ? end : endOfNextMonth)
  );
  const monthlyBudget = actualBudgetPeriod
    ? actualBudgetPeriod.monthly_budget
    : 0;

  const spent_given_week = WorklogController.calculateWorkedHours(
    worklogs,
    startWeek.unix(),
    endWeek.unix()
  );

  return {
    budgetStartDate: budgetPeriods[0].start,
    startWeek,
    monthlyBudget,
    spent_given_week,
    budget_left: initialBudget + allAdditionalHours + accumulated - worked,
    additionalBudget: additionalHours
  };
};

export const getWeeks = (createDate: moment.Moment): IWeek[] => {
  const CURRENT_MONDAY = moment().startOf("isoWeek");
  const monday5weeksAgo = CURRENT_MONDAY.clone().subtract(5, "weeks");
  const weeks = [] as IWeek[];

  // past 5 weeks
  let mondayOfWeek = monday5weeksAgo;
  while (mondayOfWeek.isBefore(CURRENT_MONDAY)) {
    const endOfWeek = mondayOfWeek.clone().endOf("isoWeek");
    if (endOfWeek.isAfter(createDate)) {
      const isCreateDateAfterMonday = mondayOfWeek.isBefore(createDate);
      weeks.push({
        startWeek: isCreateDateAfterMonday
          ? createDate.clone()
          : mondayOfWeek.clone(),
        endWeek: endOfWeek,
        state: "past"
      });
    }

    mondayOfWeek = mondayOfWeek.add(1, "week").startOf("isoWeek");
  }

  // current week
  weeks.push({
    startWeek: CURRENT_MONDAY,
    endWeek: CURRENT_MONDAY.clone().endOf("isoWeek"),
    state: "current"
  });

  // next week
  const nextMonday = CURRENT_MONDAY.clone()
    .add(1, "week")
    .startOf("isoWeek");
  weeks.push({
    startWeek: nextMonday,
    endWeek: nextMonday.endOf("isoWeek"),
    state: "next"
  });

  return weeks;
};

export const fillEmptyBars = weeksBars => {
  return weeksBars.length < 7
    ? weeksBars.concat(
        Array.from(Array(7 - weeksBars.length), () => ({
          budget_left: 0,
          spent_given_week: 0,
          state: ""
        }))
      )
    : weeksBars;
};

export const setWeekLabels = (weeks: IWeek[]) => {
  return weeks.map(({ startWeek, state, additionalBudget }) => {
    const weekNumber = moment(startWeek).isoWeek();

    return {
      weekNumber,
      currentWeek: state === "current",
      state,
      additionalBudget
    };
  });
};

export const setBarsValue = weeksBars => {
  let barValues: any = [];
  const maxValue = Math.max.apply(
    Math,
    weeksBars.map(({ budget_left }) => budget_left)
  );
  const minValue = Math.min.apply(
    Math,
    weeksBars.map(
      ({ budget_left, spent_given_week }) => budget_left - spent_given_week
    )
  );

  const maxValueInBar =
    maxValue < -minValue && minValue < 0
      ? Math.floor(-minValue)
      : Math.floor(maxValue);

  const roundMaxValueInBar =
    maxValueInBar % 50 === 0
      ? maxValueInBar
      : maxValueInBar + (50 - (maxValueInBar % 50));

  const repeatValue = roundMaxValueInBar / 10;

  if (minValue < 0) {
    let minusArray: any = [];
    for (let i = 0; minValue < i * -repeatValue; i++) {
      minusArray = minusArray.concat(-repeatValue * (i + 1));
    }

    barValues = barValues.concat(minusArray);
  }

  for (let i = 0; i < 11; i++) {
    barValues.unshift(repeatValue * i);
  }

  return barValues;
};

export default {
  fillEmptyBars,
  getBudget,
  getBudgetDetails,
  getWeeks,
  setBarsValue,
  setWeekLabels,
  getAllAdditionalBudget
};
