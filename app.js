// for GET & POST methods
const express = require('express');
const app = express();

// for session variables
const session = require('express-session');
// IMPORTANT - needs better secret
app.use(session({
    secret: 'tcrhub',
    resave: false,
    saveUninitialized: true
}));

// for Google sign in
const login = require('./login');

// for database
const util = require('util');
const mysql = require('mysql');

// for client code
app.use(express.static('client'));

// for POST methods
const bodyParser = require('body-parser');
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

// validate session
function validateSession(type, req, resp) {
    // if session active & of correct type
    if (req.session.active && req.session.type == type) {
        // valid session
        return true;
    }

    // activity error
    resp.status(403).send('0inactive');

    return false;
}

// validate session (type irrelevant)
function validateGeneralSession(req, resp) {
    // if session active
    if (req.session.active) {
        // valid session
        return true;
    }

    // activity error
    resp.status(403).send('0inactive');

    return false;
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
    // if valid session
    if (validateGeneralSession(req, resp)) {
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
    }
});

// get room availability
app.get('/roomavailability', async function(req, resp) {
    // if valid session
    if (validateGeneralSession(req, resp)) {
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
    }
});

//returns rooms large enough to house the number of guests
app.get('/roomslargeenough', async function(req, resp) {
    // if valid session
    if (validateGeneralSession(req, resp)) {
        // search parameters
        const guestNum = req.query.guestnum;

            // get matching hostel rooms
            const hostelRooms = await performQuery('SELECT * FROM hostelRooms WHERE noOfPeople >= '+ guestNum );

            // if no database error
            if (processQueryResult(hostelRooms, resp)) {
                // if matching customers found
                if (hostelRooms.length > 0) {
                    // send list of customers
                    resp.status(200).send(JSON.stringify(hostelRooms));

                } else {
                    // no matches
                    resp.status(200).send('0matches');
                }

              }
      }
});

// customers

// check customer in database
async function checkCustomerExists(customerID, resp) {
    // get customer's details
    const customer = await performQuery('SELECT id, fName, lName, email, phone FROM customers WHERE id = ' + customerID);

    // if no database error
    if (processQueryResult(customer, resp)) {
        // if customer in database
        if (customer.length == 1) {
            return true;
        }

        return false;
    }
}

// get all customers
app.get('/customers', async function(req,resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
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
    }
});

// customer search
app.get('/customersearch', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
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
    }
});

