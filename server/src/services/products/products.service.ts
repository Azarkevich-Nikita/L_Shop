// @ts-ignore
import HashService from "../HashService.ts";
//@ts-ignore
import jsonStorageService from "../JsonStorageService.ts";
import path from "path";
import { fileURLToPath } from "url";
//@ts-ignore
import type { Product } from "../../types/product.types.ts"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, "../../../database/products.json");

class ProductService {
    async getFullCatalogue(): Promise<Pick<Product, 'id' | 'title' | 'price'>[]> {
        const products: Product[] = await jsonStorageService.readJSON(usersPath);

        const productsCards: Pick<Product, 'id' | 'title' | 'price'>[] = products.map(p => p = {
            id: p.id,
            title: p.title,
            price: p.price
        })

        return productsCards;
    }
}

export default new ProductService();
