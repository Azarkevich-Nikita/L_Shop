import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Input from './input';
import '../style/filters.scss'
import type { CreatedFromResponse } from '../types/api';

function Filters() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [manufacturers, setManufacturers] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/catalog/products/created_from', { credentials: 'include' })
            .then((res) => res.json())
            .then((data: CreatedFromResponse) => setManufacturers(data || []))
            .catch(() => {});
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const params = Object.fromEntries(searchParams);
        const name = e.target.name;
        if (e.target.value === '') {
            delete params[name];
        } else {
            params[name] = e.target.value;
        }
        setSearchParams(params);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = Object.fromEntries(searchParams);
        if (!e.target.checked) {
            delete params[e.target.name];
        } else {
            params[e.target.name] = 'true';
        }
        setSearchParams(params);
    };

    /**
     * Reads the current URL parameter value for controlled filter fields.
     *
     * @param name - Query parameter name.
     * @returns Parameter value or an empty string.
     */
    const getParam = (name: string): string => searchParams.get(name) ?? '';

    return (
        <div className='filters-container'>
            <Input name="title" placeholder="Название" onChange={handleChange} />

            <div className='filter-row'>
                <label htmlFor="input-stock">В наличии</label>
                <input
                    type="checkbox"
                    name="is_stock"
                    id="input-stock"
                    checked={searchParams.get('is_stock') === 'true'}
                    onChange={handleCheckboxChange}
                />
            </div>

            <div className='filter-row'>
                <label htmlFor="select-manufacturer">Страна-производитель</label>
                <select
                    name="created_from"
                    id="select-manufacturer"
                    value={getParam('created_from')}
                    onChange={handleChange}
                >
                    <option value="">Все</option>
                    {manufacturers.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            <span>Цена</span>
            <div className='filter-row'>
                <Input type="text" name="min_price" value={getParam('min_price')} placeholder="От" onChange={handleChange} />
                <Input type="text" name="max_price" value={getParam('max_price')} placeholder="До" onChange={handleChange} />
            </div>

            <span>Дата производства</span>
            <div className='filter-row'>
                <Input name="created_date_from" value={getParam('created_date_from')} placeholder="От" onChange={handleChange} />
                <Input name="created_date_to" value={getParam('created_date_to')} placeholder="До" onChange={handleChange} />
            </div>

            <span>Сортировка</span>
            <div className='filter-row'>
                <Input name="min_weight" value={getParam('min_weight')} placeholder="От" onChange={handleChange} />
                <Input name="max_weight" value={getParam('max_weight')} placeholder="До" onChange={handleChange} />
            </div>
        </div>
    );
}

export default Filters;