// checks customer exists
app.get('/customerexists', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
        // fetch ID
        const id = req.query.id;

        // where clause
        let where = '';

        // build search clause
        where = addToSearchClause(id, 'id', where);

        const customers = await performQuery('SELECT id, fName, lName, email, phone FROM customers WHERE ' + where );

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

//activities
app.get('/activities', async function(req,resp) {
    // fetch customers
    const activity = await performQuery('SELECT * FROM activities');

    // if no database error
    if (processQueryResult(activity, resp)) {
        // if matching customers found
        resp.status(200).send(JSON.stringify(activity));

    }
});


// bookings

app.get('/bookings', async function(req,resp) {
    let bookings = {}
    // fetch customers
    const activity = await performQuery('SELECT * FROM activityBookings');
    const hostel = await performQuery('SELECT * FROM hostelBookings');
    const community = await performQuery('SELECT * FROM communityBookings');

    // if no database error
    if (processQueryResult(community, resp)) {
        // if matching customers found
        bookings['activity'] = activity
        bookings['hostel'] = hostel
        bookings['community'] = community
        resp.status(200).send(JSON.stringify(bookings));

    }
});

// get customer bookings
async function bookings(customerID, resp) {
    // dictionary of bookings where key is booking type
    let bookings = {};

    // activity bookings
    const activity = await performQuery('SELECT b.id AS bookingID, b.dateTime, b.numberOfPeople, b.price, b.paid, a.id AS activityID, a.name, a.description FROM activityBookings b INNER JOIN activities a ON b.activityId = a.id WHERE b.userId = ' + customerID + ' ORDER BY b.dateTime');
    // community room bookings
    const community = await performQuery('SELECT b.id AS bookingID, b.start, b.end, b.priceOfBooking, b.paid, r.id AS roomID, r.name, r.description FROM communityBookings b INNER JOIN communityRooms r ON b.roomId = r.id WHERE b.userId = ' + customerID + ' ORDER BY b.start');
    // hostel room bookings
    const hostel = await performQuery('SELECT b.id AS bookingID, b.startDate, b.endDate, r.id AS roomID, r.noOfPeople, r.pricePerNight FROM hostelBookings b INNER JOIN hostelRooms r ON b.roomId = r.id WHERE b.userId = ' + customerID + ' ORDER BY b.startDate');

    // if no database errors
    if (processQueryResult(activity, resp) && processQueryResult(community, resp) && processQueryResult(hostel, resp)) {
        // if activity bookings exist
        if (activity.length > 0) {
            // add to dictionary
            bookings['activity'] = activity;
        }

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

// get customer booking requests
async function bookingRequests(customerID, resp) {
    // dictionary of booking requests where key is booking type
    let bookings = {};

    // activity booking requests
    const activity = await performQuery('SELECT b.id AS requestID, b.dateTime, b.numberOfPeople, b.price, a.id AS activityID, a.name, a.description FROM activityRequests b INNER JOIN activities a ON b.activityId = a.id WHERE b.userId = ' + customerID + ' ORDER BY b.dateTime');
    // community room booking requests
    const community = await performQuery('SELECT b.id AS requestID, b.start, b.end, b.priceOfBooking, r.id AS roomID, r.name, r.description FROM communityRequests b INNER JOIN communityRooms r ON b.roomId = r.id WHERE b.userId = ' + customerID + ' ORDER BY b.start');
    // hostel room booking requests
    const hostel = await performQuery('SELECT b.id AS requestID, b.startDate, b.endDate, r.id AS roomID, r.noOfPeople, r.pricePerNight FROM hostelRequests b INNER JOIN hostelRooms r ON b.roomId = r.id WHERE b.userId = ' + customerID + ' ORDER BY b.startDate');

    // if no database errors
    if (processQueryResult(activity, resp) && processQueryResult(community, resp) && processQueryResult(hostel, resp)) {
        // if activity booking requests exist
        if (activity.length > 0) {
            // add to dictionary
            bookings['activity'] = activity;
        }

        // if community room booking requests exist
        if (community.length > 0) {
            // add to dictionary
            bookings['community'] = community;
        }

        // if hostel room booking requests exist
        if (hostel.length > 0) {
            // add to dictionary
            bookings['hostel'] = hostel;
        }

        // if customer has made no booking requests
        if (Object.entries(bookings).length === 0) {
            // bookings error
            return '0bookings';
        }

        // return booking requests
        return JSON.stringify(bookings);
    }
}

// get bookings for specified customer
app.get('/customerbookings', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
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

            } else {
                // ID error
                resp.status(400).send('0customerID');
            }

        } else {
            // ID error
            resp.status(400).send('0customerID');
        }
    }
});

// get bookings using customer session
app.get('/mybookings', async function(req, resp) {
    // if valid customer session
    if (validateSession('customer', req, resp)) {
        // get dictionary of bookings
        const bookingsToReturn = await bookings(req.session.userID, resp);
        // send bookings
        resp.status(200).send(bookingsToReturn);
    }
});

// get booking requests using customer session
app.get('/mybookingrequests', async function(req, resp) {
    // if valid customer session
    if (validateSession('customer', req, resp)) {
        // get dictionary of booking requests
        const bookingsToReturn = await bookingRequests(req.session.userID, resp);
        // send booking requests
        resp.status(200).send(bookingsToReturn);
    }
});

