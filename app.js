const express = require('express');
const app = express();

app.use(express.static('client'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

module.exports = app;
