const axios = require('axios');
const cheerio = require('cheerio');
const searchLyricsBase = 'https://search.azlyrics.com/search.php';
const lyricsBase = 'https://azlyrics.com/';
const h2p = require('html2plaintext')
// const transformMsg = msg => {
//     const arr = msg.split(/\s*\-\s*/g);
//     if(arr.length !== 2) return false;
//     return arr;
// }

const transformLink = data => {
	data = data.split(' ',).join('+');	
	data = data.toLowerCase();
	return data;
}

const lyricsUrl = (title,author) => {
	let returnUrl = searchLyricsBase;	
	author = transformLink(author);
    title = transformLink(title);
    //search.php?q=the+chainsmokers+something+just+like+this
    //returnUrl += `lyrics/${author}/${title}.html`;
    console.log({title})
    console.log({author})
    //returnUrl += `?q=${author}+${title}`;
    returnUrl += `?q=${title}`;
    console.log({returnUrl})
	return returnUrl;
}

exports.getLyrics = (title, author) => {
	return new Promise((resolve, reject) => {
        const URI = lyricsUrl(title, author);
        axios.get(URI)
		.then(res => {
            const $ = cheerio.load(res.data)
            console.log($)
            if($('.alert.alert-warning').length > 0){
                return resolve('no result found')
            }
            $('td.text-left a').each(function(){
                url = $(this).attr('href');
                //test
                console.log(url)
                // Get Lyrics
                axios.get(url)
                .then(res => {
                    console.log(res)
                    if(res.status === 200) {
                        const $ = cheerio.load(res.data)
                        $('.col-xs-12.col-lg-8.text-center').each(function(){
                            let lyrics = $(this).html().split('Submit Corrections')[0]
                            return resolve(lyrics)
                        })
                    }
                })
                .catch(err => reject('url problem!!!'));
                
                return false;
            });
		})
		.catch(err => reject(`You're doing it wrong!\nServer responded with status ${err.statusCode === 404 ? err.statusCode + ' not found!' : err.statusCode}\n\nFormat: Artist - Song.\nAdditional hyphens in the title should be omitted`));
	});
}