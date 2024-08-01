import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

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

  const speakResponse = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(chatResponse);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech is not supported in this browser.');
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-50 to-gray-100 rounded-lg shadow-2xl border border-gray-300 max-w-4xl mx-auto mt-10">
     
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Stock Chatbot</h2>
      <div className="mb-6">
        <textarea
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Ask me anything about the stock..."
          rows="5"
          className="w-full p-4 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105 text-black" 
        />
      </div>
      <button
        onClick={handleQuery}
        className="w-full bg-blue-600 text-black py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
      >
        Submit Query
      </button>
      <div className="mt-6">

        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Chatbot Response:</h3>
        
        <div className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-700">{chatResponse || 'Awaiting your query...'}</p>
          {chatResponse && (
            <button
              onClick={speakResponse}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faVolumeUp} size="lg" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotComponent;