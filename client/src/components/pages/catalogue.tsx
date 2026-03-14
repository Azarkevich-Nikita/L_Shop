import { useEffect, useState } from 'react';
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

    const handleClose = () => {
        const params = Object.fromEntries(searchParams);
        delete params['id'];
        setSearchParams(params);
    };

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
            try {
                const params = Object.fromEntries(searchParams);
                delete params['id'];

                const response = await fetch(`/api/catalog?${new URLSearchParams(params).toString()}`);
                const data = await response.json();

                setCatalog(data);
            } 
            catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [searchParams]);

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
                        image={item.image_url?.[0] ?? ''}
                        weight={item.weight}
                        onClick={() => setSearchParams(
                            { ...Object.fromEntries(searchParams), id: String(item.id) },
                            { replace: false }
                        )}
                        onAddToCart={handleAddToCart(item)}
                    />
                ))}
            </div>
            {searchParams.get('id') && <Modal onClose={handleClose} />}
        </div>
    )
}

export default Catalogue;