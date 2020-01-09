const express = require('express');
const app = express();

//require login code
const login = require('./login');

const mysql = require('mysql');

app.use(express.static('client'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, resp) {
    let connection = mysql.createConnection({
        host: 'database-1.cvjxib5qdvbb.eu-west-2.rds.amazonaws.com',
        user: 'admin',
        password: 'zaRhur-fawbi3-ryxkax',
        port: '3306'
    });

    connection.connect(function(err) {
        if (err) {
            resp.send(err);
        } else {
            resp.send('connected');
        }
    });
});

app.post('/tokensignin', async function(req, resp) {
    const token = req.body.token;
    const payload = await login(token);

    if (!payload) {
        resp.status(403).send('failed to verify token integrity');
    } else {
        resp.status(200).send('successfully verified token integrity');
    }
});

module.exports = app;
