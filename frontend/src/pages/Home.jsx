import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
//import ProductCart from '../components/ProductCart.jsx'
const Home = () => {
  //const {products}=useAppContext();
  return (
    <div>
    <MainBanner/>
    <Categories/>
    <BestSeller/>
    </div>
  )
}

export default Home