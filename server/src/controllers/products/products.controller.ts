import type { Request, Response } from "express";
//@ts-ignore
import productsService from "../../services/products/products.service.ts";
//@ts-ignore
import type { Product } from "../../types/product.types.js";


class productController{
    async getFullCatalogue(req : Request, res : Response){
        try {
            const {
                title,
                created_from,
                min_price,
                max_price,
                min_weight,
                max_weight,
                is_stock,
                created_date_from,
                created_date_to,
                sort,
                order,
                page,
                limit
            } = req.query;

            const products: Pick<Product, 'id' | 'title' | 'price' | 'image_url' | 'weight'>[] = await productsService.getProducts({
                title: title as string,
                created_from: created_from as string,
                min_price: min_price ? Number(min_price) : undefined,
                max_price: max_price ? Number(max_price) : undefined,
                min_weight: min_weight ? Number(min_weight) : undefined,
                max_weight: max_weight ? Number(max_weight) : undefined,
                is_stock: is_stock === 'true' || is_stock === true ? true : undefined,
                created_date_from: created_date_from as string,
                created_date_to: created_date_to as string,
                sort: sort as 'price' | 'created_date',
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

    async getCreatedFrom(req : Request, res : Response){
        try {
            console.log(1);
            return res.status(200).json(await productsService.getAllCreatedPlace());
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