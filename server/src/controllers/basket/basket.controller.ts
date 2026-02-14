import type { Request, Response } from "express";
// @ts-ignore
import BasketService from "../../services/basket/basket.service.ts";

class basketController{
    async getAll(req : Request, res : Response){
        res.status(200).json(await BasketService.getBasket());
    }
}

export default new basketController();