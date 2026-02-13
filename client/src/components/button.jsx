import React, { useState, useLayoutEffect } from 'react';
import clsx from 'clsx';
import '../style/button.scss';

function Button({ variant = 'primary', size = 'l', className, children }){
  const [ripples, setRipples] = useState([]);

  const removeRipple = (key) => {
    setRipples((prev) => prev.filter((ripple) => ripple.key !== key));
  };

  const addRipple = (event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    const newRipple = {
      key: Date.now(),
      size: diameter,
      x: event.clientX - rect.left - radius,
      y: event.clientY - rect.top - radius
    };

    setRipples((prev) => [...prev, newRipple]);
  };

  return (
    <button 
      className={clsx('btn', `btn--${variant}`, `btn--${size}`, className)}
      onClick={addRipple} >

      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="ripple"
          onAnimationEnd={() => removeRipple(ripple.key)}
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y
          }}
        />
      ))}
      <span className='btn__content'>{children}</span>

    </button>
  );
}

export default Button;