// make activity booking on behalf of customer
app.post('/staffactivitybooking', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
        // customer ID
        const customerID = req.body.customerid;

        // if customer ID specified
        if (customerID) {
            // check customer exists
            if (checkCustomerExists(customerID, resp)) {
                // booking parameters
                const activityID = req.body.activityid;
                const dateTime = req.body.datetime;
                const numberOfPeople = req.body.numberofpeople;
                const price = req.body.price;
                const paid = req.body.paid;
                // if all parameters specified
                if (activityID && dateTime && numberOfPeople && price && paid) {
                    // insert row
                    const result = await performQuery('INSERT INTO activityBookings (dateTime, activityId, userId, numberOfPeople, price, paid) VALUES (FROM_UNIXTIME(' + dateTime + '), ' + activityID + ', ' + customerID + ', ' + numberOfPeople + ', ' + price + ', ' + paid + ')');

                    // if no database error
                    if (processQueryResult(result, resp)) {
                        // if correct number of rows inserted
                        if (result['affectedRows'] == 1) {
                            // booking successful
                            resp.status(200).send('1success');

                        } else {
                            // database error
                            resp.status(500).send('0database');
                        }
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
    }
});

// make activity booking using customer session
app.post('/customeractivitybooking', async function(req, resp) {
    // if valid customer session
    if (validateSession('customer', req, resp)) {
        // booking parameters
        const activityID = req.body.activityid;
        const dateTime = req.body.datetime;
        const numberOfPeople = req.body.numberofpeople;
        const price = req.body.price;

        // if all parameters specified
        if (activityID && dateTime && numberOfPeople && price) {
            // insert row
            const result = await performQuery('INSERT INTO activityRequests (dateTime, activityId, userId, numberOfPeople, price) VALUES (FROM_UNIXTIME(' + dateTime + '), ' + activityID + ', ' + req.session.userID + ', ' + numberOfPeople + ', ' + price + ')');

            // if no database error
            if (processQueryResult(result, resp)) {
                // if correct number of rows inserted
                if (result['affectedRows'] == 1) {
                    // booking successful
                    resp.status(200).send('1success');

                } else {
                    // database error
                    resp.status(500).send('0database');
                }
            }

        } else {
            // parameter error
            resp.status(400).send('0parameters');
        }
    }
});

// make community room booking on behalf of customer
app.post('/staffcommunitybooking', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
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
                    // check for clashing bookings
                    const clashes = await performQuery('SELECT * FROM communityBookings WHERE start < FROM_UNIXTIME(' + end + ') AND end > FROM_UNIXTIME(' + start + ')');

                    // if no database error
                    if (processQueryResult(clashes, resp)) {
                        // if no clashes
                        if (clashes.length == 0) {
                            // insert row
                            const result = await performQuery('INSERT INTO communityBookings (start, end, priceOfBooking, paid, roomId, userId) VALUES (FROM_UNIXTIME(' + start + '), FROM_UNIXTIME(' + end + '), ' + price + ', ' + paid + ', ' + roomID + ', ' + customerID + ')');

                            // if no database error
                            if (processQueryResult(result, resp)) {
                                // if correct number of rows inserted
                                if (result['affectedRows'] == 1) {
                                    // booking successful
                                    resp.status(200).send('1success');

                                } else {
                                    // database error
                                    resp.status(500).send('0database');
                                }
                            }

                        } else {
                            // clashing bookings error
                            resp.status(400).send('0clashes');
                        }
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
    }
});

// make community room booking using customer session
app.post('/customercommunitybooking', async function(req, resp) {
    // if active customer session
    if (validateSession('customer', req, resp)) {
        // booking parameters
        const roomID = req.body.roomid;
        const start = req.body.start;
        const end = req.body.end;
        const price = req.body.price;

        // if all parameters specified
        if (roomID && start && end && price) {
            // check for clashing bookings
            const clashes = await performQuery('(SELECT start, end FROM communityBookings WHERE start < FROM_UNIXTIME(' + end + ') AND end > FROM_UNIXTIME(' + start + ')) UNION (SELECT start, end FROM communityRequests WHERE start < FROM_UNIXTIME(' + end + ') AND end > FROM_UNIXTIME(' + start + '))');

            // if no database error
            if (processQueryResult(clashes, resp)) {
                // if no clashes
                if (clashes.length == 0) {
                    // insert row
                    const result = await performQuery('INSERT INTO communityRequests (start, end, priceOfBooking, roomId, userId) VALUES (FROM_UNIXTIME(' + start + '), FROM_UNIXTIME(' + end + '), ' + price + ', ' + roomID + ', ' + req.session.userID + ')');

                    // if no database error
                    if (processQueryResult(result, resp)) {
                        // if correct number of rows inserted
                        if (result['affectedRows'] == 1) {
                            // booking successful
                            resp.status(200).send('1success');

                        } else {
                            // database error
                            resp.status(500).send('0database');
                        }
                    }

                } else {
                    // clashing bookings error
                    resp.status(400).send('0clashes');
                }
            }

        } else {
            // parameter error
            resp.status(400).send('0parameters');
        }
    }
});

// make hostel room booking on behalf of customer
app.post('/staffhostelbooking', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
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
                const numberOfPeople = req.body.numberofpeople;

                // if all parameters specified
                if (roomID && start && end && price && paid && numberOfPeople) {
                    // check for clashing bookings
                    const clashes = await performQuery('SELECT * FROM hostelBookings WHERE startDate < FROM_UNIXTIME(' + end + ') AND endDate > FROM_UNIXTIME(' + start + ')');


                    // if no database error
                    if (processQueryResult(clashes, resp)) {
                        // if no clashes
                        if (clashes.length == 0) {
                            // insert row
                            const result = await performQuery('INSERT INTO hostelBookings (roomId, startDate, endDate, userId, price, paid, noOfPeople) VALUES ('+ roomID + ', FROM_UNIXTIME(' + start + '), FROM_UNIXTIME(' + end + '),' + customerID + ', ' + price + ',' + paid + ', ' + numberOfPeople + ')');

                            // if no database error
                            if (processQueryResult(result, resp)) {
                                // if correct number of rows inserted
                                if (result['affectedRows'] == 1) {
                                    // booking successful
                                    resp.status(200).send('1success');

                                } else {
                                    // database error
                                    resp.status(500).send('0database');
                                }
                            }

                        } else {
                            // clashing bookings error
                            resp.status(400).send('0clashes');
                        }
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
    }
});

// make community room booking using customer session
app.post('/customerhostelbooking', async function(req, resp) {
    // if valid staff session
    if (validateSession('customer', req, resp)) {
        // booking parameters
        const roomID = req.body.roomid;
        const start = req.body.start;
        const end = req.body.end;
        const price = req.body.price;
        const numberOfPeople = req.body.numberofpeople;

        // if all parameters specified
        if (roomID && start && end && price && paid && numberOfPeople) {
            // check for clashing bookings
            const clashes = await performQuery('(SELECT startDate, endDate FROM hostelBookings WHERE startDate < FROM_UNIXTIME(' + end + ') AND endDate > FROM_UNIXTIME(' + start + ')) UNION (SELECT startDate, endDate FROM hostelRequests WHERE startDate < FROM_UNIXTIME(' + end + ') AND endDate > FROM_UNIXTIME(' + start + '))');

            // if no database error
            if (processQueryResult(clashes, resp)) {
                // if no clashes
                if (clashes.length == 0) {
                    // insert row
                    const result = await performQuery('INSERT INTO hostelRequests (roomId, startDate, endDate, userId, price, noOfPeople) VALUES ('+ roomID + ', FROM_UNIXTIME(' + start + '), FROM_UNIXTIME(' + end + '),' + req.session.userID + ', ' + price + ', ' + numberOfPeople + ')');

                    // if no database error
                    if (processQueryResult(result, resp)) {
                        // if correct number of rows inserted
                        if (result['affectedRows'] == 1) {
                            // booking successful
                            resp.status(200).send('1success');

                        } else {
                            // database error
                            resp.status(500).send('0database');
                        }
                    }

                } else {
                    // clashing bookings error
                    resp.status(400).send('0clashes');
                }
            }

        } else {
            // parameter error
            resp.status(400).send('0parameters');
        }
    }
});

// hostel room booking
async function newEvent(name, description, start, capacity, tickets, resp) {
    // should check if free at specified times
    try{
    // insert row
    const result = await performQuery('INSERT INTO events (name, description, datetime, capacity) VALUES ("' + name + '", "' + description + '", FROM_UNIXTIME(' + start + '), ' + capacity + ')');

    // if no database error
    if (processQueryResult(result, resp)) {
        // if correct number of rows inserted
        if (result['affectedRows'] == 1) {
            // return true
            let where = '';

            // build search clause
            where = addToSearchClause(name, 'name', where);
            where = addToSearchClause(description, 'description', where);

            //get event id
            const id = await performQuery('SELECT id FROM events WHERE ' + where);
            eventId = JSON.stringify(id)

            //add new ticket type
            for(var i=0;i<tickets.length-1;i++){
              ticketInfo = tickets[i].split(':')
              const result = await performQuery('INSERT INTO tickets (eventId, ticketType, ticketPrice) VALUES (' + id[0].id + ', "' + ticketInfo[0] + '", ' + ticketInfo[1]+')');
            }
            return true;
        } else {
            // database error
            resp.status(500).send('0database');
        }
    }

    // return false
    return false;
  }catch (error) {
    console.log ('Error: ' + error);
  }
}





// customer hostel booking
// remove duplicated function

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

// make hostel room booking on behalf of customer
app.post('/newevent', async function(req, resp) {
    // customer ID
    const name = req.body.name;
    const description = req.body.description;
    const capacity = req.body.capacity;
    const ticketTypes = req.body.tickets;
    const tickets = ticketTypes.split(',');
    const date = req.body.date

    // if all parameters specified
    if (name && capacity && date && tickets) {
                // make booking
      try{
        if (await newEvent(name, description, date, capacity, tickets, resp)) {
                    // booking successful
          resp.status(200).send('1success');
        }
      }catch(error){
        console.log ('Error: ' + error);
      }

      } else {
        // parameter error
        resp.status(400).send('0parameters');
      }
});

//prices

app.get('/communityroomprice', async function(req,resp) {
    const id = req.query.id;
    // where clause
    let where = '';

    where = addToSearchClause(id, 'id', where);
    // fetch events
    const price = await performQuery('SELECT name, pricePerHour FROM communityRooms WHERE '+ where);

    // if no database error
    if (processQueryResult(price, resp)) {
        // if matching events found
        if (price.length > 0) {
            // send list of events
            resp.status(200).send(JSON.stringify(price));

        } else {
            // no matches
            resp.status(200).send('0matches');
        }
    }
});

//gets bookings for user that still require payment
app.get('/paymentneeded', async function(req,resp) {

    let bookings = {}
    const id = req.query.id;
    // where clause
    let where = '';

    where = addToSearchClause(id, 'userId', where);
    priceNotEq = ' AND price <> paid'

    // fetch events
    const activity = await performQuery('SELECT * FROM activityBookings WHERE '+ where + priceNotEq);

    // if no database error
    if (processQueryResult(activity, resp)) {
        // if matching events found
        bookings['activity'] = activity
    }
    priceNotEq = ' AND priceOfBooking <> paid'
    // fetch events
    const community = await performQuery('SELECT * FROM communityBookings WHERE '+ where + priceNotEq);

    // if no database error
    if (processQueryResult(community, resp)) {
        // if matching events found
        bookings['community'] = community
    }

    priceNotEq = ' AND price <> paid'

    // fetch events
    const hostel = await performQuery('SELECT * FROM hostelBookings WHERE '+ where + priceNotEq);

    // if no database error
    if (processQueryResult(hostel, resp)) {
        // if matching events found
        bookings['hostel'] = hostel
        resp.status(200).send(JSON.stringify(bookings));
    }
});

app.post('/makepayment', async function(req, resp) {
    // if valid staff session
    tableName = ''
    type = req.body.type
    id = req.body.id

    if (validateSession('staff', req, resp)) {
        // make call to approve request function
        await payForBooking(id, type, resp);
    }
});

// approve booking request
async function payForBooking(requestID, tableName, resp) {
    // if request ID specified
    let where = '';
    where = addToSearchClause(requestID, 'id', where);
    try{
    if (requestID) {
        // fetch request
        // for community & hostel - check for clashes

                // switch request type
        switch (tableName) {
            // activity request
            case 'activity':
                // create activity booking
                const activityResult = await performQuery('UPDATE activityBookings SET paid = price WHERE ' + where);
                if (processQueryResult(activityResult, resp)) {
                    // if one row inserted

                    if (result['affectedRows'] == 1) {

                      resp.status(201).send('1success');

                    } else {
                                // database error
                        resp.status(500).send('0database');
                    }

                } else {
                    // database error
                    resp.status(500).send('0database');
                }
                break;

            // community request
            case 'community':
                // create community booking
                const communityResult = await performQuery('UPDATE communityBookings SET paid = priceOfBooking WHERE ' + where);
                if (processQueryResult(communityResult, resp)) {
                    // if one row inserted
                    if (result['affectedRows'] == 1) {

                      resp.status(201).send('1success');

                    } else {
                                // database error
                        resp.status(500).send('0database');
                    }

                } else {
                    // database error
                    resp.status(500).send('0database');
                }
                break;

            // hostel request
            case 'hostel':
                // create hostel booking
                const hostelResult = await performQuery('UPDATE hostelBookings SET paid = price WHERE ' + where);
                if (processQueryResult(hostelResult, resp)) {
                    // if one row inserted
                    if (result['affectedRows'] == 1) {

                      resp.status(201).send('1success');

                    } else {
                                // database error
                        resp.status(500).send('0database');
                    }

                } else {
                    // database error
                    resp.status(500).send('0database');
                }
                break;
            }



    } else {
        // request ID error
        resp.status(400).send('0id');
    }
  }catch(error){
    resp.status(500).send('0database');
  }
}

// booking requests

// get all booking requests
app.get('/bookingrequests', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
        // requests object
        let requests = {}

        // activity requests
        const activityRequests = await performQuery('SELECT r.id, r.dateTime, a.name, a.description, a.price, a.roomNeeded, c.fName, c.lName, c.email, c.phone FROM activityRequests AS r INNER JOIN customers AS c ON r.userId = c.id INNER JOIN activities AS a ON r.activityId = a.id');

        // community requests
        const communityRequests = await performQuery('SELECT r.id, r.start, r.end, r.priceOfBooking, co.name, co.description, cu.fName, cu.lName, cu.email, cu.phone  FROM communityRequests AS r INNER JOIN customers AS cu ON r.userId = cu.id INNER JOIN communityRooms AS co ON r.roomId = co.id');

        // hostel requests
        const hostelRequests = await performQuery('SELECT r.id, r.startDate, r.endDate, r.price, r.noOfPeople, hr.roomNumber, c.fName, c.lName, c.email, c.phone  FROM hostelRequests AS r INNER JOIN customers AS c ON r.userId = c.id INNER JOIN hostelRooms AS hr ON r.roomId = hr.id');

        // if no database errors
        if (processQueryResult(activityRequests, resp) && processQueryResult(communityRequests, resp) && processQueryResult(hostelRequests, resp)) {
            // add each type to requests object
            requests['activity'] = activityRequests;
            requests['community'] = communityRequests;
            requests['hostel'] = hostelRequests;

            // send requests
            resp.status(200).send(JSON.stringify(requests));
        }
    }
});

