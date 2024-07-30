import React, { useEffect, useState } from "react";
import axios from 'axios'; // or use fetch if preferred
import Navbar from "./Navbar";
import PieChart from "./Piechart";
// import PieChart from "./piechart";

const PieChart1 = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your backend API endpoint
        const response = await axios.get('/api/data'); 
        // Adjust the response data structure according to your backend response
        const { labels, values } = response.data;

        setChartData({ labels, values });
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div>
        <h1>Pie Chart Example</h1>
        {chartData ? (
          <PieChart data={chartData} />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </>
  );
};

export default PieChart1;