import type { Basket } from "../../types/basket.types.js";
import type { BasketItem } from "../../types/basketItem.types.js";


export class BasketService {
    private basket: Basket = {
        user_id:1,
        items:[]
    }

    private deliveryPrice: number = 0;


    getBasket():Basket {
        return this.basket;
    }

    addToBasket(item:BasketItem):void {
        const existingItem = this.basket.items.find(i => i.product_id === item.product_id);

        if(existingItem) {
            existingItem.quantity++;
        }
        else {
            this.basket.items.push({...item, quantity: 1});
        }
    }

    increaseQuantity(productId:number):void {
        const item = this.basket.items.find(i => i.product_id === productId);
        if(item) {
            item.quantity++;
        }
    }

    decreaseQuantity(productId:number):void {
        const item = this.basket.items.find(i => i.product_id === productId);
        if(item && item.quantity > 1) {
            item.quantity--;
        }
    }

    removeItem(productId:number):void {
        this.basket.items = this.basket.items.filter(i => i.product_id !== productId);
    }

    setDelivery(type: 'pickup' | 'courier'):void {
        this.deliveryPrice = type === 'courier' ? 15 : 0;
    }

    getTotalPrice():number {
        const itemsTotal = this.basket.items.reduce(
            (sum,item) => sum + item.price * item.quantity, 2
        )

        return itemsTotal + this.deliveryPrice;
    }


}
export default new BasketService();