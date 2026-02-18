import { useState } from "react";
import ButtonsPair from './buttonsPair';
import '../style/card.scss';
import iconHeart from '../assets/icon-heart-default.svg';
import iconCart from '../assets/icon-cart-default.svg'

function ItemCard({label, cost, image}) {
  return(
    <div className="card">
      <img className="img"/>
      <div className="text-container">
        <span>{label}</span>
        <span>{cost}</span>
      </div>
      <ButtonsPair 
        label="В корзину"
        firstImg={iconCart}
        secondImg={iconHeart}
      />
    </div>
  )
}

export default ItemCard;
