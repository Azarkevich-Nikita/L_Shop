import type { Request, Response } from "express";
//@ts-ignore
import productsService from "../../services/products/products.service.ts";
//@ts-ignore
import type { Product } from "../../types/product.types.js";


class productController{
    async getFullCatalogue(req : Request, res : Response){
        try {
            const {
                created_from,
                min_price,
                max_price,
                sort,
                order,
                page,
                limit
            } = req.query;

            const products: Pick<Product, 'id' | 'title' | 'price' | 'image_url'>[] = await productsService.getProducts({
                created_from: created_from as string,
                min_price: min_price ? Number(min_price) : undefined,
                max_price: max_price ? Number(max_price) : undefined,
                sort: sort as 'price' | 'created_at',
                order: order as 'asc' | 'desc',
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 20
            });

            res.status(200).json(products);
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

            return product != null ? res.status(200).json(product) : res.status(500).json({error: "Unknown error occurred"});
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