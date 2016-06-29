var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();
var path = require('path');
var tableify = require('tableify');
var google = require('./google.js')

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/static/index.html'));
})

app.get('/scrape', function(req, resHtml) {
	//user input
	var searchQuery = (req.query.query);
	//call google search module
	google(searchQuery, function(err, res) {
		if (err) console.error(err)
		var queryResult = [];

		// we receive more results for cases of pages conatining fewer than 10 results
		for (var i = 0; i < res.links.length & i < 10; ++i) {
			var link = res.links[i];
			console.log(link)

			queryResult.push({
				'Index:': (i),
				'Title:': (link.title),
				'Link': (link.href),
				'Description': (link.description)
			})
		}
		var htmlTable = tableify(queryResult)
		var css = '<style>' + fs.readFileSync(__dirname + '/static/style.css') + '</style>';
		resHtml.send(css + htmlTable)
		return 1;
	})
})


app.listen('8080')
console.log('Web app is running on 8080');
exports = module.exports = app;