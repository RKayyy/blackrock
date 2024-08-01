import React, { useState } from 'react';
import axios from 'axios';
const predefinedWeights = {
  AAPL: 0.25,
  RIL: 0.20,
  INFY: 0.15,
  HDB: 0.10,
  IBN: 0.10,
  ACN: 0.10,
  DNN: 0.05,
  FSV: 0.03,
  IFF: 0.01,
  LPG: 0.01
};

const Buckets = () => {
  const [amount, setAmount] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  const fetchStockPrices = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/stockdetails');
      return response.data;
    } catch (error) {
      console.error('Error fetching stock details:', error);
      return {};
    }
  };

  const calculateInvestments = async () => {
    setLoading(true);
    const stocks = await fetchStockPrices();
    let totalWeight = 0;
    let stockInvestments = [];

    Object.keys(predefinedWeights).forEach(stock => {
      if (stocks[stock]) {
        totalWeight += predefinedWeights[stock];
      }
    });

    Object.keys(predefinedWeights).forEach(stock => {
      if (stocks[stock]) {
        const amountToInvest = (amount * predefinedWeights[stock]) / totalWeight;
        stockInvestments.push({
          symbol: stock,
          amount: amountToInvest.toFixed(2),
          price: stocks[stock].price
        });
      }
    });

    setSuggestions(stockInvestments);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center py-10 px-4 bg-gray-400">
      <div className="max-w-3xl w-full bg-gray-100 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Investment Bucket</h2>
        <div className="flex flex-col md:flex-row md:space-x-4 items-center">
          <input
            type="number"
            value={amount}
            onChange={handleChange}
            placeholder="Enter amount to invest"
            className="text-gray-800 w-full md:w-2/3 px-4 py-2 mb-4 md:mb-0 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 tex"
          />
          <button
            onClick={calculateInvestments}
            className="w-full md:w-1/3 px-4 py-2 bg-blue-500 text-black font-semibold rounded-md shadow hover:bg-blue-600 transition duration-300"
          >
            Calculate Investments
          </button>
        </div>
        {loading && <div className="text-center mt-4">Loading...</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition duration-300"
            >
              <h3 className="text-lg font-medium text-gray-700">{suggestion.symbol}</h3>
              <p className="text-gray-600">Invest: ${suggestion.amount}</p>
              <p className="text-gray-600">Price: ${suggestion.price}/share</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Buckets;