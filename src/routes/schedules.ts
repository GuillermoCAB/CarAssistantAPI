import express from "express";
import Schedule from "../models/Schedule";
import { authMiddleware } from "../middlewares/authMiddleware";
import Joi from "@hapi/joi";
import JoiDate from "@hapi/joi-date";

const joi = Joi.extend(JoiDate);

const scheduleSchema = joi.object({
  date: joi.date().format("MM/DD/YYYY").required(),
  hour: joi
    .string()
    .pattern(/^(?:2[0-3]|[01][0-9]):[0-5][0-9]$/)
    .required(), // HH:MM format
  vehicle: joi.array().items(joi.string()).required(),
});

const router = express.Router();

router.post("/schedules", authMiddleware, async (req, res) => {
  const { error } = scheduleSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { date, hour, vehicle } = req.body;

  const existingSchedule = await Schedule.findOne({
    // @ts-ignore
    user: req.user.id,
    date,
    hour,
  });

  if (existingSchedule) {
    return res.status(400).json({ message: "Schedule already exists" });
  }

  // @ts-ignore
  const schedule = new Schedule({ user: req.user.id, date, hour, vehicle });

  await schedule.save();

  res.status(201).json({ message: "Schedule created successfully", schedule });
});

router.delete("/schedules", authMiddleware, async (req, res) => {
  const { error } = scheduleSchema.validate(req.query);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { date, hour } = req.query;

  const schedule = await Schedule.findOneAndDelete({
    // @ts-ignore
    user: req.user.id,
    date,
    hour,
  });

  if (!schedule) {
    return res.status(404).json({ message: "Schedule not found" });
  }

  res.json({ message: "Schedule deleted successfully" });
});

router.get("/schedules", authMiddleware, async (req, res) => {
  // @ts-ignore
  const schedules = await Schedule.find({ user: req.user.id });

  res.json(schedules);
});

export default router;
