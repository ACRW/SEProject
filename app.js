//initialise app
const express = require('express');
const app = express();

//configure app
app.use(express.static('client'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
