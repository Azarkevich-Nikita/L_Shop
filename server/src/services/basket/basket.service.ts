import fs from "fs";
import path from "path";
//@ts-ignore
import JsonStorageService from "../JsonStorageService.ts";
import type { BasketItem } from "../../types/basketItem.types.ts";
import type { Basket } from "../../types/basket.types.ts";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../../../database/basket.json");

export class BasketService {

    private async getData() {
        return await JsonStorageService.readJSON(filePath);
    }

    private async saveData(data: any) {
        await JsonStorageService.writeJSON(filePath, data);
    }

    async getBasket(userId: number) {
        const data = await JsonStorageService.readJSON(filePath);
        return data.find((b: Basket) => b.user_id === userId) || null;
    }

    private getOrCreateBasket(data: any, userId: number) {
        let basket = data.basket.find((b: any) => b.user_id === userId);

        if (!basket) {
            basket = {
                user_id: userId,
                items: [],
                deliveryPrice: 0
            };
            data.basket.push(basket);
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

    async Delivery(userId: number): Promise<void> {
        const basket:Basket = await this.getBasket(userId);
        const items: BasketItem[] = basket.items;

        let sum = this.getTotalPrice(userId);
        const data = this.getBasket(userId);

        JsonStorageService.writeJSON(filePath, data);

    }
}

export default new BasketService();
