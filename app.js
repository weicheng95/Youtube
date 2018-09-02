const express = require('express')
const app = express()
const cheerio = require('cheerio');
const fs = require('fs');
const lyrics = require('./lyrics')
const bodyParser = require('body-parser');
const timeout = require('connect-timeout')

//setting
// app.use(timeout('10s'))
// app.use(haltOnTimedout)
app.use(bodyParser())

function haltOnTimedout (req, res, next) {
    if (!req.timedout) next()
  }

//view engine
app.set('view engine', 'ejs')

//import public
app.use(express.static('static'))



app.get('/', function (req, res) {
    res.render('index')
})

app.post('/getlyrics', function(req, res, next) {
    var title = req.body.title
    var author = req.body.author

    // lyrics.getLyricsLink(title, author)
    // .then((link) => {
    //     lyrics.getLyrics(link)
    //     .then((lyric) => {
    //         return res.send(lyric)
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })
    // })
    // .catch((err) => {
    //     console.log(err)
    //     return res.send('false')
    // })

    var link = 'https://www.azlyrics.com/lyrics/alanwalker/faded.html'
    lyrics.getLyrics(link)
        .then((lyric) => {
            return res.send(lyric)
        })
        .catch((err) => {
            console.log(err)
        })
        
})

app.listen(process.env.PORT || 3000, function () {
    console.log('listening on port 3000')
})