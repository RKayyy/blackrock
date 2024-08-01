import React, { useState, useEffect } from "react";
import PieChart from "./components/PyChart";
import Navbar from "./components/Navbar";
// import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'; // Using Recharts instead
import axios from 'axios';
import ESGBarChart from "./components/ESGcharts";
import SectorDonutChart from "./components/Donut";
import '../styles/Dashboard.css';
import PropTypes from 'prop-types';
import Buckets from "./components/Buckets";
import Typing from 'react-typing-effect';
import './Dashboard.css';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';

const Dashboard = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [esgData, setEsgData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [expenseData, setExpenseData] = useState([]);
  const [error, setError] = useState(null);
  const userId = "66a91c9d62a6be8083bed17e";
  const [money, setMoney] = useState(0);

  const handleTypingComplete = () => {
    setCurrentMottoIndex((prevIndex) => (prevIndex + 1) % mottoVariations.length);
  };

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

  // Update the motto index periodically
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

  // Convert expenses data to use day number
  const formatExpenseData = (data) => {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    return sortedData.map((item, index) => ({
      day: index + 1, // Day number
      balance: item.balance // Use the correct field for the value
    }));
  };

  const formattedExpenseData = formatExpenseData(expenseData);

  return (
    <>

      <Navbar accountBalance ={money} />
      <div className="p-4 flex flex-col items-center bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white min-h-screen ">
        {error && <div className="error-message text-red-500 mb-4">{error}</div>}
        <div className="mt-10"></div>
        <div className="flex flex-col lg:flex-row w-full mb-8 mt-20">
          {/* Left Section with Motto */}
          <div className="lg:w-2/4 bg-gray-0 p-5 rounded-lg shadow-lg mb-6 lg:mb-0 ">
            <h1 className="text-5xl font-bold mb-4 text-center text-gray-0 mt-20">
              <Typing
                text={mottoVariations[currentMottoIndex]}
                cursor=" "
                speed={100} // Typing speed
                eraseSpeed={50} // Erase speed
                eraseDelay={1000} // Delay before erasing
                typingDelay={500} // Delay before typing starts
                className="text-6xl font-extrabold text-gray-300" // Larger font for typing effect with light gray color
                onFinishedTyping={handleTypingComplete} // Callback when typing completes
              />
            </h1>
          </div>


          {/* Right Section with Charts arranged in 2x2 grid */}
          <div className="lg:w-3/4 lg:ml-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Row: Pie Chart and Line Chart */}
            <div className="bg-gray-700 rounded-lg shadow-lg flex flex-col items-center justify-center h-64">
              <h2 className="text-lg font-bold z-1 text-center">Stock Data</h2>
              <PieChart
                data={pieChartData}
                outerRadius={70} // Smaller size for the pie chart
                colors={['#ff6361', '#bc5090', '#ffa600']}
              // className="mt-1"
              />
            </div>


            <div className="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-64 w-full overflow-hidden">
  <LineChart className="transform-scale-50"
    width={400} // Reduced width
    height={300} // Reduced height
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
</div>





            {/* Second Row: ESG Bar Chart and Sector Donut Chart */}
            <div className="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-64">
              <h2 className="text-lg font-bold mb-2 text-center">ESG Values</h2>
              <ESGBarChart data={esgData} height={50} width={100} /> {/* Reduced height and set width */}

            </div>

            <div className="bg-gray-700 p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-64">
              {/* <h2 className="text-lg font-bold text-center mt-10 ">Sector Distribution</h2> */}
              <div className="mt-10"></div>
              <SectorDonutChart data={sectorData} /> {/* Smaller size */}
            </div>
          </div>
        </div>
        {/* Buckets Section */}
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