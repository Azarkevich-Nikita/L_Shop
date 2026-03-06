import { useEffect, useState } from 'react';

import ItemCard from '../itemCard'
import '../../style/catalogue.scss'

function Catalogue() {
    const [catalog, setCatalog] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/catalog')
                const data = await response.json();

                setCatalog(data);
                console.log(data);


            }
            catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, []);
    return (
        <div className='cards'>
            {catalog.map((item) => (
                <ItemCard label={item.title} cost={item.price} image={item.image_url[0]}/>
            ))}
        </div>
    )
}

export default Catalogue;