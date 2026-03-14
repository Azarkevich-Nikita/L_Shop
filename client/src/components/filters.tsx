import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Input from './input';

import '../style/filters.scss'

function Filters() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [manufacturers, setManufacturers] = useState<string[]>([]);

    useEffect(() => {
        fetch('/api/catalog/products/created_from', { credentials: 'include' })
            .then((res) => res.json())
            .then((data: string[]) => setManufacturers(data || []))
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

    const getParam = (name: string) => searchParams.get(name) ?? '';

    return (
        <div className='filters-container'>
            <Input
                name="title"
                placeholder="Название"
                value={getParam('title')}
                onChange={handleChange}
            />

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
                    <option value="">—</option>
                    {manufacturers.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            <span>Цена</span>
            <div className='filter-row'>
                <input
                    type="number"
                    name="min_price"
                    placeholder="От"
                    value={getParam('min_price')}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="max_price"
                    placeholder="До"
                    value={getParam('max_price')}
                    onChange={handleChange}
                />
            </div>

            <span>Дата производства</span>
            <div className='filter-row'>
                <input
                    type="date"
                    name="created_date_from"
                    placeholder="От"
                    value={getParam('created_date_from')}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="created_date_to"
                    placeholder="До"
                    value={getParam('created_date_to')}
                    onChange={handleChange}
                />
            </div>

            <span>Вес на складе (г)</span>
            <div className='filter-row'>
                <input
                    type="number"
                    name="min_weight"
                    placeholder="От"
                    value={getParam('min_weight')}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="max_weight"
                    placeholder="До"
                    value={getParam('max_weight')}
                    onChange={handleChange}
                />
            </div>

            <span>Сортировка</span>
            <div className='filter-row'>
                <select
                    name="sort"
                    value={getParam('sort') || ''}
                    onChange={handleChange}
                >
                    <option value="">—</option>
                    <option value="price">По цене</option>
                    <option value="created_date">По дате производства</option>
                </select>
                <select
                    name="order"
                    value={getParam('order') || 'asc'}
                    onChange={handleChange}
                >
                    <option value="asc">По возрастанию</option>
                    <option value="desc">По убыванию</option>
                </select>
            </div>
        </div>
    );
}

export default Filters;