import type { Request, Response } from "express";
//@ts-ignore
import productsService from "../../services/products/products.service.ts";
//@ts-ignore
import type { Product } from "../../types/product.types.js";
//@ts-ignore
import type { ProductFilter } from "../../types/ProductFilter.ts";

/**
 * Reads a single string query parameter from Express query values.
 *
 * @param value - Raw query parameter value.
 * @returns String value when present.
 */
const getStringQuery = (value: unknown): string | undefined =>
    typeof value === "string" && value.trim() !== "" ? value : undefined;

/**
 * Converts a query parameter to a number.
 *
 * @param value - Raw query parameter value.
 * @returns Parsed number when the value is numeric.
 */
const getNumberQuery = (value: unknown): number | undefined => {
    const stringValue = getStringQuery(value);
    if (!stringValue) return undefined;

    const numericValue = Number(stringValue);
    return Number.isFinite(numericValue) ? numericValue : undefined;
};

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

            const filter: ProductFilter = {
                page: getNumberQuery(page) ?? 1,
                limit: getNumberQuery(limit) ?? 20
            };

            const titleValue = getStringQuery(title);
            const createdFromValue = getStringQuery(created_from);
            const createdDateFromValue = getStringQuery(created_date_from);
            const createdDateToValue = getStringQuery(created_date_to);
            const sortValue = getStringQuery(sort);
            const orderValue = getStringQuery(order);
            const minPriceValue = getNumberQuery(min_price);
            const maxPriceValue = getNumberQuery(max_price);
            const minWeightValue = getNumberQuery(min_weight);
            const maxWeightValue = getNumberQuery(max_weight);

            if (titleValue) filter.title = titleValue;
            if (createdFromValue) filter.created_from = createdFromValue;
            if (createdDateFromValue) filter.created_date_from = createdDateFromValue;
            if (createdDateToValue) filter.created_date_to = createdDateToValue;
            if (sortValue === "price" || sortValue === "created_date") filter.sort = sortValue;
            if (orderValue === "asc" || orderValue === "desc") filter.order = orderValue;
            if (minPriceValue !== undefined) filter.min_price = minPriceValue;
            if (maxPriceValue !== undefined) filter.max_price = maxPriceValue;
            if (minWeightValue !== undefined) filter.min_weight = minWeightValue;
            if (maxWeightValue !== undefined) filter.max_weight = maxWeightValue;
            if (getStringQuery(is_stock) === "true") filter.is_stock = true;

            const products: Pick<Product, 'id' | 'title' | 'price' | 'image_url' | 'weight'>[] = await productsService.getProducts(filter);

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
            const product: Product | undefined = await productsService.getProductById(req.params.id)

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
