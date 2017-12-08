var request = require('request');
var config = require('../config/config');


exports.addUser = addUserFn;

function addUserFn(idUser, password) {
  //  console.log(idUser+"----"+password);

    var obj = {
        url: 'http://' + config.balancerIp + ':' + config.balancerPort + '/api/lb/edge/registration',
        method: 'POST',
        json: {
            type: "REGISTRATION",
            idUser: idUser,
            password: password
        }
    };

    request(obj, function (err, res) {
        if (err) {
            console.log(err);
        }
        else if(res.body.status === "REGISTRATION_SUCCESS") {
            console.log("Registration success!");
        }
        else if(res.body.status === 'USER_ID_EXISTS')
            console.log("Id User already exists!");
    });
}