import bcrypt from "bcryptjs";
import express from "express";
import userModel from "../models/user.model.js";

const registerRoute = express.Router();

registerRoute.post("/", async (req, res) => {
  const { email, password, name } = req.body;

  if (!email) return res.status(400).json({ message: "email is required." });
  if (!password)
    return res.status(400).json({ message: "password is required." });
  if (!name) return res.status(400).json({ message: "name is required." });

  const user = await userModel.findUserByEmail(email);

  if (user == null) {
    const hashPass = bcrypt.hashSync(password, 10);
    const newUser = await userModel.createUser(email, hashPass, name);

    if (newUser) {
      return res.status(200).json({ message: "Register successful." });
    }

    return res.status(500).json({ message: "Register failed." });
  }

  res.status(401).json({ message: "Email has already exists." });
});

export default registerRoute;
