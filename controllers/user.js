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
    let { name, email, password } = req.body;
    if (!name || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Provide all the details." });
    }
    if (!(name.startsWith("Dr") || name.startsWith("Doctor"))) {
      name = "Dr. " + name;
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
      .json({ success: true, message: "Registered successfully", user });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const {
      name,
      email,
      contactNumber,
      backgroundImage,
      profileImage,
      specialty,
      department,
      gender,
      hospitalName,
      hospitalAddress,
    } = user;
    const updatedUser = {
      name,
      email,
      contactNumber,
      backgroundImage,
      profileImage,
      specialty,
      department,
      gender,
      hospitalName,
      hospitalAddress,
    };
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    await User.findByIdAndUpdate(req.user.id, updates);
    return res
      .status(200)
      .json({ success: true, message: "User Profile Updated!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const image = req.file;
    const { imageType } = req.body;
    console.log(image, imageType);
    if (imageType === "profileImage") {
      await User.findByIdAndUpdate(req.user.id, {
        profileImage: image.filename,
      });
    } else if (imageType === "backgroundImage") {
      await User.findByIdAndUpdate(req.user.id, {
        backgroundImage: image.filename,
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "User Profile Updated!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const uploadBgImage = async (req, res) => {
  try {
    const backgroundImage = req.file.path;
    await User.findByIdAndUpdate(req.user.id, { backgroundImage });
    return res
      .status(200)
      .json({ success: true, message: "User Profile Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: false, // should match what you used while setting
      sameSite: "lax",
      path: "/", // safest to add this unless you set a different path
    });
    res
      .status(200)
      .json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
