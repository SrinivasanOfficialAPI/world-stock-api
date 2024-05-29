const express = require('express');
const router = new express.Router();
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const apiPageUrl = 'https://www.tradingview.com/markets/world-stocks/';
var finalJson = [];

async function fetchHTML(url) {
	// Launch a headless browser
	const browser = await puppeteer.launch({ headless: false });
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
		const url = apiPageUrl + 'worlds-non-us-companies/';
		try {
			const html = await fetchHTML(url);
			return html;
		} catch (error) {
			console.error('Error fetching the HTML:',error);
		}
	}
	const html = await main();
	const $ = cheerio.load(html);
	finalJson = [];

	const totalRecCount = $('.root-cFX_j1gd .table-Ngq2xrcG tr').length;
	if (totalRecCount > 0) {
		for (i = 1; i <= 100; i++) {
			const stockName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(1) span sup`
			)[0].attribs?.title;
			const exchangeName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(3)`
			).text();
			const marketCapName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(4)`
			).text();
			const priceName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(5)`
			).text();
			const changeName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(6)`
			).text();
			const volumeName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(7)`
			).text();
			const relVolumeName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(8)`
			).text();
			const priceToRatioName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(9)`
			).text();
			const epsDilutedName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(10)`
			).text();
			const epsDilutedGrowthName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(11)`
			).text();
			const dividentYieldName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(12)`
			).text();
			const sectorName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(13)`
			).text();
			const analystRatingName = $(
				`.root-cFX_j1gd .table-Ngq2xrcG tr:nth-child(${i}) td:nth-child(14)`
			).text();
			finalJson.push({
				request : req.url,
				sockName: stockName,
				exchange: exchangeName,
				marketCapitilization: marketCapName,
				price: priceName,
				priceChangePercentage: changeName,
				volumeOneDay: volumeName,
				relativeVolumneOneDay: relVolumeName,
				priceToEarningRation: priceToRatioName,
				epsDiluted: epsDilutedName,
				epsDilutedGrowth: epsDilutedGrowthName,
				dividentYieldPercentage: dividentYieldName,
				sector: sectorName,
				analystRating: analystRatingName
			});
		}
	}
	res.json(finalJson);
});

module.exports = router;
