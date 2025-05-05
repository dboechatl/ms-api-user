import express from "express";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

router.post("/users", async (req, res) => {
    try {
        const result = await UserController.createUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : "An unknown error occurred" });
    }
});

export default router;