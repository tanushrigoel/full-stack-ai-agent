import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";

export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      skills,
    });

    await inngest.send({
      name: "user/signup",
      data: { email },
    });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );
    return res.json({ user, token });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Signup failed", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatched = await bcrypt.compare(user.password, password);
    if (!isMatched) {
      return res.status(401).json({ error: "Wrong password" });
    }
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    return res.json({ user, token });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Login failed", details: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized access" });
      }
      res.json({ message: "Logout successfully" });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Logout failed", details: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;
  try {
    if (!req.user?.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    await User.updateOne(
      { email },
      { skills: skills.length ? skills : user.skills },
      { role }
    );
    return res.json({ message: "User updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Logout failed", details: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const user = await User.find().select("-password");
    return res.json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Getting users failed", details: error.message });
  }
};
