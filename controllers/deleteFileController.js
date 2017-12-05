var request = require('request');

var profile = require('../model/profile');
var config = require('../config/config');
var master = require('../model/masterServer');

var path = require('path');
var fs = require('fs');
var extfs = require('extfs');
var util = require("util");
var resolve = require('path').resolve

var ip = require('ip');

exports.startDelete = startDeleteFn;

function startDeleteFn(idUser, relPath) {
    var obj = {
        url: 'http://' + master.getMasterServerIp() + ':6601/api/master/deleteFile',
        method: 'POST',
        json: {
            type: "REMOVAL",
            relPath: relPath,
            idUser: idUser
        }
    };
    request(obj, function (err, res) {
        if (err) {
            console.log(err);
        }

        if(res.body.type === 'DELETE_SUCCESS')
            console.log("-> deleted file "+relPath);
    });
}