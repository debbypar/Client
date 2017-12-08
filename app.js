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
var deleteFileController = require('./controllers/deleteFileController');
var loginController = require('./controllers/loginController');
var registrationController = require('./controllers/registrationController');



var profile = require('./model/profile');
var master = require('./model/masterServer');



// view engine setup
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
*/
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
/*app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
*/
/*app.use('/', index);
app.use('/users', users);*/

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});*/

// error handler
/*app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/

//module.exports = app;

require('./routes/clientRoute')(app);

app.listen(config.port, config.ip, function() {
    // print a message when the server starts listening
    console.log("server starting on " + config.ip + ':' + config.port + " IP: " + ip.address());
});

//clientController.createProfile("Debora", "deb");

//clientController.getMaster();

//master.setMasterServerIp('172.17.0.3');


//Use this sequence of functions to send a single file randomly chosen.
/*
var file = uploadFileController.getRandomFileFromDir('./Files/');
uploadFileController.startUploadReq(file);

*/

//Periodically loading files, which are randomly selected.
//uploadFileController.getFilesAndUpload('./Files/');
/*
uploadFileController.startUpload('/opt/project/Files/file1.txt', 'Debora/Files/file1.txt');
setTimeout(uploadFileController.startUpload, 5000,'/opt/project/Files/provaFile/file1.txt', 'Debora/Files/provaFile/file1.txt');
setTimeout(uploadFileController.startUpload, 8000, '/opt/project/Files/file4.txt', 'Debora/Files/file4.txt');
setTimeout(uploadFileController.startUpload, 11000,'/opt/project/Files/file6.txt', 'Debora/Files/file6.txt');
setTimeout(uploadFileController.startUpload, 14000, '/opt/project/Files/provaFile/file2.txt', 'Debora/Files/provaFile/file2.txt');
setTimeout(uploadFileController.startUpload, 17000, '/opt/project/Files/provaFile/ciao.exe', 'Debora/Files/provaFile/ciao.exe');
setTimeout(uploadFileController.startUpload, 118000, '/opt/project/config/config.js', '/config/config.js');
setTimeout(uploadFileController.startUpload, 121000, '/opt/project/Files/file2.txt', '/Files/file2.txt');
setTimeout(uploadFileController.startUpload, 124000, '/opt/project/Files/file3.txt', '/Files/file3.txt');
setTimeout(uploadFileController.startUpload, 127000, '/opt/project/Files/file5.txt', '/Files/file5.txt');


setTimeout(deleteFileController.startDelete, 14000, profile.getProfileUsername(), 'Debora/Files/provaFile/file1.txt');
*/

registrationController.addUser('Ciao', 'ciaoPass');

//loginController.login('Debora', 'deb');