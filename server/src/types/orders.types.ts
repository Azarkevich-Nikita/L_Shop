import type { BasketItem } from "./basketItem.types.ts";

export interface Order {
    user_id: number;
    order_id: number;
    price: number;
    delivery_address: string;
    items : BasketItem[];
}