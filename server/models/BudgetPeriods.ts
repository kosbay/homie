import { Schema, Document, model } from "mongoose";

export interface IBudgetPeriodModel extends Document {
  budgetId: string;
  start: Date;
  end?: Date; // if empty -> it is current budget period
  monthly_budget: number;
}

const BudgetPeriodsModel = new Schema<IBudgetPeriodModel>({
  budgetId: { type: Schema.Types.ObjectId, ref: "Budget" },
  start: Date,
  end: Date,
  monthly_budget: Number
});

export const BudgetPeriods = model<IBudgetPeriodModel>(
  "BudgetPeriods",
  BudgetPeriodsModel,
  "BudgetPeriods"
);
