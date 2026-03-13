import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Filters from '../filters';
import ItemCard from '../itemCard'

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
    const [searchParams] = useSearchParams();
    const [catalog, setCatalog] = useState<CatalogItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/catalog?${searchParams.toString()}`);
                const data = await response.json();

                setCatalog(data);
                console.log(data);


            }
            catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, [searchParams]);
    return (
        <div className='flex-container'>
            <Filters />
            <div className='cards'>
                {catalog.map((item) => (
                    <ItemCard key={item.id} label={item.title} cost={item.price} image={item.image_url[0]}/>
                ))}
            </div>
        </div>
    )
}

export default Catalogue;