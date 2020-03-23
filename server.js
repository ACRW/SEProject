// import app
const app = require('./app');

/*
// for HTTPS
const fs = require('fs');
const https = require('https');

// run server on port 8090
https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app).listen(8090);
*/

app.listen(8090);
