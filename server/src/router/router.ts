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

router.get("/basket",authMiddleware, basketController.getBasketByUserID);
router.get("/basket/price",authMiddleware, basketController.getTotalPrice);

router.post("/basket",authMiddleware, basketController.addToBasket);
router.patch("/basket/increase",authMiddleware, basketController.increaseQuantity);
router.patch("/basket/decrease",authMiddleware, basketController.decreaseQuantity);
router.delete("/basket",authMiddleware, basketController.removeItem);

router.post("/basket/delivery",authMiddleware, basketController.setDelivery);

router.get("/users", userController.getAll)
router.post("/auth/register", userController.register)
router.post("/auth/login", userController.login)
router.post("/auth/password-reset/request", userController.requestPasswordReset)
router.post("/auth/password-reset/confirm", userController.confirmPasswordReset)
router.get("/auth/me", authMiddleware, userController.me)
router.patch("/auth/me", authMiddleware, userController.updateMe)
router.post("/auth/logout", authMiddleware, userController.logout)

router.get("/catalog", productsController.getFullCatalogue)
router.get("/catalog/:id", productsController.getProductById)
router.get("/catalog/products/created_from", productsController.getCreatedFrom)

export default router;
