import express from "express";
import User from "../models/User.js";
import { verifyToken, verifyRole } from "../middleware/auth.js";

const router = express.Router();

// GET ALL USERS
router.get("/", verifyRole(["manager", "admin"]), async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

export default router;
