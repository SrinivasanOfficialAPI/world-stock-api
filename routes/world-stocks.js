const express = require('express');
const router = new express.Router();
const puppeteer = require('puppeteer');

const apiPageUrl = 'https://www.tradingview.com/markets/world-stocks/';
var finalJson = [];

async function fetchHTML(url) {
	// Launch a headless browser
	const browser = await puppeteer.launch();
	// Open a new page
	const page = await browser.newPage();
	// Navigate to the URL
	await page.goto(url, { waitUntil: 'networkidle2' });
	// Get the HTML content of the page
	const html = await page.content();
	// Close the browser
	await browser.close();
	return html;
}

router.get('/world-stocks/worlds-largest-companies/', async (req, res) => {
	async function main() {
		const url = apiPageUrl + 'worlds-largest-companies/';
		try {
			const html = await fetchHTML(url);
			return html;
		} catch (error) {
			console.error('Error fetching the HTML:');
		}
	}
	const html = await main();
	res.send({ data: html });
});

module.exports = router;
