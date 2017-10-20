var request = require('request');

exports.sendChunkGuidToMaster = sendChunkGuidToMasterFn;
exports.getMaster = getMasterFn;
exports.createProfile = createProfileFn;


var config = require('../config/config');
var master = require('../model/masterServer');
var syncRequest = require('sync-request');
var ip = require('ip');
var profile = require('../model/profile');

function intervalFunc()
{
    var obj = {
        url: 'http://' + master.getMasterServerIp() + ':6601/api/master/newChunk',
        method: 'POST',
        json: {
            type: "CHUNK",
            guid: client.guidGenerator(),
            myIp: ip.address()
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
//        res.send({status: 'ACK'});
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

function createProfileFn(username, password) {
    profile.setProfileUsername(username);
    profile.setProfilePassword(password);
}