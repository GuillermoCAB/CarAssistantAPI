import express from "express";
import Schedule from "../models/Schedule";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/schedules", authMiddleware, async (req, res) => {
  const { date, hour, vehicle } = req.body;

  const existingSchedule = await Schedule.findOne({
    user: req.user.id,
    date,
    hour,
  });

  if (existingSchedule) {
    return res.status(400).json({ message: "Schedule already exists" });
  }

  const schedule = new Schedule({ user: req.user.id, date, hour, vehicle });

  await schedule.save();

  res.status(201).json({ message: "Schedule created successfully" });
});

router.delete("/schedules", authMiddleware, async (req, res) => {
  const { date, hour } = req.query;

  const schedule = await Schedule.findOne({ user: req.user.id, date, hour });

  if (!schedule) {
    return res.status(404).json({ message: "Schedule not found" });
  }

  await schedule.remove();

  res.json({ message: "Schedule deleted successfully" });
});

router.get("/schedules", authMiddleware, async (req, res) => {
  const schedules = await Schedule.find({ user: req.user.id });

  res.json(schedules);
});

export default router;
