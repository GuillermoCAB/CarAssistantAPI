import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  interests: string[];
  schedules: Schema.Types.ObjectId[];
  status: "pendent" | "active" | "blocked";
  code?: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  interests: [String],
  schedules: [{ type: Schema.Types.ObjectId, ref: "Schedule" }],
  status: {
    type: String,
    required: true,
    default: "pendent",
    enum: ["pendent", "active", "blocked"],
  },
  code: String,
});

export default mongoose.model<IUser>("User", UserSchema);
