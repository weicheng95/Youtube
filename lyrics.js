const axios = require('axios');
const cheerio = require('cheerio');
const searchLyricsBase = 'https://www.musixmatch.com/search/';
const lyricsBase = 'https://www.musixmatch.com'
const h2p = require('html2plaintext')
var request = require('request-promise');

const transformLink = data => {
    data = data.split(' ').join('+');
    data = data.toLowerCase();
    return data;
}

const lyricsUrl = (title, author) => {
    let returnUrl = searchLyricsBase;
    author = transformLink(author);
    title = transformLink(title);
    //search.php?q=the+chainsmokers+something+just+like+this
    console.log({
        title
    })
    console.log({
        author
    })
    //returnUrl += `?q=${author}+${title}`;
    returnUrl += `${title}`;
    console.log({
        returnUrl
    })
    return returnUrl;
}

const getLyricLink = (URI) => {
    try {
        return axios.get(URI)
            .then(res => {
                if (res.status === 200) {
                    const $ = cheerio.load(res.data)
                    console.log('getlyriclink')
                    //return $('td.text-left a').first().attr('href')
                    return $('#search-all-results .showArtist.showCoverart .title').first().attr('href')
                }
            })
            .catch(err => console.log(err))
    } catch (error) {
        console.error(error)
    }
}

const getLyric = (link) => {
    // try {
    //     return axios.get(link)
    //         .then(res => {
    //             console.log('links:' +link)
    //             if (res.status === 200) {
    //                 const $ = cheerio.load(res.data)
    //                 console.log('getlyrics')
    //                 return $('.col-xs-12.col-lg-8.text-center').first().html().split('Submit Corrections')[0]
    //             }
    //         })
    //         .catch(err => console.log(err))
    // } catch (error) {
    //     console.error(error)
    // }

    return axios.get(link).then(res => {
            return true
        })
        .catch(err => console.log(err))
}

const extractTextFromLyricLink = (URI) => {
    try {
        return axios.get(URI)
            .then(res => {
                if (res.status === 200) {
                    const $ = cheerio.load(res.data)
                    $('.col-xs-12.col-lg-8.text-center').each(function () {
                        let lyrics = $(this).html().split('Submit Corrections')[0]
                        return lyrics
                    })
                }
            })
            .catch(err => console.log(err))
    } catch (error) {
        console.error(error)
    }
}

//for testing purpose
const getlyrictest = (link) => {

    var options = {
        uri: link,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    
    request(options)
        .then(function ($) {
            return $('.col-xs-12.col-lg-8.text-center').first().html().split('Submit Corrections')[0]
        })
        .catch(function (err) {
            // Crawling failed or Cheerio choked...
        });
}

exports.getLyricsLink = (title, author) => {
    return new Promise((resolve, reject) => {
        const URI = lyricsUrl(title, author);

        const lyricLink = getLyricLink(URI)
            .then((link) => {
                var lyLink = lyricsBase + link
                resolve(lyLink)
            })
            .catch(err => reject(`You're doing it wrong!\nServer responded with status ${err.statusCode === 404 ? err.statusCode + ' not found!' : err.statusCode}\n\nFormat: Artist - Song.\nAdditional hyphens in the title should be omitted`));

    });
}

exports.getLyrics = (link) => {
    return new Promise((resolve, reject) => {
        console.log({
            link
        })

        var options = {
            uri: link,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        request(options)
        .then(function ($) {
            //first part lyric
            var ly1 = $('.mxm-lyrics__content').html()

            var ly2 = $('.mxm-lyrics span div p.mxm-lyrics__content ').html()

            var ly = ly1 + '<br />' + ly2

            resolve(ly)
        })
        .catch(err => reject(`You're doing it wrong!\nServer responded with status ${err.statusCode === 404 ? err.statusCode + ' not found!' : err.statusCode}\n\nFormat: Artist - Song.\nAdditional hyphens in the title should be omitted`));

    });
}