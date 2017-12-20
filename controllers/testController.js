var fs = require('fs');
var uploadFileController = require("./uploadFileController");
var casual = require('casual');
var math = require('mathjs');

exports.createCasualFile = createCasualFileFn;
exports.testSendFile = testSendFileFn;
exports.testSendFileSync = testSendFileSyncFn;
exports.testReadFile = testReadFileFn;
var master = require('../model/masterServer');
var request = require('request');
var guids = [];

function createCasualFileFn(max){

    var i;
    for(i=0;i<max;i++) {
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


function testSendFileFn(nfiles)
{

    var i;
    var timer = require('../model/uploadTest');
    timer.setLenght(nfiles);
    for(i=0;i<nfiles;i++)
    {

       var j = casual.integer(from = 0, to = nfiles-1);
       uploadFileController.startUpload("Files/Test/testFile" + j, "Files/Test/testFile" + j);

    }
}


function testSendFileSyncFn(nfiles)
{

    var i;
    var timer = require('../model/uploadTest');
    timer.setLenght(nfiles);
    for(i=0;i<nfiles;i++)
    {

        var j = casual.integer(from = 0, to = nfiles-1);
        uploadFileController.startSyncUpload("Files/Test/testFile" + j, "Files/Test/testFile" + j);

    }
}

function testReadFileFn(nfiles)
{

    var timer = require('../model/readTest');
    timer.setLenght(nfiles);
    var data = {
        url: 'http://'+ master.getMasterServerIp()+':6601/api/master/getDirectoryTree',
        method: 'POST',
        json: {
            username: "zippo"
        }
    };

    request(data, function(err, res) {
        if (err) {
            console.log(err);
        }
        else {


            res.body.forEach(function (table) {
                printGuid(table);

            })
            var i=0;
            while(i<res.body.length)
            {
                printGuid(res.body[i]);
                i++;
            }


            var total = guids.length;
            var h;
            var j;
            for(h=0;h<nfiles;h++) {
                j = casual.integer(from = 0, to = total - 1);
                readFile(guids[j].guid, guids[j].path);
            }
            // JSON.stringify(res.body, null, 2).forEach(function (files) {
            //     console.log(files);
            // })
        }
    });

}

function printGuid(table) {
    if (table.guid) {

        guids.push({
            guid : table.guid,
            path: table.path
        });
    }

    var i = 0;
    if (table.children)
        while (i < table.children.length) {
            printGuid(table.children[i]);
            i++;
        }





}


function readFile(guid,path,nfiles) {

    var timer = require('../model/readTest');
    var start = process.hrtime();
    var data = {
        url: 'http://' + master.getMasterServerIp() + ':6601/api/master/readFile',
        method: 'POST',
        json: {
            guid: guid,
            user: 'zippo'
        }
    };

    var fileReq = {
        user: 'zippo',
        path: path
    };


    request(data, function(err, response) {
        if (err) {
            console.log(err);
        }
        else {
            var slaves = response.body;
            var i = 0;
            var data = {
                url: 'http://' + slaves[i].slaveIp + ':6601/api/chunk/readFile' ,
                method: 'POST',
                json: fileReq
            };
            request(data, function(err, response2) {
                if (err) {
                    console.log(err);
                }
                else {

                    var precision = 3; // 3 decimal places
                    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
                    var time = elapsed.toFixed(precision);
                    timer.pushTime(time);
                    // console.log(response2.body);
                   // res.send(response2.body);
                }
            });
        }
    })

}