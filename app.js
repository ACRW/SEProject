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

// process result of query
function processQueryResult(result, response) {
    // if database error
    if (result == '0database') {
        // send response
        response.status(400).send('0database');

        // return false
        return false;
    }

    // else return true
    return true;
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
                if (processQueryResult(community, resp)) {
                    // add rooms to dictionary
                    rooms['community'] = community;
                }
            }

            // if hostel rooms requested
            if (types != 'community') {
                // get rooms
                const hostel = await performQuery('SELECT * FROM hostelRooms');

                // providing no error occurred
                if (processQueryResult(hostel, resp)) {
                    // add rooms to dictionary
                    rooms['hostel'] = hostel;
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

// get room availability
app.get('/roomavailability', async function(req, resp) {
    // room type
    const type = req.query.type;
    // room ID
    const id = req.query.id;

    // if ID specified
    if (id) {
        // check room type
        switch (type) {
            // if community room
            case 'community':
                // get room details
                const communityRoom = await performQuery('SELECT days, start, end, maxLength FROM communityRooms WHERE id = ' + id);

                // if no database error
                if (processQueryResult(communityRoom, resp)) {
                    // if room exists
                    if (communityRoom.length == 1) {
                        // room details
                        response = communityRoom[0]
                        // room ID
                        response['id'] = id;

                        // room availability
                        const availability = await performQuery('SELECT start, end FROM communityBookings WHERE id = ' + id);

                        // if no database error
                        if (processQueryResult(availability, resp)) {
                            // times at which room is busy
                            // might need to put bounds on times
                            response['busy'] = availability;

                            // send response
                            resp.status(200).send(JSON.stringify(response));
                        }


                    // room does not exist
                    } else {
                        // ID error
                        resp.status(400).send('0id');
                    }
                }

                break;

            // if hostel room
            case 'hostel':
                // get room details
                const hostelRoom = await performQuery('SELECT nights FROM hostelRooms WHERE id = ' + id);

                // if no database error
                if (processQueryResult(hostelRoom, resp)) {
                    // if room exists
                    if (hostelRoom.length == 1) {
                        // room details
                        response = hostelRoom[0]
                        // room ID
                        response['id'] = id;

                        // room availability
                        const availability = await performQuery('SELECT startDate, endDate FROM hostelBookings WHERE id = ' + id);

                        // if no database error
                        if (processQueryResult(availability, resp)) {
                            // times at which room is busy
                            // might need to put bounds on times
                            response['busy'] = availability;

                            // send response
                            resp.status(200).send(JSON.stringify(response));
                        }


                    // room does not exist
                    } else {
                        // ID error
                        resp.status(400).send('0id');
                    }
                }

                break;

            // if room type invalid
            default:
                //type error
                resp.status(400).send('0type');
        }

    } else {
        // ID error
        resp.status(400).send('0id');
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
