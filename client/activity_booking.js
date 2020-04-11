const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let actCards = {} // Keeps track of all the activity card classes, id matches position
let activities = {}
let activity; // Current activity being looked at
let groupSize = 1;

async function createCards () { // Get the card information and create them
  let response = await fetch('/activities', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
  let tempActs = await response.json();

  for (activity of tempActs) {
    actCards[activity["id"]] = new ActivityCard(activity);
    activities[activity["id"]] = activity;
  }
}

function ActivityCard (activity) { // Activity card class, each instantiated class refers to a single card on the document.
  let title = document.createElement('h4');
  title.className="card-title";
  title.innerHTML = activity["name"];

  let desc = document.createElement('p');
  desc.className = "card-text";
  desc.innerHTML = activity["description"];

  let button = document.createElement('a');
  button.className = "btn btn-primary newColor";
  button.type = "button";
  button.innerHTML = "Book Now";
  button.onclick= function(){modifyPopUp();};//function () {console.log("test");};
  button.setAttribute("data-toggle", "modal");
  button.setAttribute("data-target", "#popUp");

  let body = document.createElement('div');
  body.className = "card-body";
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(button);

  let img = document.createElement('img');
  img.className = "card-img-top";
  if (!activity["imagePath"]) img.src = "webimage/default.jpg"; // Select a default image if there is no image.
  else img.src = activity["imagePath"];

  let card = document.createElement('div');
  card.className = "card";
  card.appendChild(img);
  card.appendChild(body);
  card.style.display = "display: inline-block";

  document.getElementById("activityCards").appendChild(card);

  function modifyPopUp() {
    document.getElementById("popUpTitle").innerHTML = activity["name"];
    document.getElementById("popUpDesc").innerHTML = activity["description"];
    document.getElementById("popUpImg").src = activity["imagePath"];
    document.getElementById("act").innerHTML = activity["name"];
    document.getElementById("pricepp").innerHTML = "£" + activity["price"];
    document.getElementById("numOfPeople").innerHTML = "1";
    document.getElementById("totalPrice").innerHTML = "£" + activity["price"];
    document.getElementById("maxPeople").value = 1;
    cal.reset();
  }
}

function monthCalender(calTable, monthTitle, objName) {
  const dateRows = 6; // This is the number of rows that dates appear in, it does not include the header
  const selCol = "#CCCCFF";

  let body = calTable.getElementsByTagName('tbody')[0];
  let head = calTable.getElementsByTagName('thead')[0];
  let cellColor = head.rows[0].cells[0].getAttribute("background-color");
  let outRangeColor = "#DDDDDD";
  let soMonth = new Date(); // Start of month
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  soMonth.setDate(1);
  soMonth.setHours(0, 0, 0, 0);
  let booking = {
    "date": -1
  };

  let genCells = function() {
    for (let y = 0; y < dateRows; y++) {
      let row = document.createElement('tr');
      for (let x = 0; x < 7; x++) {
        let cell = document.createElement('td');
        cell.setAttribute("onclick", objName + ".bookDate(" + x + ", " + y + ");");
        row.appendChild(cell);
      }
      body.appendChild(row);
    }
  };

  let popCells = function() {
    monthTitle.innerHTML = monthNames[soMonth.getMonth()] + " " + String(soMonth.getYear() + 1900);
    for (let y = 0; y < dateRows; y++) {
      for (let x = 0; x < 7; x++) {
        let datDif = (y * 7) + x -soMonth.getDay();
        let tempDate = new Date();
        tempDate.setTime(soMonth.getTime());
        tempDate.setDate(tempDate.getDate() + datDif);

        let cell = body.rows[y].cells[x];
        cell.innerHTML = "<p>" + tempDate.getDate() + "<\p>";

        if (tempDate < today) {
          cell.style.backgroundColor = outRangeColor;
        } else if (booking["date"] != -1 && tempDate.getTime() === booking["date"].getTime()) { // Selects the cell that has been booked
          cell.style.backgroundColor = selCol;
        } else {
          cell.style.backgroundColor = cellColor;
        }
        //if(tempDate.getMonth() != soMonth.getMonth()) {
        //  cell.style.backgroundColor = outRangeColor;
        //}
      }
    }
  };

  let clearSel = function() {
    for (let y = 0; y < dateRows; y++) {
      for (let x = 0; x < 7; x++) {
        let temp = body.rows[y].cells[x];
        if (temp.getAttribute("sel") == "t") {
          temp.style.backgroundColor = cellColor;
          temp.setAttribute("sel", "f")
          break;
        }
      }
    }
  };

  this.getBookingDate = function () {
    return booking["date"];
  };

  this.iniatiate = function () {
    genCells();
    popCells();
  };

  this.prev = function () {
    soMonth.setMonth(soMonth.getMonth() - 1);
    popCells();
  };

  this.next = function () {
    soMonth.setMonth(soMonth.getMonth() + 1);
    popCells();
  };

  this.reset = function() {
    booking = {
    "date": -1
    };
    soMonth = new Date();
    soMonth.setDate(1);
    soMonth.setHours(0, 0, 0, 0);
    popCells();
  };

  this.bookDate = function (x, y) {
    let datDif = (y * 7) + x - soMonth.getDay();
    let tempDate = new Date();
    tempDate.setTime(soMonth.getTime());
    tempDate.setDate(tempDate.getDate() + datDif); // Set tempdate to be the date of the selection.

    if (tempDate < today) return; // Return if old date;

    let tarCell = body.rows[y].cells[x];
    clearSel();
    booking["date"] = tempDate;
    tarCell.setAttribute("sel", "t");
    tarCell.style.backgroundColor = selCol;
  };
}

function groupSizeChange(size) {
  groupSize = size;
  document.getElementById("numOfPeople").innerHTML = groupSize;
  document.getElementById("totalPrice").innerHTML = "£" + groupSize * activity["price"];
};

async function submit() {
  bookDate = cal.getBookingDate();
  if (bookDate == -1) {
    alert("Please select a booking date.");
    return;
  }
  let response = await fetch('/customeractivitybooking', {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "activityid=" + String(activity["id"]) +
        "&datetime=" + String(Math.floor(bookDate.getTime()/1000)) +
        "&numberofpeople=" + String(groupSize) +
        "&price=" + String(groupSize * activity["price"])
    });
  let answer = await response;
  if (answer.status == 200) {
    alert("Booking Request succesfully made! ");
  } else {
    alert("Error making booking.");
  }
};

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
});

createCards();
calElement = document.getElementById("bookingCalender");
cal = new monthCalender(calElement, document.getElementById("topDate"), "cal");
cal.iniatiate();
document.getElementById("left").setAttribute("onclick", "cal.prev()");
document.getElementById("right").setAttribute("onclick", "cal.next()");
