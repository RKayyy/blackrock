import React, { useState, useEffect } from "react";
import PieChart from "./components/PyChart";
import Navbar from "./components/Navbar";
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import ESGBarChart from "./components/ESGcharts"; // Import the ESG Bar Chart component
import SectorDonutChart from "./components/Donut"; // Import the Sector Donut Chart component
import '../styles/Dashboard.css'; // Import the CSS file
import PropTypes from 'prop-types';
import Buckets from "./components/Buckets";

const Dashboard = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [esgData, setEsgData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null); // State for error handling
  const userId = "66a91c9d62a6be8083bed17e"; // Replace with actual user ID

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const [userStocksResponse, stockDetailsResponse] = await Promise.all([
          axios.get(`http://127.0.0.1:5000/stocks/${userId}`),
          axios.get('http://127.0.0.1:5000/stockdetails')
        ]);

        const userStocks = userStocksResponse.data;
        const stockDetails = stockDetailsResponse.data;

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
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setError('Failed to fetch stock data. Please try again later.');
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

    fetchStockData();
    fetchUserDetails();
  }, [userId]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      <Navbar />
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
            <h2 className="text-xl font-semibold mb-2">Line Chart</h2>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              height={300}
              margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
              grid={{ vertical: true, horizontal: true }}
            />
          </div>

          {userRole === "admin" && (
            <div className="dashboard-item">
              <h2 className="text-xl font-semibold mb-2">Buckets</h2>
              <Buckets /> {/* Conditionally render the Buckets component */}
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