// approve booking request
async function approveRequest(requestID, tableName, resp) {
    // if request ID specified
    if (requestID) {
        // fetch request
        const request = await performQuery('SELECT * FROM ' + tableName + 'Requests WHERE id = ' + requestID);

        // if no database error
        if (processQueryResult(request, resp)) {
            // if one row returned
            if (request.length == 1) {
                // for community & hostel - check for clashes

                // switch request type
                switch (tableName) {
                    // activity request
                    case 'activity':
                        // create activity booking
                        const result = await performQuery('INSERT INTO activityBookings (dateTime, activityId, userId, numberOfPeople, price, paid) VALUES (FROM_UNIXTIME(' + request[0].dateTime.getTime()/1000 + '), ' + request[0].activityId + ', ' + request[0].userId + ', ' + request[0].numberOfPeople + ', ' + request[0].price + ', 0)');
                        break;

                    // community request
                    case 'community':
                        // create community booking
                        const result = await performQuery('INSERT INTO communityBookings (start, end, priceOfBooking, paid, roomId, userId) VALUES (FROM_UNIXTIME(' + request[0].start.getTime()/1000 + '), FROM_UNIXTIME(' + request[0].end.getTime()/1000 + '), ' + request[0].priceOfBooking + ', 0, ' + request[0].roomId + ', ' + request[0].userId + ')');
                        break;

                    // hostel request
                    case 'hostel':
                        // create hostel booking
                        const result = await performQuery('INSERT INTO hostelBookings (roomId, startDate, endDate, userId, price, paid, noOfPeople) VALUES ('+ request[0].roomId + ', FROM_UNIXTIME(' + request[0].startDate.getTime()/1000 + '), FROM_UNIXTIME(' + request[0].endDate.getTime()/1000 + '),' + request[0].userId + ', ' + request[0].price + ', 0, ' + request[0].noOfPeople + ')');
                        break;
                }

                // if no database error
                if (processQueryResult(result, resp)) {
                    // if one row inserted
                    if (result['affectedRows'] == 1) {
                        // delete request from appropriate requests table
                        const result = await performQuery('DELETE FROM ' + tableName + 'Requests WHERE id = ' + requestID);

                        // if no database error
                        if (processQueryResult(result, resp)) {
                            // if one row deleted
                            if (result['affectedRows'] == 1) {
                                // inform client request successfully approved
                                resp.status(201).send('1success');

                            } else {
                                // database error
                                resp.status(500).send('0database');
                            }
                        }

                    } else {
                        // database error
                        resp.status(500).send('0database');
                    }
                }

            // request does not exist
            } else {
                // request error
                resp.status(400).send('0request');
            }
        }

    } else {
        // request ID error
        resp.status(400).send('0id');
    }
}

