var request = require('request');

//exports.sendChunkGuidToMaster = sendChunkGuidToMasterFn;
exports.getMaster = getMasterFn;
exports.createProfile = createProfileFn;


var config = require('../config/config');
var master = require('../model/masterServer');
var syncRequest = require('sync-request');
var ip = require('ip');
var profile = require('../model/profile');


function getMasterFn(){
    var obj = {
        url: 'http://' + config.balancerIp + ':' + config.balancerPort + config.balancerSubPath,
        method: 'GET'
    };

    var res = syncRequest('GET', obj.url);
    master.setMasterServerIp(JSON.parse(res.getBody('utf8')).masterIp);  // utf8 convert body from buffer to string
}

function createProfileFn(username, password) {
    profile.setProfileUsername(username);
    profile.setProfilePassword(password);
    console.log("Hi, I'm "+username);
}