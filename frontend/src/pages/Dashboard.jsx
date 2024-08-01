import React, { useState, useEffect } from "react";
import axios from 'axios';
import PieChart from "./components/PyChart";
import Navbar from "./components/Navbar";
import ESGBarChart from "./components/ESGcharts";
import SectorDonutChart from "./components/Donut";
import Buckets from "./components/Buckets";
import Typing from 'react-typing-effect';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import '../styles/Dashboard.css';
import './Dashboard.css';

const Dashboard = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [esgData, setEsgData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [expenseData, setExpenseData] = useState([]);
  const [error, setError] = useState(null);
  const [money, setMoney] = useState(0);
  const userId = "66a91c9d62a6be8083bed17e";

  const mottoVariations = [
    "We prioritize our clients' financial success.",
    "Our passion drives performance and financial growth.",
    "We take pride in emotional ownership of your financial future.",
    "Integrity and finance expertise guide our client relations.",
    "Empowering clients through personalized financial solutions.",
    "We deliver performance with passion and precision.",
    "Your financial goals are our mission."
  ];

  const [currentMottoIndex, setCurrentMottoIndex] = useState(
    Math.floor(Math.random() * mottoVariations.length)
  );

  const handleTypingComplete = () => {
    setCurrentMottoIndex((prevIndex) => (prevIndex + 1) % mottoVariations.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userStocksResponse, stockDetailsResponse, expenseResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/stocks/${userId}`),
          axios.get('http://127.0.0.1:5000/stockdetails'),
          axios.get(`http://127.0.0.1:5000/expenses/${userId}`)
        ]);

        const userStocks = userStocksResponse.data;
        const stockDetails = stockDetailsResponse.data;
        const expenses = expenseResponse.data;

        const stockPromises = userStocks.map(stock =>
          axios.get(`http://127.0.0.1:5000/stock/${stock.symbol}`)
        );
        const stockResponses = await Promise.all(stockPromises);

        const totalValue = userStocks.reduce((sum, stock, index) => {
          const price = stockResponses[index].data.data_chunks[0].slice(-1)[0].close;
          return sum + price * stock.units;
        }, 0);

        const formattedData = userStocks.map((stock, index) => {
          const price = stockResponses[index].data.data_chunks[0].slice(-1)[0].close;
          const value = price * stock.units;
          return {
            name: stock.symbol,
            students: (value / totalValue) * 100
          };
        });

        const esgData = userStocks.map(stock => ({
          symbol: stock.symbol,
          type: stockDetails[stock.symbol]?.type || 'Unknown',
          esgValue: stockDetails[stock.symbol]?.ESG_value || 0
        }));

        const sectorMap = esgData.reduce((acc, stock) => {
          acc[stock.type] = (acc[stock.type] || 0) + stock.esgValue;
          return acc;
        }, {});

        const sectorData = Object.entries(sectorMap).map(([sector, value]) => ({
          sector,
          value
        }));

        setPieChartData(formattedData);
        setEsgData(esgData);
        setSectorData(sectorData);
        setExpenseData(expenses);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/user/${userId}`);
        setUserRole(response.data.role);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to fetch user details. Please try again later.');
      }
    };

    fetchData();
    fetchUserDetails();
  }, [userId]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const formatExpenseData = (data) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    return sortedData.map((item, index) => ({
      day: index + 1,
      balance: item.balance
    }));
  };

  const formattedExpenseData = formatExpenseData(expenseData);

  return (
    <>
      <Navbar accountBalance={money} />
      <div className="p-4 flex flex-col items-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white min-h-screen ">
        {error && <div className="error-message text-red-500 mb-4">{error}</div>}
        <div className="mt-10"></div>
        <div className="flex flex-col lg:flex-row w-full mb-8 mt-20">
          <div className="lg:w-2/4 bg-gray-0 p-5 rounded-lg shadow-lg mb-6 lg:mb-0 ">
            <h1 className="text-5xl font-bold mb-4 text-center text-gray-0 mt-20">
              <Typing
                text={mottoVariations[currentMottoIndex]}
                cursor=" "
                speed={100}
                eraseSpeed={50}
                eraseDelay={1000}
                typingDelay={500}
                className="text-6xl font-extrabold text-gray-300"
                onFinishedTyping={handleTypingComplete}
              />
            </h1>
          </div>

          <div className="lg:w-3/4 lg:ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg shadow-lg flex flex-col items-center justify-center h-64">
              <h2 className="text-lg font-bold z-1 text-center">Stock Data</h2>
              <PieChart
                data={pieChartData}
                outerRadius={70}
                colors={['#ff6361', '#bc5090', '#ffa600']}
              />
            </div>

            <div className="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-64 w-full overflow-hidden">
              <ResponsiveContainer>
                <LineChart
                  width={400}
                  height={300}
                  data={formattedExpenseData}
                  margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-64">
              <h2 className="text-lg font-bold mb-2 text-center">ESG Values</h2>
              <ESGBarChart data={esgData} height={50} width={100} />
            </div>

            <div className="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-64">
              <div className="mt-10"></div>
              <SectorDonutChart data={sectorData} />
            </div>
          </div>
        </div>
        
        {userRole === "admin" && (
          <div className="mt-6 w-full bg-gray-700 p-6 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center text-white">BUCKETS</h2>
            <Buckets />
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
