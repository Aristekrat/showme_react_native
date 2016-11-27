var sha1 = require('sha1');
var adjectives = require('./AdjectivesList');
var nouns = require('./NounsList');
var xkcd_pw_gen_wordlist = require('./CommonWordsList');

var xkcd_pw_gen_server_hash = sha1(xkcd_pw_gen_wordlist[Math.floor(Math.random() * (xkcd_pw_gen_wordlist.length - 0) + 0)]);

// Get some entropy from the system clock:
function xkcd_pw_gen_time_ent()
{
    var d = 1 * new Date();
    var i = 0;
    while (1 * new Date() == d)
        i++; // Measure iterations until next tick
    return "" + d + i;
}

// Return a pseudorandom array of four 32-bit integers:
function xkcd_pw_gen_create_hash()
{
    // Entropy string built in a manner inspired by David Finch:
    var entropy = xkcd_pw_gen_time_ent();
    	entropy += sha1(xkcd_pw_gen_wordlist[Math.floor(Math.random() * (xkcd_pw_gen_wordlist.length - 0) + 0)]); 
    /*
    entropy += navigator.userAgent + Math.random() + Math.random() + screen.width + screen.height;
    if (document.all)
        entropy = entropy + document.body.clientWidth + document.body.clientHeight + document.body.scrollWidth + document.body.scrollHeight;
    else
        entropy = entropy + window.innerWidth + window.innerHeight + window.width + window.height;
    */

    entropy += xkcd_pw_gen_time_ent();
        
    // Hash and convert to 32-bit integers:
    var hexString = sha1(entropy); // from sha1-min.js
    var result = [];
    for (var i = 0; i < 32; i += 8)
    {
        result.push(parseInt(hexString.substr(i, 8), 16));
    }
    return result;
}

// Generate a new passphrase and update the document:
function xkcd_pw_gen(numAdjs, numWords)
{
    var hash = xkcd_pw_gen_create_hash();
    var choices = [];
    for (var a = 0; a < numAdjs; a++) 
    {
    	var jsRandom = Math.floor(Math.random() * 0x100000000);
        var index = ((jsRandom ^ hash[w]) + 0x100000000) % adjectives.length;
        choices.push(adjectives[index]);
    }
    for (var w = 0; w < numWords; w++)
    {
        var jsRandom = Math.floor(Math.random() * 0x100000000);
        var index = ((jsRandom ^ hash[w]) + 0x100000000) % nouns.length;
        choices.push(nouns[index]);
    }
    //var resultSpan = document.getElementById("xkcd_pw_gen_result");
    //resultSpan.innerText = resultSpan.textContent = choices.join(" ");
    return choices;
}

module.exports = xkcd_pw_gen;