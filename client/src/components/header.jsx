import React from "react";
import Button from "./button";
import '../style/header.scss';
import ProfilePic from '../assets/icon-profilepic-default.svg';

function Header() {
  return (
	<div className="header">
    <div className="nav-bar">
	    <Button variant="primary" size="m">Главная</Button>
	  	<Button variant="stroke" size="m">Каталог</Button>
	  	<Button variant="stroke" size="m">Корзина</Button>
    </div>

    <div className="nav-bar">
      <Button variant="secondary" size="m">
        Профиль
        <img src={ProfilePic} />
      </Button>
    </div>
	</div>); 
}

export default Header;
