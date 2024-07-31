import React, { useState, useEffect } from "react";
import PieChart from "./components/PyChart";
import Navbar from "./components/Navbar";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'; // Using Recharts instead
import axios from 'axios';
import ESGBarChart from "./components/ESGcharts";
import SectorDonutChart from "./components/Donut";
import '../styles/Dashboard.css';
import PropTypes from 'prop-types';
import Buckets from "./components/Buckets";

const Dashboard = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [esgData, setEsgData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [expenseData, setExpenseData] = useState([]);
  const [error, setError] = useState(null);
  const userId = "66a91c9d62a6be8083bed17e";
  const [money, setMoney] = useState(0);

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
      <Navbar accountBalance={money} />
      <div className="p-4">
        {error && <div className="error-message">{error}</div>}
        <div className="dashboard-grid">
          <div className="dashboard-item">
            <h1 className="text-2xl font-bold mb-2">Stock Data</h1>
            <PieChart data={pieChartData} outerRadius={250} colors={COLORS} />
          </div>

          <div className="dashboard-item">
            <h2 className="text-xl font-semibold mb-2">ESG Values</h2>
            <ESGBarChart data={esgData} />
          </div>

          <div className="dashboard-item">
            <h2 className="text-xl font-semibold mb-2">Sector Distribution</h2>
            <SectorDonutChart data={sectorData} />
          </div>

          <div className="dashboard-item">
            <h2 className="text-xl font-semibold mb-2">Expense Line Chart</h2>
            <LineChart
              width={500}
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
          </div>

          {userRole === "admin" && (
            <div className="dashboard-item">
              <h2 className="text-xl font-semibold mb-2">Buckets</h2>
              <Buckets />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

Dashboard.propTypes = {
  userId: PropTypes.string.isRequired,
  userRole: PropTypes.string,
};

export default Dashboard;
