import { IUser } from "./src/models/User";
import { Document } from "mongoose";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser & Document;
  }
}
