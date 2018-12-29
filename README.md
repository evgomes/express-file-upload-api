# Node.js File Upload

Simple API built with Express.js and Multer to show how to handle file upload throught the use of simple middlewares.

## Dependencies

[Express.js](https://expressjs.com/) (web framework);
[Multer](https://www.npmjs.com/package/multer) (for handling multipart/form-data);
[Config](https://www.npmjs.com/package/config) (for handling configuration files);
[app-root-path](https://www.npmjs.com/package/app-root-path) (as the name suggests, to easily get the application root path).

## Dev dependencies

[Jest](https://www.npmjs.com/package/jest) (testing framework);
[supertest](https://github.com/visionmedia/supertest) (for integration testing);
[empty-folder](https://www.npmjs.com/package/empty-folder) (easy way to delete all files in a given folder).

## Configuration

The API has a configuration file ```config/default.json``` that maps all allowed file types for uploading. The configuration indicates where the files should be stored, what is the max size (in bytes) for files and the allowed extensions by file type.

```
{
    "fileTypes": {
        "images": {
            "uploadPath": "/uploads/images/",
            "maxSize": 204800,
            "extensions": [
                "jpg",
                "jpeg",
                "png",
                "gif"
            ]
        }
    }
}
```

## Understanding the middlewares

In the ```middlewares``` folder there is a file called ```upload-single.js```. This file exports a function that wraps multer, specifying how a single file should be uploaded, passing all necessary configurations. 

```
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
```

There is another file ```upload-image.js``` in the same directory. This file contains all logic to handle image upload. It initializes the storage engine, reads the configuration files to check where files should be saved, which file extensions are allowed and what are the size limits for all images. This module exports a function that calls ```upload-single.js``` function to create an image uploader.

The image uploader middleware can be used this way:

```
const router = require('express').Router();
const uploadImage = require('../middlewares/file-upload/upload-image');

router.post('/', uploadImage('image'), (req, res) => {
    const data = { filename: req.file.filename};
    return res.status(201).send(data);
});
```

The ```image``` parameter is the name of the field being sent in the request.

It's easy to implement and encapsulate your own logic for file uploading using the approach detailed above. Just create a new module for your middleware, implement the storage, filtering and size limits logic, according to [multer documentation](https://github.com/expressjs/multer/blob/master/README.md), and call the middleware the same way as used in the ```/api/files``` route.

## What is not implemented?

Currently there is no middlware wrapper for handling multiple files in the same request. If you need a feature like this, follow multer documentation on how to handle multiple files upload and create a new middleware wrapper like ```upload-single.js```.

## Running tests

Clone this repository. Open the terminal or command prompt in the repository folder and run the following commands:

```
npm i
npm test
```

NOTE: If you are using Linux or MacOS, you may have to use ```sudo``` in front of these commands.

This is going to install all dependencies and run the tests. You can check the results in console output.

## Running the application

Just run ```npm start``` after installing all dependencies to start the API.