// approve activity booking request
app.post('/approveactivityrequest', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
        // make call to approve request function
        await approveRequest(req.body.id, 'activity', resp);
    }
});

// approve community booking request
app.post('/approvecommunityrequest', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
        // make call to approve request function
        await approveRequest(req.body.id, 'community', resp);
    }
});

// approve hostel booking request
app.post('/approvehostelrequest', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
        // make call to approve request function
        await approveRequest(req.body.id, 'hostel', resp);
    }
});

// deny booking request
async function denyRequest(requestID, tableName, resp) {
    // if request ID specified
    if (requestID) {
        // delete row from appropriate table
        const result = await performQuery('DELETE FROM ' + tableName + 'Requests WHERE id = ' + requestID);

        // if no database error
        if (processQueryResult(result, resp)) {
            // if one row deleted
            if (result['affectedRows'] == 1) {
                // inform client request deleted
                resp.status(200).send('1success');

            // request does not exist
            } else {
                // request error
                resp.status(400).send('0request');
            }
        }

    } else {
        // request ID error
        resp.status(400).send('0id');
    }
}

// deny community booking request
app.post('/denycommunityrequest', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
        // make call to deny request function
        await denyRequest(req.body.id, 'community', resp);
    }
});

// deny hostel booking request
app.post('/denyhostelrequest', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
        // make call to deny request function
        await denyRequest(req.body.id, 'hostel', resp);
    }
});

