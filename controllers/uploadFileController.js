var request = require('request');

var profile = require('../model/profile');
var config = require('../config/config');
var master = require('../model/masterServer');

var FormData = require('form-data');


var path = require('path');
var fs = require('fs');
var extfs = require('extfs');
var util = require("util");
var resolve = require('path').resolve

var ip = require('ip');


exports.removeFile = removeFileFn;
exports.createFile =removeFileFn;
exports.getFilesDataFromDir = getFilesDataFromDirFn;
exports.getRandomFileFromDir = getRandomFileFromDirFn;
exports.startUploadReq = startUploadReqFn;
exports.getFilesAndUpload = getFilesAndUploadFn;

exports.sendOneFile = sendOneFileFn;
exports.sendGuidUserToSlaves = sendGuidUserToSlavesFn;
/**
 * Remove a file
 *
 * @param startPath - the path of the directory where the file is contained
 * @param myFileName - the name of the file
 */
function removeFileFn(startPath, myFileName)
{
    fs.unlink(startPath+'/'+myFileName, function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
}

/**
 * Create a new file in a synchronous way
 *
 * @param startPath - the path of the directory of the new file
 * @param nameFile - the name of the file (including the extension)
 * @param text - the text to write within the file
 */
function createFileFn(startPath, nameFile, text)
{
  fs.writeFileSync(startPath+'/'+nameFile, text);
}


/**
 *
 * @param startPath
 * @returns {Array} fileData - All files in the 'startPath'
 * @returns {string} fileData.startPath - the directory path
 * @returns {string} fileData.name - the name of the file (without extension)
 * @returns {string} fileData.extension - the extension of the file
 * @returns {byte} fileData.dimension - the dimension of the file in byte
 * @returns {string} fileData.idClient - the id of the client
 */
function getFilesDataFromDirFn(startPath) {

    var fileData = [];

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files;

    //Se la cartella è vuota, crea un nuovo file txt
    var empty = extfs.isEmptySync(startPath);
    if(empty)
        createFileFn(startPath, "newFile.txt", "A new test file has been created.");

    var stats = fs.statSync(startPath);
    var mtime = new Date(util.inspect(stats.mtime));

    files = fs.readdirSync(startPath);

    for(var i = 0; i < files.length; i++) {
        var stats = fs.statSync(startPath + '/' + files[i]);
        if (!stats.isDirectory()) {
            var fileSizeInBytes = stats["size"];
            fileData.push({
                startPath: startPath,
                name: files[i],
                absPath:resolve(startPath)+'/'+files[i],
                extension: path.extname(files[i]),
                sizeFile: fileSizeInBytes,
                idClient: profile.getProfileUsername(),
                lastModified: mtime
            });
        }
    }
/*    for(var i=0; i<fileData.length; i++)
       console.log(i+": "+fileData[i].startPath+"...."+fileData[i].name);*/
    return fileData;
}

/**
 * Generate a random integer between low and high
 *
 * @param low
 * @param high
 * @return {number}
 */
function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/**
 * This function randomly selects a file from the given directory (startPath). If the directory is empty, a new file is generated.
 *
 * @param startPath
 * @return {Object} chosenFileData - the file randomly chosen
 * @return {string} chosenFileData.startPath - the directory path
 * @return {string} chosenFileData.name - the name of the file (without extension)
 * @return {string} chosenFileData.extension - the extension of the file
 * @return {byte} chosenFileData.dimension - the dimension of the file in byte
 * @return {string} chosenFileData.idClient - the id of the client
 */
function getRandomFileFromDirFn(startPath) {

    var chosenFileData;
    var rand;
    var fileData = getFilesDataFromDirFn(startPath);
    rand = randomInt(0, fileData.length);
    chosenFileData = fileData[rand];

    return chosenFileData;
}


//removeFile('../Files/provaFile', "newFile.txt");
//getRandomFileFromDirFn('../Files/');
/**
 * This is the function that starts the file upload process (not loading itself but the process).
 * @param chosenFileData
 */
function startUploadReqFn(chosenFileData) {
    console.log("Client id: "+chosenFileData.idClient+" wants to upload the file "+chosenFileData.startPath+chosenFileData.name+'\n');
    var obj = {
        url: 'http://' + master.getMasterServerIp() + ':6601/api/master/newFileData',
        method: 'POST',
        json: {
            type: "METADATA",
            fileName: chosenFileData.name,
            absPath: chosenFileData.absPath,
            extension: chosenFileData.extension,
            sizeFile: chosenFileData.sizeFile,
            idClient: chosenFileData.idClient,
            lastModified: chosenFileData.lastModified,
            ipClient: ip.address()
        }
    };

    request(obj, function (err, res) {
        if (err) {
            console.log(err);
        }

        //Client sends to slaves the file upload request.
    /*    var slaveServers = res.body.slaveList;
        var guid = res.body.guid;

        slaveServers.forEach(function(server){

            console.log("Sending guid "+guid+" and idClient "+profile.getProfileUsername()+" to "+server);
            var objGuidUser = {
                url: 'http://'+server+':6601/api/chunk/newChunkGuidClient',
                method: 'POST',
                json: {
                    type: "GUID_CLIENT",
                    guid: guid,
                    idClient: profile.getProfileUsername()
                }
            };

            //Sending guid-idClient to slaves
            request(objGuidUser, function (err, res) {
             //   console.log("TYPE REQ: "+res.body.type);
                if (err) {
                    console.log(err);
                }
                if(res.body.type == 'ACK_PENDING')
                {
                    console.log("Posso inviare il file "+chosenFileData.startPath+chosenFileData.name+", (guid "+guid+") al server "+server);
                    sendOneFileFn(chosenFileData.startPath+chosenFileData.name, server, guid);
                }
            });
        });*/

    });
}

function sendGuidUserToSlavesFn(req, res) {

   if(req.body.type == 'UPINFO') {
       var guid = req.body.guid;

           console.log("Sending guid " + guid + " and idClient " + profile.getProfileUsername() + " to " + req.body.ipSlave+'\n');
           var objGuidUser = {
               url: 'http://' + req.body.ipSlave + ':6601/api/chunk/newChunkGuidClient',
               method: 'POST',
               json: {
                   type: "GUID_CLIENT",
                   guid: guid,
                   idClient: profile.getProfileUsername()
               }
           };

           //Sending guid-idClient to slaves
           request(objGuidUser, function (err, res) {
               //   console.log("TYPE REQ: "+res.body.type);
               if (err) {
                   console.log(err);
               }
               if (res.body.type == 'ACK_PENDING') {
                   sendOneFileFn(req.body.path, req.body.ipSlave, guid);
               }
           });
  //     });
       res.send({status: 'OK'});
   }
}

function getFileAndStartUploadFn(startPath) {
    var fileData = getRandomFileFromDirFn(startPath);
    startUploadReqFn(fileData);
 //   console.log("Filedata: "+fileData);
}

function getFilesAndUploadFn(startPath) {
     setInterval(getFileAndStartUploadFn, config.randomGuidTime, startPath);
}

function sendOneFileFn(path, ipServer, guid) {
    console.log("Sending file "+path+", to server ip "+ipServer+'\n');
    var formData = {
        guid: guid,
        idClient: profile.getProfileUsername(),
        my_file: fs.createReadStream(path)
    };
    request.post({url:'http://'+ipServer+':6601/api/chunk/newChunk', formData: formData}, function optionalCallback(err, res) {
        if (err) {
            return console.error('upload failed:', err);
        }
        if(res.body.status == 'ACK')
        {
            console.log("File saved in master table.");
        }
    });
}