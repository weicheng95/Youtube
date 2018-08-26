const express = require('express')
const app = express()
const cheerio = require('cheerio');
const axios = require('axios')
const fs = require('fs');
const lyrics = require('./lyrics')
const bodyParser = require('body-parser');

// lyrics.getLyrics('something just like this', 'chainsmokers')
// .then((lyric) => {
//     console.log('from outside:')
//     console.log(lyric)
//     lyricsFromAz = lyric
// })
// .catch((err) => {
//     console.log(err)
// })

//view engine
app.set('view engine', 'ejs')

//import public
app.use(express.static('static'))

app.use(bodyParser())

app.get('/', function (req, res) {
    res.render('index')
})

app.post('/getlyrics', function(req, res) {
    var title = req.body.title
    var author = req.body.author

    lyrics.getLyrics(title, author)
    .then((lyric) => {
        return res.send(lyric)
    })
    .catch((err) => {
        console.log(err)
        return res.send('false')
    })

})

app.listen(process.env.PORT || 3000, function () {
    console.log('listening on port 3000')
})