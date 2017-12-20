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
var readFileController = require("./controllers/readFileController");
require('./routes/clientRoute')(app);


clientController.createProfile("zippo", "zippo");
clientController.getMaster();

if(process.argv[2] === "create")
    testController.createCasualFile(process.argv[3]);

if(process.argv[2] === "send")
    testController.testSendFile(process.argv[3]);

if(process.argv[2] === "syncSend")
    testController.testSendFileSync(process.argv[3]);

if(process.argv[2] === "read")
    testController.testReadFile(process.argv[3]);