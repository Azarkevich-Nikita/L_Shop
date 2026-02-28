import express from "express";
// @ts-ignore
import userController from "../controllers/users/users.controller.ts"
//@ts-ignore
import basketController from "../controllers/basket/basket.controller.ts";
//@ts-ignore
import productsController from "../controllers/products/products.controller.ts";
//@ts-ignore
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.get("/basket", basketController.getBasketByUserID);
router.get("/basket/price", basketController.getTotalPrice);

router.post("/basket", basketController.addToBasket);
router.patch("/basket/increase", basketController.increaseQuantity);
router.patch("/basket/decrease", basketController.decreaseQuantity);
router.delete("/basket", basketController.removeItem);

router.post("/basket/delivery", basketController.setDelivery);

router.get("/users", userController.getAll)
router.post("/auth/register", userController.register)
router.post("/auth/login", userController.login)
router.get("/auth/me", authMiddleware, userController.me)

router.get("/catalog", authMiddleware, productsController.getFullCatalogue)
router.get("/catalog/:id", productsController.getProductById)

export default router;
