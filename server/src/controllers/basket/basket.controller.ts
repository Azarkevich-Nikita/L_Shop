import {request, type Request, type Response} from "express";
// @ts-ignore
import BasketService from "../../services/basket/basket.service.ts";

class BasketController {

    async getBasketByUserID(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if(!userId) throw Error("User not found");
            const basket = await BasketService.getBasket(userId);
            res.status(200).json(basket);
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async getTotalPrice(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if(!userId) throw Error("User not found");
            const total = await BasketService.getTotalPrice(userId);
            res.status(200).json({ total });
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async setDelivery(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if(!userId) throw Error("User not found");
            const { type } = req.body;

            await BasketService.setDelivery(userId, type);

            res.status(200).json({ message: "Delivery updated" });
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async addToBasket(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if(!userId) throw Error("User not found");

            await BasketService.addToBasket(userId, req.body);

            res.status(200).json({ message: "Item added" });
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async increaseQuantity(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if(!userId) throw Error("User not found");
            const { productId } = req.body;

            await BasketService.increaseQuantity(userId, productId);

            res.status(200).json({ message: "Quantity increased" });
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async decreaseQuantity(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if(!userId) throw Error("User not found");
            const { productId } = req.body;

            await BasketService.decreaseQuantity(userId, productId);

            res.status(200).json({ message: "Quantity decreased" });
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async removeItem(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if(!userId) throw Error("User not found");
            const { productId } = req.body;

            await BasketService.removeItem(userId, productId);

            res.status(200).json({ message: "Item removed" });
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async Delivery(req: Request, res: Response) {
        try {
            const userId = req.userId;
            if(!userId) throw Error("User not found");

            await BasketService.Delivery(userId);

            res.status(200).json({ message: "Delivery!" });
        }
        catch (error: unknown) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
            else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }
}

export default new BasketController();
