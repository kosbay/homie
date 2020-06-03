import { Schema, Document, model } from "mongoose";

export interface IProjectModel extends Document {
  budgetId: string;
  key: string;
  name: string;
  threshold: number;
  createDate: Date;
}

const ProjectSchema = new Schema<IProjectModel>({
  budgetId: { type: Schema.Types.ObjectId, ref: "Budget" },
  key: String,
  threshold: Number,
  createDate: Date,
  name: String
});

export const Project = model<IProjectModel>(
  "Project",
  ProjectSchema,
  "Project"
);
