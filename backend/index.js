const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo')
const yahooFinance = require('yahoo-finance2').default;

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://admin_test:admin@cluster0.zybueoo.mongodb.net/blackrock?retryWrites=true&w=majority&appName=Cluster0')

app.get('/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    console.log(symbol);

    const queryOptions = {
        symbol: symbol,
        from: '2022-01-01',
        to: '2022-12-31' // Adjust dates as necessary
    };

    try {
        const result = await yahooFinance.historical(queryOptions);
        console.log(`Fetched data: ${JSON.stringify(result)}`);
        res.json(result);
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(5555, () => {
    console.log('server is running');
})
