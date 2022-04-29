const express = require('express');
const app = express();
const path = require('path')
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');



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
        await page.goto(url, {waitUntil :  'load', timeout: 0 })

        //get the html of that page
        const html = await page.evaluate(() => document.body.innerHTML);

        //loads the html in cheerio and store it in our cheerio function
        const $ = await cheerio.load(html);


        //scrapping data from the tmdb website
        let title = $("h2").text();
        let releaseDate = $(".release_date").text();
        let overview = $(".overview > p").text();
        let userScore = $(".user_score_chart").attr("data-percent");
        let imgUrl = $("#main > section > div.header.large.border.first.lazyloaded > div > div > section > div.poster > div.image_content > a > img").attr("src");
        

        //unblur the image
       // imgUrl = imgUrl.replace('_filter(blur)','');

        
        let crewLength = $(" div.header_info > ol > li").length

        let crew = [];

        for (let i = 1; i <= crewLength; i++ ){
            let name = $("div.header_info > ol > li:nth-child("+i+") > p:nth-child(1)").text();
            let role = $("div.header_info > ol > li:nth-child("+i+") > p.character").text();

            crew.push({
                "name" : name,
                "role" : role
            })
        }

        browser.close();



        return {
            title,
            releaseDate,
            overview,
            userScore,
            imgUrl,
            crew 
        }

    } catch(err) {
        console.log(err.message)
    }
}


app.get('/results', async function (req, res) {

    let url = req.query.search;

    browser = await puppeteer.launch({headless: false});
    //loading a new tab in the browser
    const page = await browser.newPage()
    let data = await scrapeData(url, page);

    res.render('results', {data:data})

})


app.get('/', (req, res) => {
    res.render('search')
})


app.listen(3000, () => {
    console.log("Server Started....")
} )