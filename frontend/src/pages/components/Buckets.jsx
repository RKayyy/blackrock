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
  };

  return (
    <div>
      <h2>Investment Bucket</h2>
      <input
        type="number"
        value={amount}
        onChange={handleChange}
        placeholder="Enter amount to invest"
      />
      <button onClick={calculateInvestments}>Calculate Investments</button>
      <div>
        {suggestions.map((suggestion, index) => (
          <div key={index}>
            <p>{suggestion.symbol}: Invest ${suggestion.amount} at ${suggestion.price}/share</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buckets;
