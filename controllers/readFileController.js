exports.getDirectoryTree = getDirectoryTreeFn;
var request = require('request');

var master = require('../model/masterServer');


function getDirectoryTreeFn(username) {
    console.log("Connecting master...");

    var data = {
        url: 'http://'+ master.getMasterServerIp()+':6601/api/master/getDirectoryTree',
        method: 'POST',
        json: {
            username: username
        }
    };

    request(data, function(err, res) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(".....");
            console.log("res: "+prettyJSONFn(res.body));
            console.log(".....");
        }
    });
}

function prettyJSONFn(obj) {
    console.log(JSON.stringify(obj, null, 2));
}