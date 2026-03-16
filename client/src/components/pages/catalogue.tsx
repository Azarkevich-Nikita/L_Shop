import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Filters from '../filters';
import ItemCard from '../itemCard'
import Modal from '../modalCard'
import '../../style/catalogue.scss'

interface CatalogItem {
    id: number;
    title: string;
    price: number;
    created_from: string;
    is_stock: boolean;
    weight: number;
    created_date: string;
    property: string[];
    image_url: string[];
}

function Catalogue() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [catalog, setCatalog] = useState<CatalogItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const handleClose = () => {
        const params = Object.fromEntries(searchParams);
        delete params['id'];
        setSearchParams(params);
    };

    // При смене фильтров — сбрасываем список и страницу
    useEffect(() => {
        setCatalog([]);
        setPage(1);
        setHasMore(true);
    }, [searchParams]);

    // Загрузка данных при изменении page
    const handleAddToCart = (item: CatalogItem) => async () => {
        try {
            const res = await fetch('/api/basket', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_id: item.id,
                    price: item.price,
                    weight: item.weight ?? 0,
                    quantity: 1,
                }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                alert(data?.error ?? 'Не удалось добавить в корзину');
            }
        } catch {
            alert('Не удалось добавить в корзину');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!hasMore || loading) return;
            setLoading(true);
            try {
                const params = Object.fromEntries(searchParams);
                delete params['id'];
                params['page'] = String(page);

                const response = await fetch(`/api/catalog?${new URLSearchParams(params).toString()}`);
                const data = await response.json();

                if (data.length === 0) {
                    setHasMore(false);
                } else {
                    setCatalog(prev => page === 1 ? data : [...prev, ...data]);
                }
            } 
            catch (err) {
                console.log(err);
            } 
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [page, searchParams]);

    const sentinelCallback = useCallback((node: HTMLDivElement | null) => {
        if (observerRef.current) observerRef.current.disconnect();
        if (!node) return;

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        });
        observerRef.current.observe(node);
    }, [hasMore, loading]);

    return (
        <div className='flex-container'>
            <Filters />
            <div className='cards'>
                {catalog.map((item) => (
                    <ItemCard
                        key={item.id}
                        id={item.id}
                        label={item.title}
                        cost={item.price}
                        image={item.image_url[0]}
                        cost={item.price} 
                        image={item.image_url?.[0] ?? ''}
                        weight={item.weight}
                        onClick={() => setSearchParams(
                            { ...Object.fromEntries(searchParams), id: String(item.id) },
                            { replace: false }
                        )}
                        onAddToCart={handleAddToCart(item)}
                    />
                ))}
                {loading && <div>Загрузка...</div>}
                <div ref={sentinelCallback} />
            </div>
            {searchParams.get('id') && <Modal onClose={handleClose} />}
        </div>
    )
}

export default Catalogue;