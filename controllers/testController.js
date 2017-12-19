var fs = require('fs');
var uploadFileController = require("./uploadFileController");
var casual = require('casual');
var math = require('mathjs');

exports.createCasualFile = createCasualFileFn;
exports.testSendFile = testSendFileFn;

function createCasualFileFn(){

    var i;
    for(i=0;i<100;i++) {
        fs.writeFile("./Files/Test/testFile" + i, "" +
            "Hey this is a test file. \n" +
            casual.city + "\n" +
            casual.street+ "\n" +
            casual.address + "\n" +
            "FileNumber:" + i, function (err) {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
    }

}


function testSendFileFn()
{

    var i;
    var timer = require('../model/test');
    timer.setLenght(100);
    for(i=0;i<100;i++)
    {

       var j = casual.integer(from = 0, to = 99);
       uploadFileController.startSyncUpload("Files/Test/testFile" + j, "Files/Test/testFile" + j);

    }
}