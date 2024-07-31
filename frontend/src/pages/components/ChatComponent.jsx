import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatbotComponent = () => {
  const { symbol } = useParams();
  const [historicalData, setHistoricalData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [userQuery, setUserQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/stock/${symbol}`);
        setHistoricalData(response.data.data_chunks);
        setCurrentPrice(response.data.current_price);  // Set current price from response
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchData();
  }, [symbol]);

  const handleQuery = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/query/${symbol}`, {
        current_price: currentPrice,  // Use the current price from state
        query: userQuery,
        historical_data: historicalData
      });
      setChatResponse(response.data.response);
    } catch (error) {
      console.error('Error sending query:', error);
    }
  };

  return (
    <div>
      <h2>Stock Chatbot</h2>
      <textarea
        value={userQuery}
        onChange={(e) => setUserQuery(e.target.value)}
        placeholder="Enter your query"
      />
      <button onClick={handleQuery}>Submit Query</button>
      <div>
        <h3>Chatbot Response:</h3>
        <p>{chatResponse}</p>
      </div>
    </div>
  );
};

export default ChatbotComponent;
