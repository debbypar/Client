var request = require('request');

var profile = require('../model/profile');
var config = require('../config/config');
var master = require('../model/masterServer');
var syncRequest = require("sync-request");
var FormData = require('form-data');
var timer = require('../model/uploadTest');

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
exports.getFileData = getFileDataFn;
exports.startUpload = startUploadFn;
exports.startSyncUpload = startSyncUploadFn;


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

    if (!fs.existsSync(startPath, 'utf8')) {
        console.log("no dir ", startPath);
        return;
    }
    else {
        var files;

        //Se la cartella è vuota, crea un nuovo file txt
        var empty = extfs.isEmptySync(startPath);
        if (empty)
            createFileFn(startPath, "newFile.txt", "A new test file has been created.");

        var stats = fs.statSync(startPath);
        var mtime = new Date(util.inspect(stats.mtime));

        files = fs.readdirSync(startPath);

        for (var i = 0; i < files.length; i++) {
            var stats = fs.statSync(startPath + '/' + files[i]);
            if (!stats.isDirectory()) {
                var fileSizeInBytes = stats["size"];
                fileData.push({
                    startPath: startPath,
                    name: files[i],
                    absPath: resolve(startPath) + '/' + files[i],
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


/**
 * This is the function that starts the file upload process (not loading itself but the process).
 * @param chosenFileData
 */
function startUploadReqFn(chosenFileData) {

    var obj = {
        url: 'http://' + master.getMasterServerIp() + ':6601/api/master/newFileData',
        method: 'POST',
        json: {
            type: "METADATA",
            fileName: chosenFileData.name,
            origAbsPath: chosenFileData.absPath,
            destRelPath: path.relative(process.cwd(), chosenFileData.absPath),
            extension: chosenFileData.extension,
            sizeFile: chosenFileData.sizeFile,
            idClient: chosenFileData.idClient,
            lastModified: chosenFileData.lastModified,
            ipClient: ip.address()
        }
    };

    request(obj, function (err, res1) {
        if (err) {
            console.log(err);
        }
    });
}

/**
 * The client receives (guid, ipServer) from master and contacts the ipServer.
 * If the server recognizes client request as authorized by the master, the client sends the file.
 * @param req
 * @param res
 */
function sendGuidUserToSlavesFn(req, res) {

   if(req.body.type == 'UPINFO') {
       var guid = req.body.guid;

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
               if (err) {
                   console.log(err);
               }
               if (res.body.type == 'ACK_PENDING') {
                   sendOneFileFn(req.body.origPath, req.body.destPath, req.body.ipSlave, guid);
               }
           });
       res.send({status: 'OK'});
   }
}

/**
 * This function selects a single random file from the directory 'startPath' and starts a new uploading request.
 *
 * @param startPath
 */
function getFileAndStartUploadFn(startPath) {
    var fileData = getRandomFileFromDirFn(startPath);
    startUploadReqFn(fileData);
 //   console.log("Filedata: "+fileData);
}


/**
 * This function sends multiple uploading requests.
 * @param startPath - the absolute path of the directory containing the file randomly chosen.
 */
function getFilesAndUploadFn(startPath) {
     setInterval(getFileAndStartUploadFn, config.randomGuidTime, startPath);
}


/**
 * The client sends file to server.
 * @param path - The absolute path of the file in the client machine.
 * @param ipServer - The ip server I want to send the file
 * @param guid - The GUID that identifies the file.
 */
function sendOneFileFn(origAbsPath, destRelPath, ipServer, guid, start) {
    var formData = {
        guid: guid,
        idUser: profile.getProfileUsername(),
        destRelPath: destRelPath,
        my_file: fs.createReadStream(origAbsPath)
    };
    var start = process.hrtime();
    request.post({url:'http://'+ipServer+':6601/api/chunk/newChunk', formData: formData}, function optionalCallback(err, res) {
        if (err) {
            return console.error('upload failed:', err);
        }
        else if(res.statusCode === 200)
        {
            var jsonRes = JSON.parse(res.body);
            if(jsonRes.type === 'FILE_SAVED_SUCCESS')
            {
                var precision = 3; // 3 decimal places
                var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
                var time = elapsed.toFixed(precision); // print message + time
                timer.pushFileTime(time);
                // console.log("Uploading "+jsonRes.nameFile+" SUCCESS!!!!!\n");
            }
        }
    });
}

/*
function savedSuccessFn(req, res) {
    if(req.body.type === 'FILE_SAVED_SUCCESS')
        console.log("Uploading "+req.body.nameFile+" SUCCESS!!!!!\n");
    res.send({status: 'ACK'});
}*/


/**
 * The client collects data from selected file.
 * @param fileAbsPath
 * @return {string}
 */
function getFileDataFn(fileAbsPath) {

    console.log(fileAbsPath);
    if (!fs.existsSync(fileAbsPath, 'utf8')) {
        console.log("no file ", fileAbsPath);
        return;
    }
    else {

        var fileData = '';

        var stats = fs.statSync(fileAbsPath);
        var mtime = new Date(util.inspect(stats.mtime));
        var fileSizeInBytes = stats["size"];
        fileData = {
            absPath: fileAbsPath,
            name: path.basename(fileAbsPath),
            extension: path.extname(path.basename(fileAbsPath)),
            sizeFile: fileSizeInBytes,
            idUser: profile.getProfileUsername(),
            lastModified: mtime
        };
        return fileData;
    }
}


/**
 * The client wants to upload file in 'fileAbsPath' to the destination path
 * @param fileAbsPath - The local path of the chosen file.
 * @param destRelPath - The path where the file is uploaded.
 */
function startUploadFn(fileAbsPath, destRelPath) {
    var fileData = getFileDataFn(fileAbsPath);
    var start = process.hrtime();
    var obj = {
        url: 'http://' + master.getMasterServerIp() + ':6601/api/master/newFileData',
        method: 'POST',
        json: {
            type: "METADATA",
            fileName: fileData.name,
            origAbsPath: fileData.absPath,
            destRelPath: destRelPath,
            extension: "undefined",
            sizeFile: fileData.sizeFile,
            idUser: fileData.idUser,
            lastModified: fileData.lastModified
        }
    };


    request(obj, function (err, res) {
        if (err) {
            console.log(err);
        }

        if(res.body.type === 'UPINFO') {
            var guid = res.body.guid;

            res.body.ipSlaves.forEach(function (ip) {
                var objGuidUser = {
                    url: 'http://' + ip + ':6601/api/chunk/newChunkGuidClient',
                    method: 'POST',
                    json: {
                        type: "GUID_CLIENT",
                        guid: guid,
                        idUser: profile.getProfileUsername()
                    }
                };

                //Sending guid-idClient to slaves
                request(objGuidUser, function (err, res) {
                    if (err) {
                        console.log(err);
                    }
                    if (res.body.type === 'ACK_PENDING') {
                        var precision = 3; // 3 decimal places
                        var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
                        var time = elapsed.toFixed(precision); // print message + time
                        timer.pushTime(time);
                        sendOneFileFn(fileAbsPath, destRelPath, ip, guid,start);
                    }
                });
            });
        }
    });
}


function startSyncUploadFn(fileAbsPath, destRelPath) {
    var fileData = getFileDataFn(fileAbsPath);
    var start = process.hrtime();

    var obj = {
        url: 'http://' + master.getMasterServerIp() + ':6601/api/master/newFileData',
        method: 'POST',
        json: {
            type: "METADATA",
            fileName: fileData.name,
            origAbsPath: fileData.absPath,
            destRelPath: destRelPath,
            extension: fileData.extension,
            sizeFile: fileData.sizeFile,
            idUser: fileData.idUser,
            lastModified: fileData.lastModified
        }
    };
    var res = syncRequest(obj.method, obj.url, {
        json: obj.json
    });
    res = JSON.parse(res.getBody('utf8'));
    if(res.type === 'UPINFO') {
            var guid = res.guid;

            res.ipSlaves.forEach(function (ip) {
                var objGuidUser = {
                    url: 'http://' + ip + ':6601/api/chunk/newChunkGuidClient',
                    method: 'POST',
                    json: {
                        type: "GUID_CLIENT",
                        guid: guid,
                        idUser: profile.getProfileUsername()
                    }
                };


                var res2 = syncRequest(objGuidUser.method, objGuidUser.url, {
                    json: objGuidUser.json
                });
                res2 = JSON.parse(res2.getBody('utf8'));

                    if (res2.type === 'ACK_PENDING') {
                        var precision = 3; // 3 decimal places
                        var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
                        var time = elapsed.toFixed(precision); // print message + time
                        timer.pushTime(time);
                        sendOneFileFn(fileAbsPath, destRelPath, ip, guid);
                    }
                });

        }

}

