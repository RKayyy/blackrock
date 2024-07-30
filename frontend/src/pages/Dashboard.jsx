import React, { useState, useEffect } from "react";
import PieChart from "./components/PyChart";
import Navbar from "./components/Navbar";
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import ESGBarChart from "./components/ESGcharts"; // Import the ESG Bar Chart component
import SectorDonutChart from "./components/Donut"; // Import the Sector Donut Chart component
import '../styles/Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const [esgData, setEsgData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const userId = "66a91c9d62a6be8083bed17e"; // Replace with actual user ID

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Fetch stocks for the user
        const response = await axios.get(`http://127.0.0.1:5000/stocks/${userId}`);
        const userStocks = response.data;

        // Fetch stock details for ESG values
        const stockDetailsResponse = await axios.get('http://127.0.0.1:5000/stockdetails');
        const stockDetails = stockDetailsResponse.data;

        // Fetch stock prices and calculate values
        const stockPromises = userStocks.map(stock =>
          axios.get(`http://127.0.0.1:5000/stock/${stock.symbol}`)
        );

        const stockResponses = await Promise.all(stockPromises);

        // Calculate total value of stocks
        const totalValue = userStocks.reduce((sum, stock, index) => {
          const price = stockResponses[index].data.data_chunks[0].slice(-1)[0].close; // Use the last data point for price
          return sum + price * stock.units;
        }, 0);

        // Map data to required format
        const formattedData = userStocks.map((stock, index) => {
          const price = stockResponses[index].data.data_chunks[0].slice(-1)[0].close; // Use the last data point for price
          const value = price * stock.units;
          return {
            name: stock.symbol,
            students: (value / totalValue) * 100 // Calculate percentage
          };
        });

        // Map ESG data
        const esgData = userStocks.map(stock => ({
          symbol: stock.symbol,
          type: stockDetails[stock.symbol]?.type || 'Unknown',
          esgValue: stockDetails[stock.symbol]?.ESG_value || 0
        }));

        // Map sector data
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
      }
    };

    fetchStockData();
  }, [userId]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      <Navbar />
      <div className="p-4">
        <div className="dashboard-grid">
          <div className="dashboard-item">
            <h1 className="text-2xl font-bold mb-2">Stock Data</h1>
            <PieChart data={pieChartData} outerRadius={250} colors={COLORS} />
          </div>

          <div className="dashboard-item">
            <h2 className="text-xl font-semibold mb-2">ESG Values</h2>
            <ESGBarChart data={esgData} /> {/* Display the ESG Bar Chart */}
          </div>

          <div className="dashboard-item">
            <h2 className="text-xl font-semibold mb-2">Sector Distribution</h2>
            <SectorDonutChart data={sectorData} /> {/* Display the Sector Donut Chart */}
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
        </div>
      </div>
    </>
  );
};

export default Dashboard;
