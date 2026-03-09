// @ts-ignore
import HashService from "../HashService.ts";
//@ts-ignore
import jsonStorageService from "../JsonStorageService.ts";
import path from "path";
import {fileURLToPath} from "url";
//@ts-ignore
import type {Product} from "../../types/product.types.ts";
//@ts-ignore
import type {ProductFilter} from "../../types/ProductFilter.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsPath = path.join(__dirname, "../../../database/products.json");

class ProductService {
    async getProducts(filter: ProductFilter): Promise<Pick<Product, 'id' | 'title' | 'price' | 'image_url'>[]> {
        let products: Product[] = await jsonStorageService.readJSON(productsPath);

        if (filter.created_from) {
            products = products.filter(p =>
                p.created_from === filter.created_from
            );
        }

        if (filter.min_price !== undefined) {
            products = products.filter(p =>
                p.price >= filter.min_price!
            );
        }

        if (filter.max_price !== undefined) {
            products = products.filter(p =>
                p.price <= filter.max_price!
            );
        }

        if (filter.sort) {
            products.sort((a, b) => {
                const field = filter.sort!;
                const order = filter.order === 'desc' ? -1 : 1;

                if (a[field] < b[field]) return -1 * order;
                if (a[field] > b[field]) return 1 * order;
                return 0;
            });
        }

        const page = filter.page || 1;
        const limit = filter.limit || 24;
        const start = (page - 1) * limit;
        const end = start + limit;

        const paginated = products.slice(start, end);
        
        return paginated.map(p => ({
            id: p.id,
            title: p.title,
            price: p.price,
            image_url: p.image_url
        }));
    }

    async getProductById(id: string | string[]): Promise<Product> {
        const products: Product[] = await jsonStorageService.readJSON(productsPath);

        return products.find((prod: Product) => prod.id == id);
    }

    async getAllCreatedPlace(){
        const products: Product[] = await jsonStorageService.readJSON(productsPath);

        console.log(new Set<string>(products.map(p => p.created_from)))

        return Array.from(new Set<string>(products.map(p => p.created_from)));
    }
}

export default new ProductService();
