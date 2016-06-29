var util = require('util')
var querystring = require('querystring')
var request = require('request');
var cheerio = require('cheerio');

//elements of html contatining each 
var selLink = 'h3.r a'
var selDescr = 'div.s'
var itemSel = 'div.g'
var URL = 'https://www.google.%s/search?q=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8&gws_rd=ssl'

//Url parameters
google.resultsPerPage = 20
google.tld = 'com'
google.lang = 'en'

function google(query, callback) {

  var paramUrl = util.format(URL, google.tld, querystring.escape(query), google.resultsPerPage)
  //request module options
  var requestOptions = {
    url: paramUrl,
    method: 'GET'
  }

  request(requestOptions, function(err, resp, body) {
    if ((err == null) && resp.statusCode === 200) {
      var $ = cheerio.load(body)
      var res = {
        url: paramUrl,
        query: query,
        links: [],
        $: $,
        body: body
      }

      $(itemSel).each(function(i, elem) {
        var linkElem = $(elem).find(selLink)
        var descElem = $(elem).find(selDescr)
        var item = {
          title: $(linkElem).first().text(),
          link: null,
          description: null,
          href: null
        }
        var qsObj = querystring.parse($(linkElem).attr('href'))

        if (qsObj['/url?q']) {
          item.link = qsObj['/url?q']
          item.href = item.link
        }

        $(descElem).find('div').remove()
        item.description = $(descElem).text()

        res.links.push(item)
      })

      callback(null, res)
    } else {
      callback(new Error('Error response' + (resp ? ' (' + resp.statusCode + ')' : '') + ':' + err + ' : ' + body), null, null)
    }
  })
}

module.exports = google