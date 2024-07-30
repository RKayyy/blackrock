import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CompanyStockPage = () => {
  const { symbol } = useParams(); 
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState(0);
  const [action, setAction] = useState('buy'); // 'buy' or 'sell'

  const userId = '66a91c9d62a6be8083bed17e'; // Replace with actual user ID

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/stock/${symbol}`);
        setStockData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching stock data');
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  const handleStockAction = async () => {
    try {
      const endpoint = action === 'buy' ? '/buy' : '/sell';
      const response = await axios.post(`http://127.0.0.1:5000${endpoint}`, {
        user_id: userId,
        symbol: stockData.symbol,
        units: parseInt(units, 10),  // Ensure units is an integer
      });
      console.log(`Response: ${response.data}`);  // Log the response
      alert(`${action === 'buy' ? 'Bought' : 'Sold'} stocks successfully!`);
    } catch (error) {
      console.error('Error performing stock action:', error.response.data);  // Log the error response
      alert('Error performing stock action');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Company stocks graph and data</h1>
      <h2>Company Symbol: {stockData.symbol}</h2>
      <button onClick={() => setAction('buy')}>Buy</button>
      <button onClick={() => setAction('sell')}>Sell</button>
      <input
        type="number"
        value={units}
        onChange={(e) => setUnits(e.target.value)}
        placeholder="Number of units"
        min="1"  // Ensure that only positive numbers can be entered
      />
      <button onClick={handleStockAction}>
        {action === 'buy' ? 'Buy Stocks' : 'Sell Stocks'}
      </button>
    </div>
  );
};

export default CompanyStockPage;
