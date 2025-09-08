import * as express from "express";
import User from "../models/User";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    res.status(201).json({ message: "User created", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.password !== password) { //normally you hash passwords
    return res.status(401).json({ message: "Invalid password" });
  }

  res.json({ message: "Login successful", user });
})

export default router;
