import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  description: string;
  deadline?: Date;
  completed: boolean;
}

const TaskSchema = new Schema<ITask>(
  {
    description: { type: String, required: true },
    deadline: { type: Date },
    completed: { type: Boolean, default: false, required: true },
  },
  { timestamps: false, versionKey: false }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema, "tasks");
