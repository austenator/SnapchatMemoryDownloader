const path = require('path');
const fs = require('fs');
const utimes = require('@ronomon/utimes');

// Path of Downloads folder.
const directoryPath = path.join(__dirname, 'Downloads');
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

    files.forEach(function (file) {
        const extension = path.extname(file);
        // Snapchat only returns these two extensions. Filters out .DS_STORE and other junk.
        if (extension == '.mp4' || extension == '.jpg') {
            updateTimestamps(file);
        }
    });
});

/**
 * Updates the timestamps (Date Created, Date Modified, Date Accessed) to the original timestamp of when it was taken.
 * @param {String} filenameWithExtension name of file to update time stamps of.
 */
function updateTimestamps(filenameWithExtension) {
    const calculatedTimestamp = getTimestampFromFilename(filenameWithExtension);
    const filePath = path.join(directoryPath, filenameWithExtension);

    // Last Modified Time (this is what I need to get in milliseconds from calculatedLastModified)
    var mtime = Date.parse(calculatedTimestamp);
    // Could be NaN. Probably better ways to handle this but I am only human.
    if (mtime) {
        utimes.utimes(filePath, mtime, mtime, mtime, () => {
            console.log('Done updating ' + filenameWithExtension);
        });
    }
}

/**
 * Converts the timestamp in the file name to a UTC ISO8601 Timestamp.
 * @param {String} filename the name of the file (in our case it's something like '2020-05-09_12.08.54.mp4').
 */
function getTimestampFromFilename(filename) {
    // Need to get filename 2020-05-09_12.08.54.mp4 to iso string: 2015-03-25T12:00:00Z (or '-06:30' instead of Z)
    const withNoExtension = path.parse(filename).name;
    const withT = withNoExtension.replace('_', 'T');
    const withColons = withT.replace(/\./g, ':');
    return withColons + 'Z';
}