// deny activity booking request
app.post('/denyactivityrequest', async function(req, resp) {
    // if valid staff session
    if (validateSession('staff', req, resp)) {
        // make call to deny request function
        await denyRequest(req.body.id, 'activity', resp);
    }
});

// user accounts

// look into HTTPS

// handle staff sign in
app.post('/staffsignin', async function(req, resp) {
    // Google token
    const token = req.body.token;
    // verify token
    const payload = await login(token);

    // if verification failed
    if (!payload) {
        // token error
        resp.status(403).send('0token');

    } else {
        // Google ID
        const googleID = payload['sub'];

        // look for staff member in database
        const staff = await performQuery('SELECT * FROM staff WHERE googleId = ' + googleID);

        // if no database error
        if (processQueryResult(staff, resp)) {
            // if staff member in database
            if (staff.length == 1) {
                // refresh session
                req.session.regenerate(function(error) {
                    // if regeneration failed
                    if (error) {
                        // session error
                        resp.status(500).send('0session');

                    } else {
                        // set session variables
                        req.session.active = true;
                        req.session.type = 'staff';
                        req.session.userID = staff[0]['id'];

                        // name
                        const staffMemberDetails = {'fname': staff[0]['fName'], 'sname': staff[0]['lName']};

                        // send name
                        resp.status(200).send(JSON.stringify(staffMemberDetails));
                    }
                });

            // if access denied
            } else {
                // permission error
                resp.status(403).send('0permission');
            }
        }
    }
});

