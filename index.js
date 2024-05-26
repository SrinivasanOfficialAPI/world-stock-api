const PORT = process.env.PORT || 8000;
const express = require('express');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const app = express();

//routes
const worldStockRoutes = require('./routes/world-stocks');

app.use(worldStockRoutes);

app.listen(PORT, () => console.log(`server running o port ${PORT}`));
app.get('/', (req, res) => {
	res.json('Welcome to Global Stocks API');
});
