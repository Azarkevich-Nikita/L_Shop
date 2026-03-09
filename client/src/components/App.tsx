import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './Header'
import '../style/App.scss'

import Home from './pages/home'
import Catalogue from './pages/catalogue';
import Cart from './pages/cart';
import Profile from './pages/profile';
import Auth from './pages/auth';
import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
import Agreement from './pages/agreement';


function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/auth' ||
    location.pathname === '/login' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/agreement';

  return (
    <>
      {!isAuthPage && <Header />}      

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/catalogue' element={<Catalogue />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/agreement' element={<Agreement />} />
      </Routes>
    </>
  )
}

export default App;
