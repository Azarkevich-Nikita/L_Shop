import { useState } from 'react';
import clsx from 'clsx';
import '../style/button.scss';

export type ButtonVariant = 'primary' | 'secondary' | 'stroke';
export type ButtonSize = 's' | 'm' | 'l';

interface Ripple {
  key: number;
  size: number;
  x: number;
  y: number;
}

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

function Button({ variant = 'primary', size = 'l', className, children, onClick, type = 'button', disabled }: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(event);
    if (onClick) onClick(event);
  };

  /**
   * Removes the completed ripple animation from local button state.
   *
   * @param key - Ripple identifier generated when the button was clicked.
   */
  const removeRipple = (key: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.key !== key));
  };

  /**
   * Calculates ripple geometry relative to the clicked button.
   *
   * @param event - Mouse click event from the button.
   */
  const addRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const newRipple: Ripple = {
      key: Date.now(),
      size: diameter,
      x: event.clientX - rect.left - radius,
      y: event.clientY - rect.top - radius,
    };

    setRipples((prev) => [...prev, newRipple]);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx('btn', `btn--${variant}`, `btn--${size}`, className)}
      onClick={handleClick}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="ripple"
          onAnimationEnd={() => removeRipple(ripple.key)}
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}
      <span className="btn__content">{children}</span>
    </button>
  );
}

export default Button;
