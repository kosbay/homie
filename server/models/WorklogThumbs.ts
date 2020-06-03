import { Schema, Document, model } from "mongoose";

export interface IWorklogThumbsModel extends Document {
  worklogId: string;
  users: string[];
}

const WorklogThumbsSchema = new Schema<IWorklogThumbsModel>({
  worklogId: String,
  users: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export const WorklogThumbs = model<IWorklogThumbsModel>(
  "WorklogThumbs",
  WorklogThumbsSchema,
  "WorklogThumbs"
);
