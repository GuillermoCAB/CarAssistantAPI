import express from "express";
import User from "../models/User";
import crypto from "crypto-js";
import sendEmail from "../services/emailService";
import Joi from "@hapi/joi";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authMiddleware";

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

const verifySchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
});

const sendCodeSchema = Joi.object({
  email: Joi.string().email().required(),
});

const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message:
        "User with this email already exists. Please use the verifyUser to login the user and genarete the bearer token.",
    });
  }

  let code = crypto.lib.WordArray.random(3).toString(crypto.enc.Hex); // generate a 6-digit code

  let existingCodeUser = await User.findOne({ code });

  while (existingCodeUser) {
    code = crypto.lib.WordArray.random(3).toString(crypto.enc.Hex);
    existingCodeUser = await User.findOne({ code });
  }

  const user = new User({ name, email, code });

  await user.save();

  try {
    await sendEmail(
      email,
      "Your verification code",
      `Your verification code is ${code}`
    );

    res.status(201).json({
      message: "User created successfully, check your email for the code",
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/verify", async (req, res) => {
  const { error } = verifySchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Need code!" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  if (user.code.toLowerCase() !== code.toLowerCase()) {
    return res.status(400).json({ message: "Invalid code" });
  }

  user.status = "active";
  user.code = undefined; // remove the code after verification

  await user.save();

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // expires in 24 hours
  );

  res.json({ message: "User verified successfully", token, user });
});

router.post("/sendcode", async (req, res) => {
  const { error } = sendCodeSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const code = crypto.lib.WordArray.random(3).toString(crypto.enc.Hex); // generate a new 6-digit code

  const existingCodeUser = await User.findOne({ code });

  if (existingCodeUser) {
    return res.status(400).json({ message: "Code already exists" });
  }

  user.code = code;

  await user.save();

  sendEmail(
    email,
    "Your verification code",
    `Your new verification code is ${code}`
  );

  res.json({ message: "Code sent successfully, check your email" });
});

router.put("/interests", authMiddleware, async (req, res) => {
  const { interests } = req.body;

  // @ts-ignore
  const user = req.user;
  user.interests = interests;

  await user.save();

  res.json({ message: "Interests updated successfully" });
});

export default router;
