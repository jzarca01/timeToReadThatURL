var extractor = require('article-extractor');
var readingTime = require('reading-time');
var toMarkdown = require('to-markdown');

var text = '';
var speed = 200;
var verbose = false;

var argv = require('minimist')(process.argv.slice(2));


function getDataFromUrl(url){
    return new Promise(function(resolve,reject){
        extractor.extractData(url, function (err, data) {
                 if(err !== null) return reject(err);
             resolve(data);
         });
    });
}
function estimateReadingTime(text, wordsPerMinute) {
    var stats = readingTime(text, {wordsPerMinute: wordsPerMinute});
    return stats.minutes;
}


function timeToRead(url, verbose, speed) {
        getDataFromUrl(url).then(function(data) {
            text = toMarkdown(data.title+"<br />"+data.content);
            console.log(estimateReadingTime(text, speed) + " minutes to read.");
            
            if(verbose) {
                console.log("\n\n")
                console.log(text);
            }
        });
}

function timeToSave(url) {
        var text = ''
        getDataFromUrl(url).then(function(data) {
            text = toMarkdown(data.title+"<br />"+data.content);
        });
        return text;
}

if(!argv.url) {
    console.log('\nNo URL found\n');
    console.log("Example command: node index.js --url http://bit.ly/2jeJDCg \n");
    console.log("Add --verbose to display text \n");
}

else {
    if('speed' in argv ){
        try {
            speed = parseInt(argv.speed);
        }
        catch(e) {
            console.log(e);
        }
    }
    
    if('verbose' in argv) {
        verbose = true;
    }

    timeToRead(argv.url, verbose, speed);
}


