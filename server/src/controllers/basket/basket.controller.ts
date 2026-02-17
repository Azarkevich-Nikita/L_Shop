import type { Request, Response } from "express";
// @ts-ignore
import BasketService from "../../services/basket/basket.service.ts";

class basketController{
    async getAll(req : Request, res : Response){
        res.status(200).json(await BasketService.getBasket());
    }
    async getTotalPrice(req : Request, res : Response){
        res.status(200).json(await BasketService.getTotalPrice());
    }
    async setDelivery(req : Request, res : Response){
        const {type} = req.body;
        BasketService.setDelivery(type);
        res.status(200).json({message:"Delivery updated"});
    }
    async addToBasket(req : Request, res : Response){
        BasketService.addToBasket(req.body);
        res.status(200).json({message:"Item added"});
    }
    async increaseQuantity(req : Request, res : Response){
        const { productId } = req.body;
        BasketService.increaseQuantity(productId);
        res.status(200).json({message:"Quantity increased"});
    }
    async decreaseQuantity(req : Request, res : Response){
        const { productId } = req.body;
        BasketService.decreaseQuantity(productId);
        res.status(200).json({message:"Quantity decreased"});
    }
    async removeItem(req : Request, res : Response){
        const {productId} = req.body;
        BasketService.removeItem(productId);
        res.status(200).json({message:"Item removed"});
    }
}

export default new basketController();