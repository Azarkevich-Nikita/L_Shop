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
            <Input name="title" placeholder="Название" onChange={handleChange} />

            <div className='filter-row'>
                <label htmlFor="input-stock">В наличии</label>
                <input type="checkbox" name="is_stock" id="input-stock" onChange={handleCheckboxChange} />
            </div>

            <div className='filter-row'>
                <label htmlFor="select-manufacturer">Страна-производитель</label>
                <select name="created_from" id="select-manufacturer" onChange={handleSelectChange}>
                    <option value="">Все</option>
                    {manufacturers.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>
            </div>

            <span>Цена</span>
            <div className='filter-row'>
                <Input type="text" name="min_price" placeholder="От" onChange={handleChange} />
                <Input type="text" name="max_price" placeholder="До" onChange={handleChange} />
            </div>

            <span>Дата производства</span>
            <div className='filter-row'>
                <Input name="created-from" placeholder="От" onChange={handleChange} />
                <Input name="created-to" placeholder="До" onChange={handleChange} />
            </div>

            <span>Сортировка</span>
            <div className='filter-row'>
                <Input name="weight-from" placeholder="От" onChange={handleChange} />
                <Input name="weight-to" placeholder="До" onChange={handleChange} />
            </div>
        </div>
    );
}

export default Filters;