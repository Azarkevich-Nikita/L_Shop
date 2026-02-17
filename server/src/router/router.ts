import express from "express";
// @ts-ignore
import userController from "../controllers/users/users.controller.ts"
//@ts-ignore
import basketController from "../controllers/basket/basket.controller.ts";

const router = express.Router();

router.get("/basket", basketController.getAll);
router.get("/basket/price", basketController.getTotalPrice);

router.post("/basket", basketController.addToBasket);
router.patch("/basket/increase", basketController.increaseQuantity);
router.patch("/basket/decrease", basketController.decreaseQuantity);
router.delete("/basket", basketController.removeItem);

router.post("/basket/delivery", basketController.setDelivery);
router.get("/users", userController.getAll)
router.post("/users", userController.register)

export default router;
