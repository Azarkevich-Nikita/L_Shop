import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Input from './input';

import '../style/filters.scss'


function Filters() {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = Object.fromEntries(searchParams);
        if (e.target.value === '') 
            delete params[e.target.name];
        else params[e.target.name] = e.target.value;

        setSearchParams(params);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const params = Object.fromEntries(searchParams);
        if (!e.target.checked) 
            delete params[e.target.name];
        else params[e.target.name] = 'true';

        setSearchParams(params);
    }

    return(
        <div className='filters-container'>
            <Input />
            <input type="text" name="title" placeholder="Название" onChange={handleChange} />

            <div className='filter-row'>
                <label htmlFor="input-stock">В наличии</label>
                <input type="checkbox" name="is_stock" id="input-stock" onChange={handleCheckboxChange}/>
            </div>

            <div className='filter-row'>
                <label htmlFor="select-manufacturer">Страна-производитель</label>
                <select name="manufacturer" id="select-manufacturer"></select>
            </div>

            <span>Цена</span>
            <div className='filter-row'>
                <input type="number" name="min_price" placeholder='От' onChange={handleChange} />
                <input type="number" name="max_price" placeholder='До' onChange={handleChange} />
            </div>

            <span>Дата производства</span>
            <div className='filter-row'>
                <input type="text" name="created-from" placeholder='От' onChange={handleChange} />
                <input type="text" name="created-to" placeholder='До' onChange={handleChange} />
            </div>

            <span>Вес на складе</span>
            <div className='filter-row'>
                <input type="text" name="weight-from" placeholder='От' onChange={handleChange}/>
                <input type="text" name="weight-to" placeholder='До' onChange={handleChange}/>
            </div>
        </div>
    );
}

export default Filters;