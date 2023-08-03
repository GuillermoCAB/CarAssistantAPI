import mongoose, { Document, Schema } from "mongoose";

export interface ISchedule extends Document {
  user: Schema.Types.ObjectId[];
  date: String;
  hour: String;
  vehicle: String[];
}

const ScheduleSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  hour: { type: String, required: true },
  vehicle: { type: [String], required: true },
});

export default mongoose.model<ISchedule>("Schedule", ScheduleSchema);
