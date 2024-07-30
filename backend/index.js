const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo')
const yahooFinance = require('yahoo-finance2').default;
const axios = require('axios');


const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://admin_test:admin@cluster0.zybueoo.mongodb.net/blackrock?retryWrites=true&w=majority&appName=Cluster0')

app.post('/add', (req, res) => {
    const task = req.body.task;
    TodoModel.create({
        task: task
    }).then(result => res.json(result))
        .catch(err => res.json(err))

})

app.get('/api/stock/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const queryOptions = { period: '1d', interval: '1m' };
    try {
        const result = await yahooFinance.historical(symbol, queryOptions);
        res.json(result);
    } catch (error) {
        res.status(500).send('Error fetching stock data');
    }
});

app.listen(5555, () => {
    console.log('server is running');
})