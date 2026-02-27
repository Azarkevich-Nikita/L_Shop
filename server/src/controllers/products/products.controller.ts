import type { Request, Response } from "express";
//@ts-ignore
import productsService from "../../services/products/products.service.ts";
//@ts-ignore
import type { Product } from "../../types/product.types.js";


class productController{
    async getFullCatalogue(req : Request, res : Response){
        try {
            if(!req.userId){
                throw Error("No user_id");
            }
            const catalog: Pick<Product, 'id' | 'title' | 'price'>[] = await productsService.getFullCatalog();

            res.status(200).json({catalog});
        }
        catch (error: unknown) {
            if (error instanceof Error) { //Проверим, что бы в объекте ошибки, у нас есть сообщение
                res.status(400).json({error: error.message});
            } else {
                res.status(500).json({error: "Unknown error occurred"});
            }
        }
    }

    async getProductById(req : Request, res : Response){
        try{
            if(!req.params.id){
                throw Error("No id");
            }

            const product: Product = await productsService.getProductById(req.params.id)

            return product != null ? res.status(200).json({product}) : res.status(500).json({error: "Unknown error occurred"});
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