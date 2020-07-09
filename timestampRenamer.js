const path = require('path');
const fs = require('fs');
//joining path of directory 
const directoryPath = path.join(__dirname, 'Downloads');
//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        // console.log(file);
        // updateModifiedStat(file);
        getLastModifiedFromFilename(file);
    });
});

function updateModifiedStat(filenameWithExtension) {
    const calculatedLastModified = getLastModifiedFromFilename(filenameWithExtension);
    fs.stat(path.join(directoryPath, filenameWithExtension), (err, stats) => {
        if(err) {
            throw err;
        }

        // print file last modified date
        console.log(`File Data Last Modified: ${stats.mtime}`);
        // console.log(`File Status Last Modified: ${stats.ctime}`);
    });
}

function getLastModifiedFromFilename(filename) {
    // Need to get filename 2020-05-09_12.08.54.mp4 to iso string: 2015-03-25T12:00:00-06:30
    const withNoExtension = path.parse(filename).name;
    const withT = withNoExtension.replace('_', 'T');
    const withColons = withT.replace(/\./g, ':');
    return withColons + 'Z';
}



// Need this script to read in all snapchat files, read in the timestamp in the filename, and then modify
// the date last modified to be the date and time of the filename. UGH
/**
 * https://medium.com/stackfame/get-list-of-all-files-in-a-directory-in-node-js-befd31677ec5
 * https://attacomsian.com/blog/reading-writing-files-nodejs
 * https://attacomsian.com/blog/nodejs-get-file-last-modified-date#:~:text=about%20a%20file.-,The%20fs.,status%20was%20changed%20last%20time.
 * 
 */