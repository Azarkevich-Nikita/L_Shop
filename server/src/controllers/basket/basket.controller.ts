import type { Request, Response } from "express";
// @ts-ignore
import BasketService from "../../services/basket/basket.service.ts";

class BasketController {

    async getBasketByUserID(req: Request, res: Response) {
        try{
        const userId = 1771395147647;//TODO
        const basket = await BasketService.getBasket(userId);
        res.status(200).json(basket);
        }
        catch (error: unknown) {
            if (error instanceof Error) { //Проверим, что бы в объекте ошибки, у нас есть сообщение
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: "Unknown error occurred" });
            }
        }
    }

    async getTotalPrice(req: Request, res: Response) {
        const userId = 1;
        const total = await BasketService.getTotalPrice(userId);
        res.status(200).json({ total });
    }

    async setDelivery(req: Request, res: Response) {
        const userId = 1;
        const { type } = req.body;

        await BasketService.setDelivery(userId, type);

        res.status(200).json({ message: "Delivery updated" });
    }

    async addToBasket(req: Request, res: Response) {
        const userId = 1771395147647;//TODO

        await BasketService.addToBasket(userId, req.body);

        res.status(200).json({ message: "Item added" });
    }

    async increaseQuantity(req: Request, res: Response) {
        const userId = 1771395147647;//TODO
        const { productId } = req.body;

        await BasketService.increaseQuantity(userId, productId);

        res.status(200).json({ message: "Quantity increased" });
    }

    async decreaseQuantity(req: Request, res: Response) {
        const userId = 1;
        const { productId } = req.body;

        await BasketService.decreaseQuantity(userId, productId);

        res.status(200).json({ message: "Quantity decreased" });
    }

    async removeItem(req: Request, res: Response) {
        const userId = 1;
        const { productId } = req.body;

        await BasketService.removeItem(userId, productId);

        res.status(200).json({ message: "Item removed" });
    }
}

export default new BasketController();