// new staff member
app.post('/newstaffmember', async function(req, resp) {
    // if staff session active
    if (req.session.active && req.session.type == 'staff') {
        // Google token
        const token = req.body.token;
        // verify token
        const payload = await login(token);

        // if verification failed
        if (!payload) {
            // token error
            resp.status(403).send('0token');

        } else {
            // Google ID
            const googleID = payload['sub'];

            // look for staff member in database
            const staff = await performQuery('SELECT * FROM staff WHERE googleId = ' + googleID);

            // if no database error
            if (processQueryResult(staff, resp)) {
                // if staff member not in database
                if (staff.length == 0) {
                    // get maximum staff ID
                    const maxID = await performQuery('SELECT MAX(id) FROM staff');

                    // if no database error
                    if (processQueryResult(maxID, resp)) {
                        // new staff ID
                        let newID = 0;

                        // if previous IDs exist
                        if (maxID[0]['MAX(id)'] != null) {
                            // increment staff ID
                            newID = parseInt(maxID[0]['MAX(id)']) + 1;
                        }

                        // add staff member to database
                        const result = await performQuery('INSERT INTO staff (id, fName, lName, googleId, email) VALUES (' + newID + ', "' + payload['given_name'] + '", "' + payload['family_name'] + '", "' + googleID + '", "' + payload['email'] + '")');

                        // if no database error
                        if (processQueryResult(result, resp)) {
                            // if one row inserted
                            if (result['affectedRows'] == 1) {
                                // name of new staff member
                                const staffMemberDetails = {'fname': payload['given_name'], 'sname': payload['family_name']};

                                // return name to client
                                resp.status(200).send(JSON.stringify(staffMemberDetails));

                            } else {
                                // database error
                                resp.status(500).send('0database');
                            }
                        }
                    }

                // staff member already registered
                } else {
                    // staff member error
                    resp.status(400).send('0staff');
                }
            }
        }
    } else {
        // permission error
        resp.status(403).send('0permission');
    }
});

