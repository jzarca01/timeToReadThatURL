import extractor from 'article-extractor';
import readingTime from 'reading-time';
import toMarkdown from 'to-markdown';
import minimist from 'minimist';

let text = '';
let speed = 200;
let verbose = false;

let argv = minimist(process.argv.slice(2));


function getDataFromUrl(url){
    return new Promise(function(resolve,reject){
        extractor.extractData(url, (err, data) => {
                 if(err !== null) return reject(err);
             resolve(data);
         });
    });
}
function estimateReadingTime(text, wordsPerMinute) {
    let stats = readingTime(text, {wordsPerMinute: wordsPerMinute});
    return stats.minutes;
}


function timeToRead(url, verbose, speed) {
        getDataFromUrl(url).then(data => {
            text = toMarkdown(data.title+"<br />"+data.content);
            console.log(estimateReadingTime(text, speed) + " minutes to read.");
            
            if(verbose) {
                console.log("\n\n")
                console.log(text);
            }
        });
}

function timeToSave(url) {
        let text = ''
        getDataFromUrl(url).then(data => {
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


