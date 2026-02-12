import express from "express";
import userController from "../controllers/users/users.controller.ts"

const router = express.Router();

router.get("/users", userController.getAll)

export default router;
