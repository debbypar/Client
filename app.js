var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');

var request = require('request');
var ip = require('ip');

/*var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
*/
/*
var index = require('./routes/index');
var users = require('./routes/users');
*/
//var ip = require('ip');

var app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

//Porta di ascolto del client
//var port = process.env.PORT || 6603;


var clientController = require('./controllers/clientController');
var uploadFileController = require('./controllers/uploadFileController');
var testController = require('./controllers/testController');

require('./routes/clientRoute')(app);


clientController.createProfile("zippo", "zippo");
clientController.getMaster();


testController.testSendFile();


