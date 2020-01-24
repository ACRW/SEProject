const express = require('express');
const app = express();

//require login code
const login = require('./login');

const util = require('util');
const mysql = require('mysql');

app.use(express.static('client'));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// helper functions

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
        response.status(500).send('0database');

        // return false
        return false;
    }

    // else return true
    return true;
}

// add parameter to search clause
function addToSearchClause(parameter, field, whereClause) {
    // if parameter defined
    if (parameter) {
        // if necessary
        if (whereClause.length > 0) {
            // add 'AND' to clause
            whereClause += ' AND ';
        }

        // add parameter
        whereClause += field + ' LIKE "%' + parameter + '%"';
    }

    // return search clause
    return whereClause;
}

// rooms

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
                        const availability = await performQuery('SELECT start, end FROM communityBookings WHERE UNIX_TIMESTAMP(start) >= ' + ((new Date).getTime()) / 1000 + ' AND roomId = ' + id);

                        // if no database error
                        if (processQueryResult(availability, resp)) {
                            // times at which room is busy
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
                        const availability = await performQuery('SELECT startDate, endDate FROM hostelBookings WHERE UNIX_TIMESTAMP(startDate) >= ' + ((new Date).getTime()) / 1000 + ' AND roomId = ' + id);

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

// customers

// check customer in database
async function checkCustomerExists(customerID, resp) {
    // try to get customer's details
    const customer = await performQuery('SELECT id, fName, lName, email, phone FROM customers WHERE id = ' + customerID);

    // if no database error
    if (processQueryResult(customer, resp)) {
        // if customer in database
        if (customer.length == 1) {
            // return true
            return true;
        }

        // ID error
        resp.status(400).send('0customerID');

        // return false
        return false;
    }
}

// get all customers
app.get('/customers', async function(req,resp) {
    // fetch customers
    const customers = await performQuery('SELECT id, fName, lName, email, phone FROM customers');

    // if no database error
    if (processQueryResult(customers, resp)) {
        // if matching customers found
        if (customers.length > 0) {
            // send list of customers
            resp.status(200).send(JSON.stringify(customers));

        } else {
            // no matches
            resp.status(200).send('0matches');
        }
    }
});

// customer search
app.get('/customersearch', async function(req, resp) {
    // need authentication here
    // look into session variables

    // search parameters
    const id = req.query.id;
    const fname = req.query.fname;
    const sname = req.query.sname;
    const email = req.query.email;
    const phone = req.query.phone;

    // where clause
    let where = '';

    // build search clause
    where = addToSearchClause(id, 'id', where);
    where = addToSearchClause(fname, 'fName', where);
    where = addToSearchClause(sname, 'lName', where);
    where = addToSearchClause(email, 'email', where);
    where = addToSearchClause(phone, 'phone', where);

    // if no parameters specified
    if (where.length == 0) {
        // parameter error
        resp.status(400).send('0parameters');

    } else {
        // get matching customers
        const customers = await performQuery('SELECT id, fName, lName, email, phone FROM customers WHERE ' + where + ' ORDER BY lName, fName');

        // if no database error
        if (processQueryResult(customers, resp)) {
            // if matching customers found
            if (customers.length > 0) {
                // send list of customers
                resp.status(200).send(JSON.stringify(customers));

            } else {
                // no matches
                resp.status(200).send('0matches');
            }
        }
    }
});

// bookings

// get customer bookings
async function bookings(customerID, resp) {
    // dictionary of bookings where key is booking type
    let bookings = {};

    // need to add activity bookings

    // community room bookings
    const community = await performQuery('SELECT b.id AS bookingID, b.start, b.end, b.priceOfBooking, b.paid, r.id AS roomID, r.name, r.description FROM communityBookings b INNER JOIN communityRooms r ON b.roomId = r.id WHERE b.userId = ' + customerID + ' ORDER BY b.start');
    // hostel room bookings
    const hostel = await performQuery('SELECT b.id AS bookingID, b.startDate, b.endDate, r.id AS roomID, r.noOfPeople, r.pricePerNight FROM hostelBookings b INNER JOIN hostelRooms r ON b.roomId = r.id WHERE b.userId = ' + customerID + ' ORDER BY b.startDate');

    // if no database errors
    if (processQueryResult(community, resp) && processQueryResult(hostel, resp)) {
        // if community room bookings exist
        if (community.length > 0) {
            // add to dictionary
            bookings['community'] = community;
        }

        // if hostel room bookings exist
        if (hostel.length > 0) {
            // add to dictionary
            bookings['hostel'] = hostel;
        }

        // if customer has made no bookings
        if (Object.entries(bookings).length === 0) {
            // bookings error
            return '0bookings';
        }

        // return bookings
        return JSON.stringify(bookings);
    }
}

// get bookings for specified customer
app.get('/customerbookings', async function(req, resp) {
    // customer ID
    const customerID = req.query.id;

    // if ID specified
    if (customerID) {
        // check customer exists
        if (await checkCustomerExists(customerID, resp)) {
            // get dictionary of bookings
            const bookingsToReturn = await bookings(customerID, resp);
            // send bookings
            resp.status(200).send(bookingsToReturn);
        }

    } else {
        // ID error
        resp.status(400).send('0customerID');
    }
});

// community room booking
async function communityBooking(customerID, roomID, start, end, price, paid, resp) {
    // should check if free at specified times

    // insert row
    const result = await performQuery('INSERT INTO communityBookings (start, end, priceOfBooking, paid, roomId, userId) VALUES (FROM_UNIXTIME(' + start + '), FROM_UNIXTIME(' + end + '), ' + price + ', ' + paid + ', ' + roomID + ', ' + customerID + ')');

    // if no database error
    if (processQueryResult(result, resp)) {
        // if correct number of rows inserted
        if (result['affectedRows'] == 1) {
            // return true
            return true;

        } else {
            // database error
            resp.status(500).send('0database');
        }
    }

    // return false
    return false;
}

// make community room booking on behalf of customer
app.post('/staffcommunitybooking', async function(req, resp) {
    // customer ID
    const customerID = req.body.customerid;

    // if customer ID specified
    if (customerID) {
        // check customer exists
        if (checkCustomerExists(customerID, resp)) {
            // booking parameters
            const roomID = req.body.roomid;
            const start = req.body.start;
            const end = req.body.end;
            const price = req.body.price;
            const paid = req.body.paid;

            // if all parameters specified
            if (roomID && start && end && price && paid) {
                // make booking
                if (await communityBooking(customerID, roomID, start, end, price, paid, resp)) {
                    // booking successful
                    resp.status(200).send('1success');
                }

            } else {
                // parameter error
                resp.status(400).send('0parameters');
            }
        }

    } else {
        // customer ID error
        resp.status(400).send('0customerID');
    }
});

// hostel room booking
async function hostelBooking(customerID, roomID, start, end, resp) {
    // should check if free at specified times

    // insert row
    const result = await performQuery('INSERT INTO hostelBookings (roomID, startDate, endDate, userId) VALUES (' + roomID + ', FROM_UNIXTIME(' + start + '), FROM_UNIXTIME(' + end + '), ' + customerID + ')');

    // if no database error
    if (processQueryResult(result, resp)) {
        // if correct number of rows inserted
        if (result['affectedRows'] == 1) {
            // return true
            return true;

        } else {
            // database error
            resp.status(500).send('0database');
        }
    }

    // return false
    return false;
}

// make hostel room booking on behalf of customer
app.post('/staffhostelbooking', async function(req, resp) {
    // customer ID
    const customerID = req.body.customerid;

    // if customer ID specified
    if (customerID) {
        // check customer exists
        if (checkCustomerExists(customerID, resp)) {
            // booking parameters
            const roomID = req.body.roomid;
            const start = req.body.start;
            const end = req.body.end;

            // if all parameters specified
            if (roomID && start && end) {
                // make booking
                if (await hostelBooking(customerID, roomID, start, end, resp)) {
                    // booking successful
                    resp.status(200).send('1success');
                }

            } else {
                // parameter error
                resp.status(400).send('0parameters');
            }
        }

    } else {
        // customer ID error
        resp.status(400).send('0customerID');
    }
});

// cancel booking
app.post('/cancelbooking', async function(req, resp) {
    // booking type
    const type = req.body.type;
    // booking ID
    const bookingID = req.body.id;

    // if booking ID specified
    if (bookingID) {
        // if type valid
        if (['community', 'hostel'].includes(type)) {
            // cancel booking
            const result = await performQuery('DELETE FROM ' + type + 'Bookings' + ' WHERE id = ' + bookingID);

            // if no database error
            if (processQueryResult(result, resp)) {
                // if one row deleted
                if (result['affectedRows'] == 1) {
                    // successful cancellation
                    resp.status(200).send('1success');

                // booking does not exist
                } else {
                    // booking error
                    resp.status(400).send('0booking');
                }
            }

        } else {
            // type error
            resp.status(400).send('0type');
        }

    } else {
        // booking ID error
        resp.status(400).send('0id');
    }
});

// need function to update booking e.g. due to payment

// events

// get all events
app.get('/events', async function(req,resp) {
    // fetch events
    const events = await performQuery('SELECT * FROM events');

    // if no database error
    if (processQueryResult(events, resp)) {
        // if matching events found
        if (events.length > 0) {
            // send list of events
            resp.status(200).send(JSON.stringify(events));

        } else {
            // no matches
            resp.status(200).send('0matches');
        }
    }
});

// event search
app.get('/eventsearch', async function(req, resp) {
    // search parameters
    const id = req.query.id;
    const name = req.query.name;
    const date = req.query.date;

    // where clause
    let where = '';

    // build search clause
    where = addToSearchClause(id, 'id', where);
    where = addToSearchClause(name, 'name', where);
    where = addToSearchClause(date, 'datetime', where);

    // if no parameters specified
    if (where.length == 0) {
        // parameter error
        resp.status(400).send('0parameters');

    } else {
        // get matching events
        const events = await performQuery('SELECT * FROM events WHERE ' + where + ' ORDER BY name');

        // if no database error
        if (processQueryResult(events, resp)) {
            // if matching customers found
            if (events.length > 0) {
                // send list of events
                resp.status(200).send(JSON.stringify(events));

            } else {
                // no matches
                resp.status(200).send('0matches');
            }
        }
    }
});

app.get('/eventstatistics', async function(req, resp) {
    // search parameters
    const id = req.query.id;


    // where clause
    let where = '';

    // build search clause
    where = addToSearchClause(id, 'e.id', where);

    // if no parameters specified
    if (where.length == 0) {
        // parameter error
        resp.status(400).send('0parameters');

    } else {
        // get matching events
        const stats = await performQuery('SELECT e.name, e.description, e.capacity, e.datetime, SUM(ts.noOfTickets) AS numSold FROM events e INNER JOIN ticketsSold ts ON e.id = ts.eventId WHERE ' + where)

        // if no database error
        if (processQueryResult(stats, resp)) {
            // if matching customers found
            if (stats.length > 0) {
                // send list of events
                resp.status(200).send(JSON.stringify(stats));

            } else {
                // no matches
                resp.status(200).send('0matches');
            }
        }
    }
});

app.post('/customersignin', async function(req, resp) {
    const token = req.body.token;
    const payload = await login(token);

    if (!payload) {
        resp.status(403).send('0token');
    } else {
        const googleID = payload['sub'];

        const customer = await performQuery('SELECT * FROM customers WHERE googleId = ' + googleID);

        if (processQueryResult(customer, resp)) {
            if (customer.length == 1) {
                console.log('exists')
            } else {
                const maxID = await performQuery('SELECT MAX(id) FROM customers');

                if (processQueryResult(maxID, resp)) {
                    if (maxID.length == 1) {
                        const newID = parseInt(maxID[0]['MAX(id)']) + 1;
                    } else {
                        const newID = 0;
                    }

                    const result = await performQuery('INSERT INTO customers (id, fName, lName, googleId, email) VALUES (' + newID + ', "' + payload['given_name'] + '", "' + payload['family_name'] + '", "' + googleID + '", "' + payload['email'] + '")');

                    if (processQueryResult(result, resp)) {
                        if (result['affectedRows'] == 1) {
                            // new customer
                            // prompt phone number and ... ?

                        } else {
                            resp.status(500).send('0database');
                        }
                    }
                }
            }
        }

        resp.status(200).send('successfully verified token integrity');
    }
});

module.exports = app;
