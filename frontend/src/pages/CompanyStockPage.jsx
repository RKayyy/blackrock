import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChatbotComponent from './components/ChatComponent'; // Import the chatbot component
import './CompanyStockPage.css';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

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

  if (loading) return <div className="text-center text-xl font-bold text-gray-600">Loading...</div>;
  if (error) return <div className="text-center text-xl font-bold text-red-600">{error}</div>;

  // Prepare data for the graph
  const chartData = stockData.data_chunks.flat().map(point => ({
    date: point.timestamp.split(' ')[0], // Extract date
    close: point.close
  }));

  return (
    <>
    <Navbar/>
    <div className="p-6 max-w-screen mx-auto rounded-xl shadow-xl border border-gray-300 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-gray-100 mt-20">COMPANY STOCK DATA</h1>
        <h2 className="text-xl text-gray-400 mt-2">Symbol: {stockData.symbol}</h2>
      </header>

      <section className="mb-8">
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button onClick={() => setInterval('1mo')} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">1 Month</button>
          <button onClick={() => setInterval('3mo')} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">3 Months</button>
          <button onClick={() => setInterval('6mo')} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">6 Months</button>
          <button onClick={() => setInterval('1y')} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">1 Year</button>
          <button onClick={() => setInterval('2y')} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">2 Years</button>
          <button onClick={() => setInterval('5y')} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">5 Years</button>
          <button onClick={() => setInterval('10y')} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">10 Years</button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="flex gap-4 mb-4">
            <button onClick={() => setAction('buy')} className={`px-4 py-2 rounded-lg shadow transition ${action === 'buy' ? 'bg-green-500 text-black' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>Buy</button>
            <button onClick={() => setAction('sell')} className={`px-4 py-2 rounded-lg shadow transition ${action === 'sell' ? 'bg-red-500 text-black' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}>Sell</button>
          </div>
          <input
            type="number"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            placeholder="Number of units"
            min="1"
            className="px-4 py-2 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
          />
          <button onClick={handleStockAction} className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition">
            {action === 'buy' ? 'Buy Stocks' : 'Sell Stocks'}
          </button>
        </div>
      </section>

      <section className="mb-8">
        <ResponsiveContainer width="100%" height={400}>
        <LineChart
  data={chartData}
  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
>
  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> 
  <XAxis
    dataKey="date"
    tick={{ fill: '#ffffff' }} 
    label={{ value: 'Date', position: 'insideBottomRight', offset: 0, fill: '#ffffff' }} 
  />
  <YAxis
    tick={{ fill: '#ffffff' }} 
    label={{ value: 'Value', angle: -90, position: 'insideLeft', offset: 10, fill: '#ffffff' }} 
  />
  <Tooltip />
  <Legend
    wrapperStyle={{ color: '#ffffff' }} 
  />
  <Line
    type="monotone"
    dataKey="close"
    stroke="#8884d8" 
  />
</LineChart>

        </ResponsiveContainer>
      </section>

      <ChatbotComponent className="mt-8 mb-16" />
    </div>
      <Footer className='mt-10'/>
      </>
  );
};

export default CompanyStockPage;