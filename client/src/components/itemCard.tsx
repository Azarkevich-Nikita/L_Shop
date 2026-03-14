import { FC } from "react";

import ButtonsPair from './buttonsPair';
import '../style/card.scss';

import iconCart from '../assets/icon-cart-default.svg';
import iconHeart from '../assets/icon-heart-default.svg';

interface ItemCardProps {
  id: number;
  label: string;
  cost: number | string;
  image: string;
  weight?: number;
  onClick?: () => void;
  onAddToCart?: (e: React.MouseEvent) => void;
}

const ItemCard: FC<ItemCardProps> = ({ id, label, cost, image, weight = 0, onClick, onAddToCart }) => {
  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(e);
  };

  return (
    <div className="card" onClick={onClick}>
      <img className="img" src={image} alt={label} />
      <div className="text-container">
        <div className="title">{label}</div>
        <span>{cost} руб.</span>
      </div>
      <ButtonsPair
        firstImg={iconCart}
        secondImg={iconHeart}
        onFirstClick={handleCartClick}
      />
    </div>
  );
};

export default ItemCard;