// handle customer sign in
app.post('/customersignin', async function(req, resp) {
    // Google token
    const token = req.body.token;
    // verify token
    const payload = await login(token);

    // if verification failed
    if (!payload) {
        // token error
        resp.status(403).send('0token');

    } else {
        // customer's Google ID
        const googleID = payload['sub'];

        // look for customer in database
        const customer = await performQuery('SELECT * FROM customers WHERE googleId = ' + googleID);

        // if no database error
        if (processQueryResult(customer, resp)) {
            // if customer in database
            if (customer.length == 1) {
                // if customer has provided extra information
                if (customer[0].phone) {
                    // refresh session
                    req.session.regenerate(function(error) {
                        // if regeneration failed
                        if (error) {
                            // session error
                            resp.status(500).send('0session');

                        } else {
                            // set session variables
                            req.session.active = true;
                            req.session.type = 'customer';
                            req.session.userID = customer[0]['id'];

                            // customer's name
                            const customerDetails = {'fname': customer[0]['fName'], 'sname': customer[0]['lName']};

                            // send customer's name
                            resp.status(200).send(JSON.stringify(customerDetails));
                        }
                    });

                // customer previously bypassed request for futher information
                } else {
                    // treat as new customer
                    resp.status(201).send(JSON.stringify(customer[0].id));
                }

            // if new customer
            } else {
                // get maximum customer ID
                const maxID = await performQuery('SELECT MAX(id) FROM customers');

                // if no database error
                if (processQueryResult(maxID, resp)) {
                    // new customer ID
                    let newID = 0;

                    // if previous IDs exist
                    if (maxID[0]['MAX(id)'] != null) {
                        // increment customer ID
                        newID = parseInt(maxID[0]['MAX(id)']) + 1;
                    }

                    // add customer to database
                    const result = await performQuery('INSERT INTO customers (id, fName, lName, googleId, email) VALUES (' + newID + ', "' + payload['given_name'] + '", "' + payload['family_name'] + '", "' + googleID + '", "' + payload['email'] + '")');

                    // if no database error
                    if (processQueryResult(result, resp)) {
                        // if one row inserted
                        if (result['affectedRows'] == 1) {
                            // inform client new customer added to database
                            resp.status(201).send(JSON.stringify(newID));

                        } else {
                            // database error
                            resp.status(500).send('0database');
                        }
                    }
                }
            }
        }
    }
});

// receive further information for new customer
app.post('/newcustomer', async function(req, resp) {
    // customer ID
    const customerID = req.body.customerid;

    // if customer ID specified
    if (customerID) {
        // phone number
        const phone = req.body.phone;

        // if phone number specified
        if (phone) {
            // regular expression for phone number
            const phoneRegex = RegExp(/^[0-9]{3,6} {0,1}[0-9]{4,8}$/);

            // if phone number matches regular expression
            if (phoneRegex.test(phone)) {
                // update database
                const result = await performQuery('UPDATE customers SET phone = "' + phone + '" WHERE id = ' + customerID);

                // if no database error
                if (processQueryResult(result, resp)) {
                    // if one row inserted
                    if (result['affectedRows'] == 1) {
                        // get customer's name
                        const customer = await performQuery('SELECT fName, lName FROM customers WHERE id = ' + customerID);

                        // if no database error
                        if (processQueryResult(customer, resp)) {
                            // customer's name
                            const customerDetails = {'fname': customer[0]['fName'], 'sname': customer[0]['lName']};

                            // refresh session
                            req.session.regenerate(function(error) {
                                // if regeneration failed
                                if (error) {
                                    // session error
                                    resp.status(500).send('0session');

                                } else {
                                    // set session variables
                                    req.session.active = true;
                                    req.session.type = 'customer';
                                    req.session.userID = customerID;

                                    // send customer's name
                                    resp.status(200).send(JSON.stringify(customerDetails));
                                }
                            });
                        }

                    // customer not in database
                    } else {
                        // customer ID error
                        resp.status(400).send('0customerID');
                    }
                }
            } else {
                // phone number error
                resp.status(400).send('0phone');
            }
        } else {
            // phone number error
            resp.status(400).send('0phone');
        }
    } else {
        // customer ID error
        resp.status(400).send('0customerID');
    }
});

// sign user out
app.post('/signout', async function(req, resp) {
    // if user active
    if (req.session.active) {
        // destroy session
        req.session.destroy(function(error) {
            // if destruction failed
            if (error) {
                // session error
                resp.status(500).send('0session');

            } else {
                // success message
                resp.status(200).send('1success');
            }
        });

    } else {
        // activity error
        resp.status(403).send('0inactive');
    }
});

// current user
app.get('/currentuser', async function(req, resp) {
    // if session active
    if (req.session.active) {
        // session information
        const sessionInformation = {'type': req.session.type, 'userID': req.session.userID};

        // send session information
        resp.status(200).send(JSON.stringify(sessionInformation));

    } else {
        // activity error
        resp.status(403).send('0inactive');
    }
});

module.exports = app;
