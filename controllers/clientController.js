var request = require('request');

exports.sendChunkGuidToMaster = sendChunkGuidToMasterFn;
exports.getMaster = getMasterFn;

var client = require('../model/client');
var config = require('../config/config');
var master = require('../model/masterServer');
var syncRequest = require('sync-request');

function intervalFunc()
{
    var obj = {
        url: 'http://' + master.getMasterServerIp() + ':6601/api/master/newChunk',
        method: 'POST',
        json: {
            type: "CHUNK",
            guid: client.guidGenerator()
        }
    };
    request(obj, function (err, res) {
        console.log("guid creato: " + obj.json.guid);
        if (err) {
            console.log(err);
        }
//        else {
//            console.log(res.body);
//        }
    })
}

function sendChunkGuidToMasterFn()
{
    setInterval(intervalFunc, config.randomGuidTime);
}

function getMasterFn(){
    var obj = {
        url: 'http://' + config.balancerIp + ':' + config.balancerPort + config.balancerSubPath,
        method: 'GET'
    };

    var res = syncRequest('GET', obj.url);
    master.setMasterServerIp(res.getBody('utf8'));  // utf8 convert body from buffer to string
}
