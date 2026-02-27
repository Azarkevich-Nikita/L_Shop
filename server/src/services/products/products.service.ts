// @ts-ignore
import HashService from "../HashService.ts";
//@ts-ignore
import jsonStorageService from "../JsonStorageService.ts";
import path from "path";
import { fileURLToPath } from "url";
//@ts-ignore
import type { Product } from "../../types/product.types.ts"
import type {User} from "../../types/user.types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const usersPath = path.join(__dirname, "../../../database/products.json");

class ProductService {
    async getFullCatalog(): Promise<Pick<Product, 'id' | 'title' | 'price'>[]> {
        const products: Product[] = await jsonStorageService.readJSON(usersPath);

        const productsCards: Pick<Product, 'id' | 'title' | 'price'>[] = products.map(p => p = {
            id: p.id,
            title: p.title,
            price: p.price
        })

        return productsCards;
    }

    async getProductById(id: string | string[]): Promise<Product> {
        const products: Product[] = await jsonStorageService.readJSON(usersPath);

        return products.find((prod: Product) => prod.id == id);
    }
}

export default new ProductService();
