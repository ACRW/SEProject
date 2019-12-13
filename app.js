const express = require('express');
const app = express();

//require login code
const login = require('./login');

app.use(express.static('client'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.post('/tokensignin', async function(req, resp) {
    const token = req.body.token;
    const payload = await login(token);

    if (!payload) {
        //error
    } else {
        //
    }
});

module.exports = app;
