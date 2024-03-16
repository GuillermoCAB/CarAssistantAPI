import mongoose, { Document, Schema } from "mongoose";

interface IOrder extends Document {
  customerId: Schema.Types.ObjectId;
  products: { productId: Schema.Types.ObjectId, quantity: number }[];
  total: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: ["pending", "paid", "shipped", "completed", "cancelled"],
    default: "pending"
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IOrder>("Order", OrderSchema);
