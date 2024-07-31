import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ESG Bar Chart Component
const ESGBarChart = ({ data }) => {
  return (
    <ResponsiveContainer width="80%" height={200}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="symbol" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="esgValue" fill="#82ca9d" name="ESG Value" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ESGBarChart;
