const express = require('express');
const app = express();

//require login code
const login = require('./login');

const util = require('util');
const mysql = require('mysql');

app.use(express.static('client'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// configure the database
function makeDatabase() {
    // connection details
    const connection = mysql.createConnection({
        host: 'database-1.cvjxib5qdvbb.eu-west-2.rds.amazonaws.com',
        user: 'admin',
        password: 'zaRhur-fawbi3-ryxkax',
        port: '3306',
        database: 'tcr_hub'
    });

    return {
        query(sql, args) {
            // execute query
            return util.promisify(connection.query).call(connection, sql, args);
        },
        close() {
            // disconnect database
            return util.promisify(connection.end).call(connection);
        }
    };
}

// perform a database query
async function performQuery(query) {
    // configure database
    const db = makeDatabase();

    try {
        // execute query
        return result = await db.query(query);
    // if query fails
    } catch (err) {
        // return error
        return '0database';
    } finally {
        // disconnect databse
        await db.close();
    }
}

// get rooms
app.get('/rooms', async function(req, resp) {
    // room types
    const types = req.query.types;
    // whether rooms must be bookable
    const bookable = req.query.bookable;

    // if types specified
    if (types) {
        //deal with bookable later

        // if types valid
        if (['community', 'hostel', 'both'].includes(types)) {
            // dictionary of rooms
            let rooms = {};

            // if community rooms requested
            if (types != 'hostel') {
                // get rooms
                const community = await performQuery('SELECT * FROM communityRooms');

                // providing no error occurred
                if (community != '0database') {
                    // add rooms to dictionary
                    rooms['community'] = community;
                } else {
                    // database error
                    resp.status(400).send('0database');
                }
            }

            // if hostel rooms requested
            if (types != 'community') {
                // get rooms
                const hostel = await performQuery('SELECT * FROM hostelRooms');

                // providing no error occurred
                if (hostel != '0database') {
                    // add rooms to dictionary
                    rooms['hostel'] = hostel;
                } else {
                    // database error
                    resp.status(400).send('0database');
                }
            }

            // return rooms
            resp.status(200).send(JSON.stringify(rooms));
            
        } else {
            // types error
            resp.status(400).send('0types');
        }

    } else {
        // types error
        resp.status(400).send('0types');
    }
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
