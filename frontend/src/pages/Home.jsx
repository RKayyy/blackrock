import React from 'react'
import Dashboard from './Dashboard'
import './Background.css';
import Footer from './components/Footer';
import CompanyStocksTable from './CompanyStocksTable';

const Home = () => {
  return (
    <div className='bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white'>
        <Dashboard />
        <h2 className="text-4xl align text-center font-bold text-white mt-10">STOCKS</h2>
        <CompanyStocksTable/>
        <Footer/>
    </div>
  )
}

export default Home