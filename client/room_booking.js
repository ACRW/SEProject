const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
const hostAddr = "localhost";
const hostPort = "8090";
let rooms = {};

function mod(n, m) { // Because javascript mod % is broken
  return ((n % m) + m) % m;
}

async function getRooms(startDate, endDate) { // Need to add error handling at some point.
  let response = await fetch('http://' + hostAddr + ":" + hostPort + '/rooms?types=community', {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  let roomsArray = await response.json();
  for (let i = 0; i < roomsArray["community"].length; i++) {
    rooms[roomsArray["community"][i]["id"]] = roomsArray["community"][i];
  }
}

async function updateRooms() {
  await getRooms();
  roomDrop = document.getElementById("roomDrop");
  for (var id in rooms) {
    let option = document.createElement("option");
    option.text = rooms[id]["name"];
    option.value = id;
    roomDrop.add(option);
  }
}

window.addEventListener('DOMContentLoaded', async function() {
    // make call to API
    let response = await fetch('/currentuser',
    {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    // if not signed in
    if (response.status == 403) {
        // alert user
        alert('Oh hello there! We\'ve noticed you\'re not currently signed in, so do close this message to be redirected to the Customer Sign In page.');
        // redirect to sign in page
        window.location.pathname = '/customersignin.html';

    } else {
        // parse response body
        const body = JSON.parse(await response.text());

        // if signed in as staff member
        if (body.type == 'staff') {
            // alert user
            alert('Oh hello there! We\'ve noticed a staff member is currently signed in on your computer, so do ask them to sign out, then close this message to be redirected to the Customer Sign In page.');
            // redirect to sign in page
            window.location.pathname = '/customersignin.html';
        }
    }

    updateRooms();
});


function Calender () { // Calender constructor/class
  const cellColor = "#F2F2F2";
  const cellColorOdd = "#FFFFFF";
  const oldColor = "#DDDDDD"; // Color of old/greyed out cells
  const oldColorOdd = "#EEEEEE";
  const snapHeight = 25; // Height of calender rows
  const cellHeight = 50;

  let targetMon = new Date(); // Date of the monday of the week being looked at, date initilizes as current date
  let targetSun = new Date(); // Date of the sunday of the week being looked at (end of week)
  let prevBut = document.getElementById("prevBut");
  let thisWeek = true; // Determintes weather or not on this week.
  let today = new Date(); // Stores the value date of today a week ago.
  let firstSun = new Date();
  let table = document.getElementById("calTable");
  let eTable = document.getElementById("eventTable");
  let bookings = []; // Keeps a list of all bookings
  let curRoom = -1; // The id of the room that is currently selected, for conveniance.
  let peekElement = document.createElement("div");
  let tableDims = table.getBoundingClientRect();
  let colWidth = tableDims.width * 0.13; // Width of the columns
  let paymentTable = document.getElementById("paymentTable");
  let userBooking = {
    "placed": false, // Keeps track of whether it is place or not, such as if a change of room, or simply hasnt been placed yet.
    "element": document.createElement("div"),
    "startTime": -1,
    "endTime": -1,
    "bookingLength": 60,
    "price": -1
  }; // Bookings added by user.

  // Set up everything
  peekElement.className = "peekGraphic newColor";
  peekElement.style.width = String(tableDims.width * 0.11) + "px"
  peekElement.style.height = String((userBooking["bookingLength"]/60) * cellHeight) + "px";
  peekElement.style.visibility = "hidden";
  eTable.rows[0].cells[1].appendChild(peekElement);
  userBooking["element"].className = "peekGraphic newColor";
  userBooking["element"].style.width = String(tableDims.width * 0.11) + "px";
  userBooking["element"].style.height = String((userBooking["bookingLength"]/60) * 50) + "px";
  userBooking["element"].innerHTML = "<p>Dom Newman </p>";
  targetSun.setHours(23, 59, 59, 0);
  targetMon.setHours(0, 0, 0, 0);
  if (targetMon.getDay() != 1) { // Only changes date if not already a monday
    targetMon.setDate(targetMon.getDate() - ((targetMon.getDay() - 1) % 7)); // Changes to last monday
  }

  targetSun.setDate(targetMon.getDate() + 6); // Sets the sunday of the week (conveniant to have, also, actually sets the next monday to prevent issues with comparisons)
  firstSun.setTime(targetSun.getTime());

  let displayDates = async function() { // Displays/updates the dates above the calender
    let tempDate = new Date(targetMon);
    tempDate.setDate(tempDate.getDate() + 6);
    document.getElementById("tableDate").innerHTML = monthNames[targetMon.getMonth()] + " " + targetMon.getDate() + " - " + monthNames[tempDate.getMonth()] + " " + tempDate.getDate();
    headers = table.rows[0];
    for (i = 0; i < 7; i++) {
      newDate = new Date(targetMon);
      newDate.setDate(newDate.getDate() + i);
      headers.cells[i + 1].innerHTML = dayNames[i] + " " + newDate.getDate();
    }
  }

  let clearCalender = function () { // Clears all the contents of the calender to prevent them 'building up'.
    for (c = 1; c < table.rows[0].cells.length; c++) {
      let target = eTable.rows[0].cells[c];
      while (target.firstChild) {
        target.removeChild(target.firstChild);
      }
    }

    eTable.rows[0].cells[1].appendChild(peekElement); // Redisplay booking peek
  }

  let hideOldColumns = async function () { // Greys out columns in the past
    for (let i = 1; i < table.rows[0].cells.length; i++) {
      let tarDayDate = new Date(); // The ith day of the week from monday.
      tarDayDate.setTime(targetMon.getTime());
      tarDayDate.setDate(tarDayDate.getDate() + i);
      if (tarDayDate < today){
        for (let y = 1; y < table.rows.length; y++) {
          if (y % 2) {
            table.rows[y].cells[i].style.backgroundColor = oldColor;
          } else {
            table.rows[y].cells[i].style.backgroundColor = oldColorOdd;
          }
        }
      } else {
        for (let y = 1; y < table.rows.length; y++) {
          if (y % 2) {
            table.rows[y].cells[i].style.backgroundColor = cellColor;
          } else {
            table.rows[y].cells[i].style.backgroundColor = cellColorOdd;
          }
        }
      }
    }
  }

  let displayBookings = async function () { // Displays all the bookings on the calender
    clearCalender();
    if (userBooking["placed"]) bookings.push(userBooking);
    for (i = 0; i < bookings.length; i++) {
      if (bookings[i]["startTime"] <= targetMon || bookings[i]["startTime"] >= targetSun) {
        continue; // Continues if booking is not in this week.
      }
      let startCell = eTable.rows[0].cells[mod(bookings[i]["startTime"].getDay() - 1, 7) + 1];
      if (bookings[i]["element"] == null) {
        let bookingGraphic = document.createElement("div");
        bookingGraphic.className = "bookingGraphic newColor";
        bookingGraphic.style.top = String(((bookings[i]["startTime"].getHours() - 9) * cellHeight) + cellHeight) + "px";
        bookingGraphic.style.height = String(bookings[i]["bookingLength"] * cellHeight) + "px";
        bookings[i]["element"] = bookingGraphic;
        bookings[i]["element"].innerHTML = "<p>Booked <br>" +
          String(bookings[i]["startTime"].getHours()).padStart(2, '0') + ":" +
          String(bookings[i]["startTime"].getMinutes()).padStart(2, '0') + " - " +
          String(bookings[i]["endTime"].getHours()).padStart(2, '0') + ":" +
          String(bookings[i]["endTime"].getMinutes()).padStart(2, '0') + "</p>";
      }
      startCell.appendChild(bookings[i]["element"]);
    }
    if (userBooking["placed"]) bookings.pop(); // DOnt want to have a user booking get lost in the list of bookings.
  }

  let hidePrev = async function() { // Hides the previous button if on the current week.
    if (targetMon < firstSun) {
      prevBut.style.visibility = "hidden";
      thisWeek = true;

    } else {
      prevBut.style.visibility = "visible";
      thisWeek = false;
    }
  }

  let updPayTable = async function() {
    if (curRoom != "-1") {
      if (userBooking["placed"]) {
        paymentTable.rows[1].cells[0].innerHTML = rooms[curRoom]["name"];
        paymentTable.rows[1].cells[1].innerHTML = "£" + String(rooms[curRoom]["pricePerHour"]);
        paymentTable.rows[1].cells[2].innerHTML = "£" + String(userBooking["price"]);
      } else {
        paymentTable.rows[1].cells[0].innerHTML = "--";
        paymentTable.rows[1].cells[1].innerHTML = "--";
        paymentTable.rows[1].cells[2].innerHTML = "--";
      }
    }
  }

  let getBookings = async function(roomID) { // Gets the bookings and formats them nicely
    if (roomID == -1) {
      return;
    }
    let response = await fetch('http://' + hostAddr + ":" + hostPort + '/roomavailability?type=community&id=' + roomID, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    let availability = await response.json();
    rawBookings = availability["busy"];
    bookings = []; // Reset bookings
    for (i = 0; i < rawBookings.length; i++) {
      let ss = rawBookings[i]["start"].split(/[- :TZ]/);
      let es = rawBookings[i]["end"].split(/[- :TZ]/);
      let startTime = new Date(Date.UTC(ss[0], ss[1] - 1, ss[2], ss[3], ss[4], 0));
      let endTime = new Date(Date.UTC(es[0], es[1] - 1, es[2], es[3], es[4], 0));
      let bookingLength = (endTime.getHours() - startTime.getHours()) + (endTime.getMinutes() - startTime.getMinutes()) / 60;
      bookings.push({
        "startTime": startTime,
        "endTime": endTime,
        "bookingLength": bookingLength,
        "element": null
      });
    }
  }

  let unplaceBooking = async function () {
    userBooking["placed"] = false;
    updPayTable(); // update the pay table to reflect that the booking is no long valid in the context
  }

  this.changeRoom = async function () { // Called when the room is changed
    unplaceBooking();
    tableDims = table.getBoundingClientRect();
    curRoom = document.getElementById("roomDrop").value;
    await getBookings(curRoom);
    displayBookings();
    if (curRoom != -1) {
      document.getElementById("roomDesc").innerHTML = rooms[curRoom]["description"];
    } else {
      document.getElementById("roomDesc").innerHTML = "";
    }
  }

  this.leaveMouse = function () {
    //peekElement.style.visibility = "hidden";
  }

  this.mouseEnter = function () {
    peekElement.style.visibility = "visible";
  }

  this.bookingPeek = async function (e) { // Displays a potential booking over where the mouse hovers.
    tableDims = table.getBoundingClientRect();
    colWidth = tableDims.width * 0.13;
    let calX = tableDims.left;
    let calY = tableDims.top; // Distance of top left corner of calender from the top left corner of the browser.
    let leftCol = eTable.rows[0].cells[0].offsetWidth + calX; // pos of left column
    let topRow = table.rows[0].offsetHeight + calY; // pos of top row
    let botRow = tableDims.bottom - (parseInt(peekElement.style.height) - 25);
    if (e.clientX > leftCol && e.clientY > topRow) { // Checks in table
      let curColumn = Math.floor((e.clientX - leftCol) / colWidth);
      let curRow = Math.floor((e.clientY - topRow) / snapHeight);
      let lowestRow = (table.rows.length - 1 - userBooking["bookingLength"]/60) * cellHeight/snapHeight;
      curRow = Math.min(lowestRow, curRow); // Prevents going below the lowest row, but still allows element to be placed when mouse below it.
      peekElement.style.top = String((curRow * snapHeight) + cellHeight) + "px";
      peekElement.style.left = String((curColumn * colWidth)) + "px";
    }
  }

  this.placeBooking = async function (e) {
    if (curRoom == -1) {
      alert("Please select a room first. ")
      return;
    }
    let calX = tableDims.left;
    let calY = tableDims.top;
    let leftCol = eTable.rows[0].cells[0].offsetWidth + calX; // pos of left column
    let topRow = table.rows[0].offsetHeight + calY; // pos of top
    if (e.clientX > leftCol && e.clientY > topRow) {
      let curRow = Math.floor((e.clientY - topRow) / snapHeight);
      let lowestRow = (table.rows.length - 1 - userBooking["bookingLength"]/60) * cellHeight/snapHeight;
      let endTime = new Date();
      let curColumn = Math.floor((e.clientX - leftCol) / colWidth);
      let selectedDate = new Date(targetMon);

      curRow = Math.min(lowestRow, curRow); // Prevents going below the lowest row, but still allows element to be placed when mouse below it.
      selectedDate.setDate(targetMon.getDate() + curColumn); // Calculate the date they the thing starts
      selectedDate.setHours(9 + Math.floor(curRow / (cellHeight/snapHeight)));
      selectedDate.setMinutes((curRow % (cellHeight/snapHeight) * (60 / (cellHeight/snapHeight)))); // Designed to allow snapHeight to be modified easily
      if (selectedDate < Date.now()) {
        alert("Cannot book in the past. ");
        return;
      }
      endTime.setTime(selectedDate.getTime()); // Calculate dat ethat the thing ends
      endTime.setMinutes(endTime.getMinutes() + parseInt(userBooking["bookingLength"]));

      // Check user hasnt booked during another booking
      for (booking of bookings) {
        if (selectedDate < booking["startTime"] && endTime > booking["startTime"]
          || selectedDate > booking["startTime"] && selectedDate < booking["endTime"]) {
          alert("Slot already occupied. ")
          return;
        }
      }

      if (userBooking["element"].parentNode) {
        userBooking["element"].parentNode.removeChild(userBooking["element"]);
      }

      userBooking["startTime"] = selectedDate;
      userBooking["element"].style.top = String(curRow * snapHeight + cellHeight) + "px";
      userBooking["endTime"] = endTime;
      eTable.rows[0].cells[curColumn + 1].appendChild(userBooking["element"]);
      userBooking["placed"] = true;
      userBooking["price"] = rooms[curRoom]["pricePerHour"] * userBooking["bookingLength"]/60
    }

    // update payment table:
    updPayTable();

  }

  this.submitBooking = async function () {
    if (curRoom == -1) {
      alert("Please select a room. ");
      return;
    } else if (!userBooking["placed"]) {
      alert("Please put down a booking. ");
      return;
    }
    let response = await fetch('http://' + hostAddr + ":" + hostPort + '/customercommunitybooking', {
      method: "POST",
      headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "roomid=" + String(curRoom)
      + "&start=" + Math.floor(userBooking["startTime"].getTime()/1000)
      + "&end=" + Math.floor(userBooking["endTime"].getTime()/1000)
      + "&price=" + String(userBooking["price"])
      });

    if (response.status == 200) {
      let success = await response.json();
      alert("Booking sucessfully made. ");
    } else {
      alert("There was an error making your booking. ");
    }
  }

  this.setBookingLength = async function(e) { // Sets what the booking length should be
    let lengthDrop = document.getElementById("lengthDrop");
    userBooking["bookingLength"] = lengthDrop.value;
    userBooking["price"] = rooms[curRoom]["pricePerHour"] * userBooking["bookingLength"]/60;
    userBooking["element"].style.height = String((userBooking["bookingLength"]/60) * 50) + "px";
    peekElement.style.height = String((userBooking["bookingLength"]/60) * 50) + "px";
    updPayTable();
  }

  this.nextWeek = function() {
    targetMon.setDate(targetMon.getDate() + 7);
    targetSun.setDate(targetSun.getDate() + 7);
    displayDates();
    displayBookings();
    hideOldColumns();
    hidePrev();
  }

  this.prevWeek = function() {
    if (thisWeek) return; // Do not allow clicks if on this week;
    targetMon.setDate(targetMon.getDate() - 7);
    targetSun.setDate(targetSun.getDate() - 7);
    displayDates();
    displayBookings();
    hideOldColumns();
    hidePrev();
  }

  // Run necessary functions;
  displayDates();
  hidePrev();
  hideOldColumns();
}
