import { Schema, Document, model } from "mongoose";

export interface IBudgetModel extends Document {
  name: string;
  startDate: Date;
  endDate?: Date;
  initialBudget: number;
}

const BudgetSchema = new Schema<IBudgetModel>({
  name: String,
  startDate: Date,
  endDate: Date,
  initialBudget: Number
});

export const Budget = model<IBudgetModel>("Budget", BudgetSchema, "Budget");
