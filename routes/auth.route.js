import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import randomstring from "randomstring";
import db from "../utils/db.js";
import userModel from "../models/user.model.js";

const authRoute = express.Router();

authRoute.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "email is required." });
  if (!password)
    return res.status(400).json({ message: "password is required." });

  const user = await userModel.findUserByEmail(email);

  if (user == null) {
    res.status(401).json({ message: "Invalid email." });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    res.status(401).json({ message: "Password is wrong." });
  }

  const payload = {
    user_id: user.user_id,
  };

  const access_token = jwt.sign(payload, "SECRET_KEY", {
    expiresIn: "7d",
  });

  const refresh_token = randomstring.generate(100);

  await userModel.updateUser(user.user_id, "rf_token", refresh_token);

  return res.status(200).json({
    access_token,
    refresh_token,
  });
});

export default authRoute;
