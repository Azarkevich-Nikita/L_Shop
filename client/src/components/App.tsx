import { useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Header from './Header'
import '../style/App.scss'

import Home from './pages/home'
import Catalogue from './pages/catalogue';
import Cart from './pages/cart';
import Profile from './pages/profile';
import Auth from './pages/auth';
import Login from './pages/login';


function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/login';

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
      </Routes>
    </>
  )
}

export default App;
