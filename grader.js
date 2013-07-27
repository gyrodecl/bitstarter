#!/usr/bin/env node
/*
 Automatically grade files for the presence of specified HTML tags/attributes
 Users commander.js and cheerio.  Teaches command line application development
 and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

+ JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "check.json";

var assertFileExists = function(infile) {
    var instr = infile.toString();
       //first check if the file exists in the path--index.html here
    if (!fs.existsSync(instr)) {
       console.log("%s does not exist. Exiting.", instr);
       process.exit(1);  //check out node process api
       }
       return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checkfiles).sort();
    var out = {};
    for(var ii in checks) {
        //checks has all these different html elements we want to test for 
        //then we look in our html file represented by $
        //and get the array of all the elements in the html that match
        //the element we're looking for.  if the length is > 0
        //it means there's at least 1 of those elements in our index.html
	//file so we set 'true' to be the value corresponding to the
        //html property in our out result object
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
   // Workaround for commander.js issue.
   // http://stackoverflow.com/a/6772648
  return fn.bind({});
};

//remember that program variable here refers to commander module
//PROGRAM Starts here!
if(require.main == module) {
       //first check if checks.json and index.html exist
  program                     
       .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
       .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.parse(process.argv);
   var checkJson = checkHtmlFile(program.file, program.checks);
   var outJson = JSON.stringify(checkJson, null, 40);
   console.log(outJson);
}  else {
   exports.checkHtmlFile = checkHtmlFile;
}

