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
        res.status(200).json(await BasketService.setDelivery('courier'));
    }
}

export default new basketController();