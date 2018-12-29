const request = require('supertest');
const config = require('config');
const fs = require('fs');
const path = require('path');

const empty = require('empty-folder');
const __root = require('app-root-path');

let server;

describe('upload image', () => {
    let fieldName = 'image';
    let imagePath = `${__dirname}/assets/valid.jpg`;
    let uploadConfig = config.get('fileTypes.images');

    const getResponse = () => {
        return request(server).post('/api/files').attach(fieldName, imagePath);
    };

    beforeEach(() => server = require('../../../../index'));
    afterEach(async () => {
        await server.close();

        // Deletes all uploaded files.
        empty(__root + uploadConfig.uploadPath, false, (err)=> {});
    });

    it('should upload valid file', async () => {
        const response = await getResponse();
        
        const uploadPath = uploadConfig.uploadPath + '/' + response.body.filename;
        const fileExists = fs.existsSync(uploadPath);

        expect(response.status).toBe(201);
    });

    it('should not upload file when file size is bigger than allowed in configuration file', async () => {
        imagePath = `${__dirname}/assets/too-big.jpg`;
        const response = await getResponse();

        expect(response.status).toBe(400);
    });

    it('should not upload file with not allowed file type', async () => {
        imagePath = `${__dirname}/assets/invalid.txt`;
        const response = await getResponse();

        expect(response.status).toBe(400);
    });
});