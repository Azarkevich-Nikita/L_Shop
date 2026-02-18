import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom';
import Header from './Header'
import '../style/App.scss'

import Home from './pages/home'
import Catalogue from './pages/catalogue';
import Cart from './pages/cart';
import Profile from './pages/profile';


function App() {

  return (
    <>
      <Header />      

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/catalogue' element={<Catalogue />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </>
  )
}

export default App;
