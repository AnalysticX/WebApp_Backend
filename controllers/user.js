import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const register = async (req, res) => {
  try {
    if (req.cookies.authToken) {
      return res
        .status(400)
        .json({ success: false, message: "Already logged in." });
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Provide all the details." });
    }
    const user = await User.create({ name, email, password });
    const token = createToken(user);
    res.cookie("authToken", token, {
      httpOnly: true,
      sameSite: "lax", // Helps against CSRF
      maxAge: 3600000, // 1 hour
    });
    return res
      .status(201)
      .json({ success: true, message: "Registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  if (req.cookies.authToken) {
    return res
      .status(400)
      .json({ success: false, message: "Already logged in." });
  }
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all credentials!" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: false, // Use only over HTTPS
      sameSite: "lax", // Helps against CSRF
      maxAge: 3600000, // 1 hour
    });
    res
      .status(200)
      .json({ success: true, message: "Logged in successfully.", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken");
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
