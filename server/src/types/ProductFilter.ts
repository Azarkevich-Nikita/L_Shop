interface ProductFilter {
    created_from?: string;
    min_price?: number;
    max_price?: number;
    sort?: 'price' | 'created_at';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}