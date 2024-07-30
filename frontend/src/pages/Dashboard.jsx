
import React, { useState, useEffect } from "react";
import PieChart from "./components/PyChart";
import Navbar from "./components/Navbar";
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';
import Donut from "./components/Dopie";


const Dashboard = () => {
  const [pieChartData, setPieChartData] = useState([]);
  const userId = "66a91c9d62a6be8083bed17e"; // Replace with actual user ID

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        // Fetch stocks for the user
        const response = await axios.get(`http://127.0.0.1:5000/stocks/${userId}`);
        const stocks = response.data;

        // Fetch stock prices and calculate values
        const stockPromises = stocks.map(stock =>
          axios.get(`http://127.0.0.1:5000/stock/${stock.symbol}`)
        );

        const stockResponses = await Promise.all(stockPromises);

        // Calculate total value of stocks
        const totalValue = stocks.reduce((sum, stock, index) => {
          const price = stockResponses[index].data.data_chunks[0].slice(-1)[0].close; // Use the last data point for price
          return sum + price * stock.units;
        }, 0);

        // Map data to required format
        const formattedData = stocks.map((stock, index) => {
          const price = stockResponses[index].data.data_chunks[0].slice(-1)[0].close; // Use the last data point for price
          const value = price * stock.units;
          return {
            name: stock.symbol,
            students: (value / totalValue) * 100 // Calculate percentage
          };
        });

        setPieChartData(formattedData);
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
      <div className="flex flex-col">
        <div>
          <h1>Stock Data</h1>
          <PieChart data={pieChartData} outerRadius={250} colors={COLORS} />
        </div>
        <div>
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
<div className="w-1/3 flex justify-center">
            <Donut />
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;