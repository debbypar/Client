var request = require('request');

var client = require('../model/client');
var profile = require('../model/profile');
var config = require('../config/config');
var master = require('../model/masterServer');
var syncRequest = require('sync-request');
var ip = require('ip');

//E' la funzione che inizia la richiesta di caricamento di un file
//function uploadFile(fileName, fileDim, fileFormat)

var path = require('path');
var fs=require('fs');
var extfs = require('extfs');

exports.removeFile = removeFileFn;
exports.createFile =removeFileFn;
exports.getFilesDataFromDir = getFilesDataFromDirFn;
exports.getRandomFileFromDir = getRandomFileFromDirFn;

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


    files = fs.readdirSync(startPath);

    for(var i = 0; i < files.length; i++) {
        var stats = fs.statSync(startPath + '/' + files[i]);
        if (!stats.isDirectory()) {
            var fileSizeInBytes = stats["size"];
            fileData.push({
                startPath: startPath,
                name: files[i],
                extension: path.extname(files[i]),
                dimension: fileSizeInBytes,
                idClient: profile.getProfileUsername()
            });
        }
    }
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

    console.log("Client id: "+chosenFileData.idClient+". "+"File scelto: "+chosenFileData.startPath+chosenFileData.name);
//    console.log(chosenFileData.idClient);

    return chosenFileData;
}

//removeFile('../Files/provaFile', "newFile.txt");
//getRandomFileFromDirFn('../Files/');