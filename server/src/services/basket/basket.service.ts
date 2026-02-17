import type { Basket } from "../../types/basket.types.ts";
import type { BasketItem } from "../../types/basketItem.types.ts";


export class BasketService {

    private basketItems: BasketItem = {
        id: 1,
        product_id: 1,
        weight: 150,
        price: 200,
        quantity: 10,
    };

    private basket: Basket = {
        user_id: 1,
        items: [
            this.basketItems,
            this.basketItems
        ],
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
        const price = this.getTotalPrice();
        if(price > 3000 && type === 'courier') {
            this.deliveryPrice = 200;
        }
        else if (price <= 3000 && price > 1000 && type === 'courier') {
            this.deliveryPrice = 100;
        }
        else if (price > 1 && price <= 1000 && type === 'courier') {
            this.deliveryPrice = 50;
        }
        else if (type === 'pickup') {
            this.deliveryPrice = 0;
        }
    }

    getTotalPrice():number {
        const itemsTotal = this.basket.items.reduce(
            (sum,item) => sum + item.price * item.quantity, 2
        )

        return itemsTotal + this.deliveryPrice;
    }


}
export default new BasketService();