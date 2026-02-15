import type { BasketItem } from "./basketItem.types.js";

export interface Basket {
    user_id: number;
    items: BasketItem[];
}
