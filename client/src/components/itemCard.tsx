import { FC } from "react";

import ButtonsPair from './buttonsPair';
import '../style/card.scss';

import iconCart from '../assets/icon-cart-default.svg';
import iconHeart from '../assets/icon-heart-default.svg';

interface ItemCardProps {
  key: number;
  label: string;
  cost: number | string;
  image: string;
}

const ItemCard: FC<ItemCardProps> = ({ key, label, cost, image }) => {
  return (
    <div className="card">
      <img className="img" src={image} alt={label} />
      <div className="text-container">
        <div className="title">{label}</div>
        <span>{cost} руб.</span>
      </div>
      <ButtonsPair
        firstImg={iconCart}
        secondImg={iconHeart}
      />
    </div>
  );
};

export default ItemCard;