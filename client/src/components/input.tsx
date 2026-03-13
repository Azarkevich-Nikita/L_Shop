import { useState } from 'react';

import iconBackspace from '../assets/icon-backspace.svg';
import iconSearch from '../assets/icon-search-defaut.svg';

import '../style/input.scss';


function Input({ id, onChange, ...props }: React.InputHTMLAttributes<HTMLInputElement> ) {
    const [image, setImage] = useState(iconSearch);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);

        e.target.value === ''? setImage(iconSearch) : setImage(iconBackspace);
    }
    
    return (
        <label htmlFor={id} className='wrap'>
            <input { ...props }
                id={id}
                className='input input--stroke'
                onChange={handleChange}
            />
            <img src={image} alt="" />
        </label>
    );
}

export default Input;