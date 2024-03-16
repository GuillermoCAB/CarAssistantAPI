import mongoose, { Document, Schema } from "mongoose";


interface IDeliveryTracking extends Document {
  orderId: Schema.Types.ObjectId;
  status: "preparing_for_shipment" | "in_transit" | "delivered" | "delayed" | "cancelled";
  locations: { date: Date; description: string }[];
  estimatedDeliveryDate: Date;
}

const DeliveryTrackingSchema: Schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  status: {
    type: String,
    required: true,
    enum: ["preparing_for_shipment", "in_transit", "delivered", "delayed", "cancelled"],
    default: "preparing_for_shipment"
  },
  locations: [{
    date: { type: Date, required: true },
    description: { type: String, required: true },
    state: {type: String, required: true},
    city: {type: String, required: true},
  }],
  estimatedDeliveryDate: { type: Date, required: true },
});

export default mongoose.model<IDeliveryTracking>("DeliveryTracking", DeliveryTrackingSchema);
