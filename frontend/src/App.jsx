// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <Home />
//     </>
//   )
// }

// export default App

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CompanyStockPage from "./pages/CompanyStockPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/companystockspage" element={<CompanyStockPage />} />
      </Routes>
    </Router>
  );
}
