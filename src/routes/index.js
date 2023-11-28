import express from "express";
import {
  getUsers,
  Register,
  Login,
  Logout,
  getRating,
  getRatingResult,
  getUserRole,
} from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { authorizeAdmin } from "../middleware/authorizeAdmin.js";

const router = express.Router();

router.get("/users", verifyToken, getUsers);
router.post("/users", Register, verifyToken, getUsers);
router.post("/login", Login);
router.get("/token", refreshToken);
router.post("/logout", Logout);
router.post("/submit-ratings", getRating);
router.get("/ratings", getRatingResult);
router.get("/user-role", verifyToken, authorizeAdmin, getUserRole); // Protected route
router.get("/admin-route", verifyToken, authorizeAdmin, (req, res) => {
  // Only admin users can access this route
  res.json({ msg: "Admin route accessed" });
});

export default router;
