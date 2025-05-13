import { Router } from "express";
const router = Router();

import { register, login, logout } from "../controllers/user.js";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

export default router;
