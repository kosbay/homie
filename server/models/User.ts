import { Schema, model, Document } from "mongoose";

export interface IUserModel extends Document {
  _id: string;
  email: string;
  username: string;
  password: string;
  fullName: string;
  lastLogin: Date | null;
  role: string;
  budgets: string[];
  phoneNumber?: string;
  projects?: string;
  notificationType?: string;
  isClient?: boolean;
}

const UserSchema = new Schema<IUserModel>({
  email: String,
  username: String,
  password: String,
  fullName: String,
  lastLogin: Date,
  role: String,
  budgets: [{ type: Schema.Types.ObjectId, ref: "Budget" }],
  phoneNumber: String,
  notificationType: {
    type: "string",
    enum: ["mail", "phone", "both"],
    default: "mail"
  },
  isClient: Boolean
});

export const User = model<IUserModel>("User", UserSchema, "User");
