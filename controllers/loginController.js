var config = require('../config/config');
var master = require('../model/masterServer');
var syncRequest = require('sync-request');
var ip = require('ip');
var profile = require('../model/profile');

var request = require('request');

//var util = require('util');

exports.login = loginFn;

function loginFn(idUser, password) {
    console.log(idUser+" wants to login.");

    var obj = {
        url: 'http://' + config.balancerIp + ':' + config.balancerPort + '/api/lb/edge/login',
        method: 'POST',
        json: {
            type: "LOGIN",
            idUser: idUser,
            password: password
        }
    };

    request(obj, function (err, res) {

        if (err) {
            console.log(err);
        }
        else if (res.body.status === "LOGIN_SUCCESS") {
            console.log("Login success!");
        }
        else if(res.body.status === "WRONG_USER_ID")
        {
            console.log("Wrong user id!");
        }
        else if(res.body.status === "WRONG_PASSWORD")
        {
            console.log("Wrong password!");
        }
    });
}