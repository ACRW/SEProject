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
        // return errors
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

//returns rooms large enough to house the number of guests
app.get('/roomslargeenough', async function(req, resp) {
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
});

// customers

// check customer in database
async function checkCustomerExists(customerID, resp) {
    // try to get customer's details
    try{
      const customer = await performQuery('SELECT id, fName, lName, email, phone FROM customers WHERE id = ' + customerID);

      // if no database error
      if (processQueryResult(customer, resp)) {
          // if customer in database
          if (customer.length == 1) {
              // return true
              return true
            }
            return false
          }else{
            //no matches
            return false
          }
        }catch (error) {
          console.log ('Error: ' + error);
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

// checks customer exists
app.get('/customerexists', async function(req,resp) {
    // fetch id
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

// hostel room booking
async function hostelBooking(roomID, startDate, endDate,userId, price, paid, numberOfPeople, resp) {
    // should check if free at specified times
    try{
    // insert row
    const result = await performQuery('INSERT INTO hostelBookings (roomId,startDate, endDate, userId, price, paid, noOfPeople) VALUES ('+ roomID + ', FROM_UNIXTIME(' + startDate + '), FROM_UNIXTIME(' + endDate + '),' + userId + ', ' + price + ',' + paid + ', ' + numberOfPeople + ')');

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
  }catch(error) {
    console.log ('Error: ' + error);
  }
}

// activity room booking
async function activityBooking(customerID, dateTime, activityId, price, paid, numberOfPeople, resp) {
    // should check if free at specified times
    try{
    // insert row
    const result = await performQuery('INSERT INTO activityBookings (dateTime, price, paid, activityId, userId, numberOfPeople) VALUES (FROM_UNIXTIME(' + start + '),' + price + ', ' + paid + ', ' + activityID + ', ' + customerID + ', ' + numberOfPeople + ')');

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
  }catch(error) {
    console.log ('Error: ' + error);
  }
}

// community room booking
async function communityBooking(customerID, roomID, start, end, price, paid, resp) {
    // should check if free at specified times
    try{
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
  }catch(error) {
    console.log ('Error: ' + error);
  }
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
    try{
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
      }catch (error) {
        console.log ('Error: ' + error);
      }
}

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
                try{
                if (await hostelBooking(customerID, roomID, start, end, resp)) {
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

//booking requests

app.get('/bookingrequests', async function(req,resp){

  //set up request object
  let request = {}

  //fetch all activity requests
  const activityRequests = await performQuery('SELECT r.id, r.dateTime, a.name, a.description, a.price, a.roomNeeded, c.fName, c.lName, c.email, c.phone FROM activityRequests AS r INNER JOIN customers AS c ON r.userId = c.id INNER JOIN activities AS a ON r.activityId = a.id ')

  if(processQueryResult(activityRequests, resp)){

    //fetch all community booking requests
    const communityRequests = await performQuery('SELECT r.id, r.start, r.end, r.priceOfBooking, co.name, co.description, cu.fName, cu.lName, cu.email, cu.phone  FROM communityRequest AS r INNER JOIN customers AS cu ON r.userId = cu.id INNER JOIN communityRooms AS co ON r.roomId = co.id ')

    if(processQueryResult(activityRequests, resp)){

      //fetch all hostel room bookings
      const hostelRequests = await performQuery('SELECT r.id, r.startDate, r.endDate, r.price, r.noOfPeople, hr.roomNumber, c.fName, c.lName, c.email, c.phone  FROM hostelRequests AS r INNER JOIN customers AS c ON r.userId = c.id INNER JOIN hostelRooms AS hr ON r.roomId = hr.id ')

      if(processQueryResult(hostelRequests,resp)){
        request['activity'] = activityRequests
        request['community'] = communityRequests
        request['hostel'] = hostelRequests

        resp.status(200).send(JSON.stringify(request));
      }
    }
  }

});

app.post('/approvecommunityrequest', async function(req,resp){

  const id = req.body.id;

  // where clause
  let where = '';

  where = addToSearchClause(id, 'id', where);
  // fetch request
  const request = await performQuery('SELECT * FROM communityRequest WHERE '+ where);

  // if no database error
  if (processQueryResult(request, resp)) {

    //add to booking table
    if(await communityBooking(request[0].userId, request[0].roomId, request[0].start.getTime()/1000, request[0].end.getTime()/1000, request[0].priceOfBooking, 0, resp)){

      //delete from request
      const result = await performQuery('DELETE FROM communityRequest WHERE '+ where);

      // if no database error
      if (processQueryResult(result, resp)) {
        // inform client new booking added to the database
        resp.status(201).send('success');

      } else {
        // database error
        resp.status(500).send('0database');
      }
    }else{
  console.log('Error with adding to booking table')
  }
}

});

app.post('/approveactivityrequest', async function(req,resp){

  const id = req.body.id;

  // where clause
  let where = '';

  where = addToSearchClause(id, 'id', where);
  // fetch request
  const request = await performQuery('SELECT * FROM activityRequest WHERE '+ where);

  // if no database error
  if (processQueryResult(request, resp)) {
    //add to booking table
    if(await activityBooking(request[0].userId, request[0].dateTime.getTime()/1000, request[0].activityId, request[0].price, 0, request[0].numberOfPeople, resp)){

      //delete from request
      const result = await performQuery('DELETE FROM activityRequest WHERE '+ where);

      // if no database error
      if (processQueryResult(result, resp)) {
        // inform client new booking added to the database
        resp.status(201).send('success');

      } else {
        // database error
        resp.status(500).send('0database');
      }
    }else{
  console.log('Error with adding to booking table')
  }
}

});

app.post('/approvehostelrequest', async function(req,resp){

  const id = req.body.id;

  // where clause
  let where = '';

  where = addToSearchClause(id, 'id', where);
  // fetch request
  const request = await performQuery('SELECT * FROM hostelRequest WHERE '+ where);

  // if no database error
  if (processQueryResult(request, resp)) {
    //add to booking table
    if(await hostelBooking(request[0].roomId, request[0].startDate.getTime()/1000,request[0].endDate.getTime()/1000, request[0].userId, request[0].price, 0, request[0].noOfPeople, resp)){

      //delete from request
      const result = await performQuery('DELETE FROM hostelRequest WHERE '+ where);

      // if no database error
      if (processQueryResult(result, resp)) {
        // inform client new booking added to the database
        resp.status(201).send('success');

      } else {
        // database error
        resp.status(500).send('0database');
      }
    }else{
  console.log('Error with adding to booking table')
  }
}

});

app.post('/denycommunityrequest', async function(req,resp){

  const id = req.body.id;

  // where clause
  let where = '';

  where = addToSearchClause(id, 'id', where);
  //delete from request
  const result = await performQuery('DELETE FROM communityRequest WHERE '+ where);

  // if no database error
  if (processQueryResult(result, resp)) {

    // inform client deleted successfully
    resp.status(201).send('success');
  } else {

    // database error
    resp.status(500).send('0database');
      }

});

app.post('/denyactivityrequest', async function(req,resp){

  const id = req.body.id;

  // where clause
  let where = '';

  where = addToSearchClause(id, 'id', where);
  //delete from request
  const result = await performQuery('DELETE FROM activityRequest WHERE '+ where);

  // if no database error
  if (processQueryResult(result, resp)) {

    // inform client deleted successfully
    resp.status(201).send('success');
  } else {

    // database error
    resp.status(500).send('0database');
      }

});

app.post('/denyhostelrequest', async function(req,resp){

  const id = req.body.id;

  // where clause
  let where = '';

  where = addToSearchClause(id, 'id', where);
  //delete from request
  const result = await performQuery('DELETE FROM hostelRequest WHERE '+ where);

  // if no database error
  if (processQueryResult(result, resp)) {

    // inform client deleted successfully
    resp.status(201).send('success');
  } else {

    // database error
    resp.status(500).send('0database');
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

            // if new customer
            } else {
                // get maximum customer ID
                const maxID = await performQuery('SELECT MAX(id) FROM customers');

                // if no database error
                if (processQueryResult(maxID, resp)) {
                    // new customer ID
                    let newID = 0;

                    // if previous IDs exist
                    if (maxID.length == 1) {
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
            // check phone is a number
            if (!isNaN(phone)) {
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
