import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CompanyStockPage = () => {
  const { symbol } = useParams(); // Extract symbol from URL
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState(0);
  const [action, setAction] = useState('buy'); // 'buy' or 'sell'
  const [interval, setInterval] = useState('1mo'); // Default interval

  const userId = '66a91c9d62a6be8083bed17e'; // Replace with actual user ID

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/stock/${symbol}?interval=${interval}`);
        setStockData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching stock data');
        setLoading(false);
      }
    };

    fetchStockData();
  }, [symbol, interval]);

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

  // Prepare data for the graph
  const chartData = stockData.data_chunks.flat().map(point => ({
    date: point.timestamp.split(' ')[0], // Extract date
    close: point.close
  }));

  return (
    <div>
      <h1>Company stocks graph and data</h1>
      <h2>Company Symbol: {stockData.symbol}</h2>
      <h3>Interval: {interval}</h3> {/* Display selected interval */}

      <div>
        {/* Buttons to change the interval */}
        <button onClick={() => setInterval('1mo')}>1 Month</button>
        <button onClick={() => setInterval('3mo')}>3 Months</button>
        <button onClick={() => setInterval('6mo')}>6 Months</button>
        <button onClick={() => setInterval('1y')}>1 Year</button>
        <button onClick={() => setInterval('2y')}>2 Years</button>
        <button onClick={() => setInterval('5y')}>5 Years</button>
        <button onClick={() => setInterval('10y')}>10 Years</button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          cursor="default" // Set cursor to default
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip contentStyle={{ display: 'block' }} /> {/* Show tooltip on hover */}
          <Legend />
          <Line type="monotone" dataKey="close" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

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
