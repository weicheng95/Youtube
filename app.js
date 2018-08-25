const express = require('express')
const app = express()
const cheerio = require('cheerio');
const axios = require('axios')
const fs = require('fs');

//view engine
app.set('view engine', 'ejs')
//import public
app.use(express.static('static'))

app.get('/', function (req, res) {
    res.render('index')
})

// axios
//     .get('https://dev.to/aurelkurtula')
//     .then((response) => {
//         if (response.status === 200) {
//             const html = response.data;
//             const $ = cheerio.load(html);

//             console.log($.text())
//         }
//     }, (error) => console.log(err));


app.listen(3000, function () {
    console.log('listening on port 3000')
})
