export interface Product {
    id: number,
    title: string,
    price: number,
    created_from: string,
    is_stock: boolean,
    weight: number,
    created_date: string,
    property: string[],
    image_url: string[]
}

export type Products = Product;
