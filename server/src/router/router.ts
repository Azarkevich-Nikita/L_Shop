import express from "express";
// @ts-ignore
import userController from "../controllers/users/users.controller.ts"
//@ts-ignore
import basketController from "../controllers/basket/basket.controller.ts";
//@ts-ignore
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get("/basket",authMiddleware, basketController.getBasketByUserID);
router.get("/basket/price",authMiddleware, basketController.getTotalPrice);
router.get("/basket/delivery", authMiddleware, basketController.Delivery);

router.post("/basket",authMiddleware, basketController.addToBasket);
router.patch("/basket/increase",authMiddleware, basketController.increaseQuantity);
router.patch("/basket/decrease",authMiddleware, basketController.decreaseQuantity);
router.delete("/basket",authMiddleware, basketController.removeItem);

router.post("/basket/delivery",authMiddleware, basketController.setDelivery);


router.get("/users", userController.getAll)
router.post("/auth/register", userController.register)
router.post("/auth/login", userController.login)
router.get("/auth/me", authMiddleware, userController.me)

export default router;
