import path from "path";
//@ts-ignore
import JsonStorageService from "../JsonStorageService.ts";
import type { BasketItem } from "../../types/basketItem.types.ts";
import type { Basket } from "../../types/basket.types.ts";
import type { Order } from "../../types/orders.types.ts";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../../../database/basket.json");
const newFilePath = path.join(__dirname, "../../../database/delivery.json");
export class BasketService {

    private async getData(): Promise<Basket[]> {
        const data = await JsonStorageService.readJSON<Basket[]>(filePath);
        if (!Array.isArray(data)) {
            return [];
        }
        return data;
    }

    private async saveData(data: Basket[]): Promise<void> {
        await JsonStorageService.writeJSON(filePath, data);
    }

    async clearBasket(userId:number): Promise<void> {
        const data = await this.getData();
        const newData = data.filter((basket: Basket) => basket.user_id !== userId);
        await this.saveData(newData);
    }

    async getBasket(userId: number): Promise<Basket | null> {
        const data = await this.getData();
        return data.find((b: Basket) => b.user_id === userId) || null;
    }

    private getOrCreateBasket(data: Basket[], userId: number): Basket {
        let basket = data.find((b: Basket) => b.user_id === userId);

        if (!basket) {
            basket = {
                user_id: userId,
                items: [],
            };
            data.push(basket);
        }

        return basket;
    }

    async addToBasket(userId: number, item: BasketItem): Promise<void> {
        const data = await this.getData();
        const basket = this.getOrCreateBasket(data, userId);
        const existingItem = basket.items.find(
            (i: BasketItem) => i.product_id === item.product_id
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            basket.items.push(item);
        }

        await this.saveData(data);
    }

    async increaseQuantity(userId: number, productId: number): Promise<void> {
        const baskets: Basket[] = await this.getData();

        baskets.forEach((b: Basket) => {
            if(userId == b.user_id) {
                b.items.map((i:BasketItem) => {
                    if(i.product_id === productId) {
                        i.quantity++;
                    }
                });
            }
        });
        await this.saveData(baskets);
    }

    async decreaseQuantity(userId: number, productId: number): Promise<void> {
        const baskets: Basket[] = await this.getData();

        baskets.forEach((b: Basket) => {
            if(userId == b.user_id) {
                b.items.map((i:BasketItem) => {
                    if(i.product_id === productId) {
                        i.quantity--;
                    }
                });
            }
        });
        await this.saveData(baskets);
    }

    async removeItem(userId: number, productId: number): Promise<void> {
        const data = await this.getData();
        const basket = this.getOrCreateBasket(data, userId);

        basket.items = basket.items.filter(
            (i: BasketItem) => i.product_id !== productId
        );

        await this.saveData(data);
    }

    async setDelivery(userId: number, type: "pickup" | "courier"): Promise<void> {
        const data = await this.getData();
        const basket = this.getOrCreateBasket(data, userId);

        const itemsTotal = basket.items.reduce(
            (sum: number, item: BasketItem) =>
                sum + item.price * item.quantity,
            0
        );

        if (type === "pickup") {
            basket.deliveryPrice = 0;
        } else {
            if (itemsTotal > 3000) basket.deliveryPrice = 200;
            else if (itemsTotal > 1000) basket.deliveryPrice = 100;
            else basket.deliveryPrice = 50;
        }

        await this.saveData(data);
    }

    async getTotalPrice(userId: number): Promise<number> {
        const basket = await this.getBasket(userId);
        if (!basket) {
            return 0;
        }
        const items: BasketItem[] = basket.items;

        let sum = 0;
        items.forEach((i:BasketItem) => {sum += i.quantity * i.price});

        return sum;
    }

    async Buy(
        userId: number,
        {
            address,
            phone,
            email,
            changeFrom,
        }: { address: string; phone: string; email: string; changeFrom: number | null }
    ): Promise<void> {
        const basket = await this.getBasket(userId);

        if (!basket || !basket.items || basket.items.length === 0) {
            throw new Error("Basket is empty");
        }

        const itemsTotal = basket.items.reduce(
            (sum: number, item: BasketItem) => sum + item.price * item.quantity,
            0
        );

        const deliveryPrice = basket.deliveryPrice ?? 0;
        const totalPrice = itemsTotal + deliveryPrice;

        let orders: Order[] | undefined = await JsonStorageService.readJSON(newFilePath);
        if (!Array.isArray(orders)) {
            orders = [];
        }

        const newOrder: Order = {
            user_id: userId,
            order_id: Date.now(),
            price: totalPrice,
            delivery_address: address,
            phone,
            email,
            change_from: changeFrom,
            items: basket.items,
        };

        orders.push(newOrder);

        await JsonStorageService.writeJSON(newFilePath, orders);
        await this.clearBasket(userId);
    }
}

export default new BasketService();
