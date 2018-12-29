const express = require('express');
const files = require('./routes/files');
const app = express();

app.use('/images', express.static(__dirname + '/uploads/images'));

app.use(express.json());
app.use('/api/files', files);

const server = app.listen(3000, () => {
    console.log('Listening on port 3000. Environment: ' + app.get('env'));
});

module.exports = server;