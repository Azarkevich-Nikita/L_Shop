import { useState } from 'react';

import iconCheck from '../assets/icon-check-default.svg';

function Checkbox({ id, onChange, checked, defaultChecked, content, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    const isControlled = checked !== undefined;
    const [isChecked, setIsChecked] = useState(defaultChecked ?? false);

    const currentChecked = isControlled ? checked : isChecked;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled)
            setIsChecked(e.target.checked);

        onChange?.(e);
    }

    return (
        <label htmlFor={id}>
            <div>{content}</div>
            <div>
                {currentChecked && <img src={iconCheck} alt="" />}
            </div>
            <input
                {...props}
                type="checkbox"
                name=""
                id={id}
                onChange={onChange}
            />
        </label>
    );
}

export default Checkbox;