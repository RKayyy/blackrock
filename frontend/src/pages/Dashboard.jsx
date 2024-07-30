import React from "react";
import PyChart from "./components/PyChart";
import Navbar from "./components/Navbar";
import { LineChart } from '@mui/x-charts/LineChart';
import Donut from "./components/Dopie";

const Dashboard = () => {
  const data = [
    { name: "Geeksforgeeks", students: 400 },
    { name: "Technical scripter", students: 700 },
    { name: "Geek-i-knack", students: 200 },
    { name: "Geek-o-mania", students: 1000 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center">
        <h1>Student Data</h1>
        <div className="flex flex-row w-full justify-between">
          <div className="w-1/2 flex justify-center">
            <PyChart data={data} outerRadius={250} colors={COLORS} />
          </div>
          <div className="w-1/2 flex justify-center mt-20 mr-10 ml-10">
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                },
              ]}
              height={500}
              margin={{ left: 30, right: 30, top: 30, bottom: 30 }}
              grid={{ vertical: true, horizontal: true }}
            />
          </div>
        </div>
        <div className="flex w-full justify-start mt-10">
          <div className="w-1/3 flex justify-center">
            <Donut />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;