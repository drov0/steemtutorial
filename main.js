var express = require('express');
var fs = require('fs');


var app = express();
app.use(express.static('public/home'));
app.use(express.static('public/full'));



// Main page
app.get('/', function (req, res) {
    res.sendFile(__dirname + "/full/index.html")
});



app.listen(8080, function () {
    console.log("steemtutorial is ready to go !")
});