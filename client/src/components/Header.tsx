import { useNavigate, useLocation } from 'react-router-dom';
import Button from "./Button";
import '../style/header.scss';
import ProfilePic from '../assets/icon-profilepic-default.svg';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <div className="header">
      <div className="nav-bar">
        <Button
          variant={isActive('/') ? "primary" : "stroke"}
          size="m"
          onClick={() => navigate('/')}
        >
          Главная
        </Button>
        <Button
          variant={isActive('/catalogue') ? "primary" : "stroke"}
          size="m"
          onClick={() => navigate('/catalogue')}
        >
          Каталог
        </Button>
        <Button
          variant={isActive('/cart') ? "primary" : "stroke"}
          size="m"
          onClick={() => navigate('/cart')}
        >
          Корзина
        </Button>
      </div>
      <div className="nav-bar">
        <Button
          variant="secondary"
          size="m"
          onClick={() => navigate('/profile')}
        >
          Профиль
          <img src={ProfilePic} alt="" />
        </Button>
      </div>
    </div>
  );
}

export default Header;