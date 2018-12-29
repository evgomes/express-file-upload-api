const multer = require('multer');

module.exports = function(fieldName, storage, fileFilter, limits) {
    const upload = multer({ storage, fileFilter, limits }).single(fieldName);

    return function(req, res, next) {
        upload(req, res, (err) => {
            if(err) return res.status(400).send(err.message);

            next();
        });
    };
}