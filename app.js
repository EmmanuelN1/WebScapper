const express = require('express');
const app = express();
const path = require('path')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const ejs = require('ejs')
const dotenv = require('dotenv')


//Global Variables
let browser;


//basic setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.static('public'))


//displaying the result on the console
async function scrapeData(url, page) {
    try{

        //go to the url parsed
        await page.goto('https://aladinmma.org', {waitUntil :  'load', timeout: 0 })

        //get the html of that page
        const html = await page.evaluate(() => document.body.innerHTML);

        //loads the html in cheerio and store it in our cheerio function
        const $ = cheerio.load(html)

        let title = $("h1").text();

        return {
            title
        }

    } catch(err) {
        console.log(error)
    }
}

async function getResults(){
    browser = await puppeteer.launch({headless: false});
    //loading a new tab in the browser
    const page = await browser.newPage()


   let data = await scrapeData(url, page);

   console.log(data.title); 
}
app.get('/result', (req, res) => {
    res.render('result')
})


app.get('/search', (req, res) => {
    res.render('search')
})


app.listen(process.env.PORT, () => {
    console.log("Server Started....")
} )