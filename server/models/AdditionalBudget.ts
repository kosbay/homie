import { Schema, Document, model } from "mongoose";

export interface IAdditionalBudgetModel extends Document {
  budgetId?: string;
  hours: number;
  created_at?: Date;
}

const AdditionalBudgetModel = new Schema<IAdditionalBudgetModel>(
  {
    budgetId: { type: Schema.Types.ObjectId, ref: "Budget" },
    hours: Number
  },
  {
    timestamps: { createdAt: "created_at" }
  }
);

export const AdditionalBudget = model<IAdditionalBudgetModel>(
  "AdditionalBudget",
  AdditionalBudgetModel,
  "AdditionalBudget"
);
