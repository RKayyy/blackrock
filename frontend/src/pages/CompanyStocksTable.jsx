import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const CompanyStocksTable = () => {
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopTenStocks = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/topten');
        setStockData(response.data);
        setError(null);
      } catch (error) {
        setStockData([]);
        setError('Error fetching stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchTopTenStocks();
  }, []);

  const handleRowClick = (symbol) => {
    navigate(`/companystockspage/${symbol}`);
  };

  return (
    <div className='p-10 border-black' style={{ textAlign: 'center', marginTop: '20px' }}>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {!loading && stockData.length > 0 && (
        <TableContainer component={Paper} sx={{ backgroundColor: '#f5f5f5' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>
                  COMPANY
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>
                  PRICE
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#e0e0e0' }}>
                  PROFIT/LOSS
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockData.map((stock, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => handleRowClick(stock.company)}
                  style={{ cursor: 'pointer' }}
                >
                  <TableCell align="center">{stock.company}</TableCell>
                  <TableCell align="center">{stock.price.toFixed(2)}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      color: stock['p/l'] === 'profitable' ? 'green' : 'red',
                      fontWeight: 'bold',
                    }}
                  >
                    {stock['p/l']}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default CompanyStocksTable;
