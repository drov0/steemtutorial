var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false})
var sanitize = require("xss");
var steem = require('steem');
var app = express();
var showdown  = require('showdown');

app.use(express.static('public'));

steem.api.setOptions({url: 'https://api.steemit.com'});

function comment(username, wif, author,  permlink, text, jsonMetadata) {
    jsonMetadata = jsonMetadata || {};
    var comment_permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();

    steem.broadcast.comment(wif, author, permlink, username, comment_permlink , '', text, jsonMetadata, function(err, result) {
        console.log(err, result);
    });
}

// Main page
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html")
});

// Comment page
app.get('/comment', function (req, res) {
    res.sendFile(__dirname + "/public/index.html")
});

// display post
app.get('/post', function (req, res) {
    var permlink = sanitize(req.query.permlink);

    var title = "";
    var body = "";

    steem.api.getDiscussionsByBlog({tag: 'fredrikaa', limit: 100}, function(err, result) {
        for (var i = 0; i < result.length; i++)
        {
            if (result[i].permlink == permlink)
            {
                body = result[i].body;
                title = result[i].title;

                converter = new showdown.Converter();
                text      = body;
                html      = converter.makeHtml(text);

                var content = fs.readFileSync(__dirname + "/public/generic.html").toString();
                content = content.replace("404 not found", title);
                content = content.replace("The article you're looking for can't be found :(", html);
                res.send(content);
                return;
            }
            else
            {
                res.sendFile(__dirname + "/public/generic.html")
            }
        }

    });
});






app.post('/comment', urlencodedParser, function (req, res) {
    var username = sanitize(req.body.username);
    var postingkey = sanitize(req.body.postingkey);
    var message = sanitize(req.body.message);
    comment(username, postingkey, "mutterypudding",  "steemtutorial-test-1", message)
    res.sendFile(__dirname + "/public/index.html")
});

app.listen(8080, function () {
    console.log("steemtutorial is ready to go !")
});