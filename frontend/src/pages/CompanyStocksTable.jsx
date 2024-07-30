import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const CompanyStocksTable = () => {
  const [symbol, setSymbol] = useState(''); // State for stock symbol
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleFetchStockData = async () => {
    if (!symbol) {
      alert('Please enter a stock symbol');
      return;
    }

    try {
      const response = await axios.get(`http://127.0.0.1:5000/stock/${symbol}`);
      setStockData(response.data);
      setError(null);

      // Navigate to /companystockspage with the symbol as a URL parameter
      navigate(`/companystockspage/${symbol}`);
    } catch (error) {
      setStockData(null);
      setError('Error fetching stock data');
    }
  };

  return (
    <div>
      <h2>CompanyStocksTable</h2>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock symbol"
      />
      <button onClick={handleFetchStockData}>
        Fetch Stock Data
      </button>
      
      {error && <div>{error}</div>}
      {stockData && (
        <div>
          <h3>Stock Data for {stockData.symbol}</h3>
          {/* Render stock data here as needed */}
        </div>
      )}
    </div>
  );
};

export default CompanyStocksTable;
