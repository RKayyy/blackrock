import React from 'react'
import CompanyStocksTable from './CompanyStocksTable'
import Dashboard from './Dashboard'
import './Background.css';
import Footer from './components/footer';

const Home = () => {
  return (
    <div>
        <Dashboard />
        <CompanyStocksTable />
        <Footer/>
    </div>
  )
}

export default Home