import type { Request, Response } from "express";
// @ts-ignore
import userService from "../../services/users/users.service.ts";
//@ts-ignore
import sessionService from "../../services/sessions.service.ts";
//@ts-ignore
import sessionsService from "../../services/sessions.service.ts";
//@ts-ignore
import productsService from "../../services/products/products.service.ts";
//@ts-ignore
import type {User} from "../models/users.model.ts";
//@ts-ignore
import type {Session} from "../../types/session.types.ts";

//@ts-ignore
import type { Product } from "../../types/product.types.js";

class productController{
    async getFullCatalogue(req : Request, res : Response){
        try {
            if(!req.userId){
                throw Error("No user_id");
            }
            const catalogue: Pick<Product, 'id' | 'title' | 'price'>[] = await productsService.getFullCatalogue();

            res.status(200).json({catalogue});
        }
        catch (error: unknown) {
            if (error instanceof Error) { //Проверим, что бы в объекте ошибки, у нас есть сообщение
                res.status(400).json({error: error.message});
            } else {
                res.status(500).json({error: "Unknown error occurred"});
            }
        }
    }
    
}

export default new productController();