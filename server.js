var express = require('express'),
    app = express(),
    fs = require('fs'),
    port = process.env.PORT || 3001;



require('./api/model/questionModel');
require('./api/model/serviceModel');
require('./api/model/signUpModel');

var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/RewardsDB');

app.use(bodyParser.urlencoded({extented : true}));
app.use(bodyParser.json());


//Require All Routes
fs.readdirSync('./api/route/').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        routes = require('./api/route/' + file);
        routes(app);
    }
});


app.listen(port);

console.log('Rewards App Server, Rest API Started at ' + port);