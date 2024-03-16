import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string[];
  images: string[];
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  vector: {type: Number},
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: [String],
  images: [String],
});

export default mongoose.model<IProduct>("Product", ProductSchema);
