import express from "express";
// @ts-ignore
import userController from "../controllers/users/users.controller.ts"
//@ts-ignore
import basketController from "../controllers/basket/basket.controller.ts";

const router = express.Router();

router.get("/users", userController.getAll)
router.get("/basket", basketController.getAll)

export default router;
