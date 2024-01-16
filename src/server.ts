import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import usersRoutes from "./routes/users";
import scheduleRoutes from "./routes/schedules";
import bodyParser from "body-parser";

dotenv.config();

const jsonParser = bodyParser.json();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});

app.use("/users", jsonParser, usersRoutes);
app.use("/schedules", jsonParser, scheduleRoutes);

mongoose.connect(process.env.MONGODB_URI, {
  autoIndex: true,
});
