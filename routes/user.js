import { Router } from "express";
const router = Router();

import {
  register,
  login,
  logout,
  getUser,
  updateUser,
  uploadProfileImage,
  uploadBgImage,
} from "../controllers/user.js";
import verifyUser from "../middlewares/verifyUser.js";
import { upload } from "../middlewares/multer.js";

router.get("/user", verifyUser, getUser);
router.get("/logout", logout);
router.put(
  "/user/upload/profile",
  verifyUser,
  upload.single("image"),
  uploadProfileImage
);
router.put(
  "/user/upload/background",
  verifyUser,
  upload.single("image"),
  uploadBgImage
);
router.post("/register", register);
router.post("/login", login);
router.put(
  "/user/update",
  verifyUser,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "backgroundImage", maxCount: 1 },
  ]),
  updateUser
);

export default router;
