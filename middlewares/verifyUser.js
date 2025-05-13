import jwt from "jsonwebtoken";

export default function (req, res, next) {
  try {
    if (!req.cookies) {
      return res.status(401).json({ success: false, message: "Access denied" });
    }
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ success: false, message: "Invalid token" });
  }
}
