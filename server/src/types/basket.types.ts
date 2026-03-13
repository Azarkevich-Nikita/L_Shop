import type { BasketItem } from "./basketItem.types.ts";

export interface Basket {
    user_id: number;
    items: BasketItem[];
    deliveryPrice?: number;
}
