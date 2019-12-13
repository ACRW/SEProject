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
        host: 'tcrhub.cluster-cvjxib5qdvbb.eu-west-2.rds.amazonaws.com',
        user: 'admin',
        password: '7l2A9FnmDbOUMKFY80dH',
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
        //error
    } else {
        //
    }
});

module.exports = app;
