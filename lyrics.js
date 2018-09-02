const axios = require('axios');
const cheerio = require('cheerio');
const searchLyricsBase = 'https://search.azlyrics.com/search.php';
const lyricsBase = 'https://azlyrics.com/';
const h2p = require('html2plaintext')

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
    returnUrl += `?q=${title}`;
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
                    return $('td.text-left a').first().attr('href')
                }
            })
            .catch(err => console.log(err))
    } catch (error) {
        console.error(error)
    }
}

const getLyric = (link) => {
    try {
        return axios.get(link)
            .then((res, req) => {
                console.log(res)
                console.log('links:' +link)
                return true
                // if (res.status === 200) {
                //     const $ = cheerio.load(res.data)
                //     console.log('getlyrics')
                //     return $('.col-xs-12.col-lg-8.text-center').first().html().split('Submit Corrections')[0]
                // }
            })
            .catch(err => console.log(err))
    } catch (error) {
        console.error(error)
    }
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

// exports.getLyricsLink = (title, author) => {
//     return new Promise((resolve, reject) => {
//         const URI = lyricsUrl(title, author);

//         const lyricLink = getLyricLink(URI)
//             .then((link) => {
//                 resolve(link)
//             })
//             .catch(err => reject(`You're doing it wrong!\nServer responded with status ${err.statusCode === 404 ? err.statusCode + ' not found!' : err.statusCode}\n\nFormat: Artist - Song.\nAdditional hyphens in the title should be omitted`));

//     });
// }

exports.getLyrics = (link) => {
    return new Promise((resolve, reject) => {
        console.log({
            link
        })
        const lyricLink = getLyric(link)
        .then((ly) => {
            resolve(ly)
        })
        .catch(err => reject(`You're doing it wrong!\nServer responded with status ${err.statusCode === 404 ? err.statusCode + ' not found!' : err.statusCode}\n\nFormat: Artist - Song.\nAdditional hyphens in the title should be omitted`));

    });
}