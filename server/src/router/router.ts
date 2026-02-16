import express from "express";
// @ts-ignore
import userController from "../controllers/users/users.controller.ts"
//@ts-ignore
import basketController from "../controllers/basket/basket.controller.ts";

const router = express.Router();

router.get("/users", userController.getAll)
router.get("/basket", basketController.getAll)
router.get("/basket/price", basketController.getTotalPrice)
router.get("/basket/delivery", basketController.setDelivery)

export default router;
