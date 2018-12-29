const multer = require('multer');
const config = require('config');
const __root = require('app-root-path');

const uploadSingle = require('./upload-single');

/**
 * Upload configuration for the file type to be uploaded.
 */
const uploadConfiguration = config.get('fileTypes.images');

/**
 * Defines the storage engine to indicate where and with which name to use when saving files.
 */
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __root + uploadConfiguration.uploadPath);
    },

    filename: function (req, file, callback) {
        callback(null, Date.now() + '.' + getFileExtension(file));
    }
});

/**
 * Filter function to avoid users from sending not allowed file types.
 */
const filter = function (req, file, callback) {
    const fileExtension = getFileExtension(file);
    const typeAllowed = uploadConfiguration.extensions.some(e => e === fileExtension);

    if (!typeAllowed) {
        callback(new Error('Invalid file type.'));
        return;
    }

    callback(null, true);
}

/**
 * Specify the upload limits for the given file type.
 */
const limits = {
    fileSize: uploadConfiguration.maxSize
}

/**
 * Returns the extensions of the given file.
 * 
 * Example: "test.JPG" will return "jpg". 
 */
function getFileExtension(file) {
    const index = file.originalname.lastIndexOf('.') + 1;
    return file.originalname.substr(index).toLowerCase();
}

module.exports = function (fieldName) {
    return uploadSingle(fieldName, storage, filter, limits);
}