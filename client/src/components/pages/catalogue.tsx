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
                        id={item.id}
                        label={item.title}
                        cost={item.price} 
                        image={item.image_url[0]}
                        onClick={() => setSearchParams(
                            { ...Object.fromEntries(searchParams), id: String(item.id) },
                            { replace: false }
                        )}  
                    />
                ))}
            </div>
            {searchParams.get('id') && <Modal onClose={handleClose} />}
        </div>
    )
}

export default Catalogue;