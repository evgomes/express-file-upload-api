const router = require('express').Router();

const uploadImage = require('../middlewares/file-upload/upload-image');

router.post('/', uploadImage('image'), (req, res) => {
    const data = { filename: req.file.filename};
    return res.status(201).send(data);
});

module.exports = router;