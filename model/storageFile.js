var request = require('request');
var syncRequest = require('sync-request');

var fs = require('fs');

exports.createFile = createFileFn;
exports.removeFile = removeFileFn;

function createFileFn(myFile)
{
    fs.open(myFile, 'w', function (err, file) {
        if (err) throw err;
        console.log('Saved!');
    });
}

function removeFileFn(myFile)
{
    fs.unlink(myFile, function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
}

//createFileFn('myFile.txt');

//removeFileFn('myFile.txt');