interface ProductFilter {
    title?: string;
    created_from?: string;
    min_price?: number;
    max_price?: number;
    min_weight?: number;
    max_weight?: number;
    created_date_from?: string;
    created_date_to?: string;
    is_stock?: boolean;
    sort?: 'price' | 'created_date';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}