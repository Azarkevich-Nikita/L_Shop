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

    private async getData() {
        return await JsonStorageService.readJSON(filePath);
    }

    private async saveData(data:Basket) {
        await JsonStorageService.writeJSON(filePath, data);
    }

    async clearBasket(userId:number) {
        const data = await this.getData();
        const newData = data.filter((basket: any) => basket.user_id !== userId);
        await this.saveData(newData);
    }

    async getBasket(userId: number) {
        const data = await JsonStorageService.readJSON(filePath);
        return data.find((b: Basket) => b.user_id === userId) || null;
    }

    private getOrCreateBasket(data: any[], userId: number) {
        let basket = data.find((b: any) => b.user_id === userId);

        if (!basket) {
            basket = {
                user_id: userId,
                items: [],
            };
            data.push(basket);
        }

        return basket;
    }

    async addToBasket(userId: number, item: BasketItem) {
        const data = await this.getData();
        const basket = this.getOrCreateBasket(data, userId);
        const existingItem = basket.items.find(
            (i: any) => i.product_id === item.product_id
        );

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            basket.items.push(item);
        }

        await this.saveData(data);
    }

    async increaseQuantity(userId: number, productId: number) {
        const basket:Basket[] = await JsonStorageService.readJSON(filePath);

        basket.forEach((b: Basket) => {
            if(userId == b.user_id) {
                b.items.map((i:BasketItem) => {
                    if(i.product_id === productId) {
                        i.quantity++;
                    }
                });
            }
        })
        await JsonStorageService.writeJSON(filePath, basket);
    }

    async decreaseQuantity(userId: number, productId: number) {
        const basket:Basket[] = await JsonStorageService.readJSON(filePath);

        basket.forEach((b: Basket) => {
            if(userId == b.user_id) {
                b.items.map((i:BasketItem) => {
                    if(i.product_id === productId) {
                        i.quantity--;
                    }
                });
            }
        })
        await JsonStorageService.writeJSON(filePath, basket);
    }

    async removeItem(userId: number, productId: number) {
        const data = await this.getData();
        const basket = this.getOrCreateBasket(data, userId);

        basket.items = basket.items.filter(
            (i: any) => i.product_id !== productId
        );

        await this.saveData(data);
    }

    async setDelivery(userId: number, type: "pickup" | "courier") {
        const data = await this.getData();
        const basket = this.getOrCreateBasket(data, userId);

        const itemsTotal = basket.items.reduce(
            (sum: number, item: any) =>
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
        const basket:Basket = await this.getBasket(userId);
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
    ) {
        const basket = await this.getBasket(userId);

        if (!basket || !basket.items || basket.items.length === 0) {
            throw new Error("Basket is empty");
        }

        const itemsTotal = basket.items.reduce(
            (sum: number, item: BasketItem) => sum + item.price * item.quantity,
            0
        );

        const deliveryPrice = (basket as any).deliveryPrice ?? 0;
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
