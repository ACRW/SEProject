const hostAddr = "localhost";
const hostPort = "8090";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let actCards = {} // Keeps track of all the activity card classes
let activities = {}

async function createCards () { // Get the card information and create them
  let response = await fetch('http://' + hostAddr + ":" + hostPort + '/activities', {
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
  button.onclick= function(){modifyPopUp(activity["id"]);};//function () {console.log("test");};
  button.setAttribute("data-toggle", "modal");
  button.setAttribute("data-target", "#popUp");
  
  let body = document.createElement('div');
  body.className = "card-body";
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(button);
  
  let img = document.createElement('img');
  img.className = "card-img-top";
  img.src = activity["imagePath"];
  
  let card = document.createElement('div');
  card.className = "card";
  card.appendChild(img);
  card.appendChild(body);
  card.style.display = "display: inline-block";
  
  document.getElementById("activityCards").appendChild(card);
}

function modifyPopUp(id) {
  activity = activities[id];
  document.getElementById("popUpTitle").innerHTML = activity["name"];
  document.getElementById("popUpDesc").innerHTML = activity["description"];
  document.getElementById("popUpImg").src = activity["imagePath"];
}

createCards();

function monthCalender(calTable, monthTitle, objName) {
  const dateRows = 6; // This is the number of rows that dates appear in, it does not include the header
  
  let body = calTable.getElementsByTagName('tbody')[0];
  let head = calTable.getElementsByTagName('thead')[0];
  let soMonth = new Date(); // Start of month
  soMonth.setDate(1);
  soMonth.setHours(0, 0, 0, 0);
  let booking = {
    "date": new Date(),
    "bookedCellPos"
  };
  
  let genCells = function() {
    for (let y = 0; y < dateRows; y++) {
      let row = document.createElement('tr');
      for (let x = 0; x < 7; x++) {
        let cell = document.createElement('td');
        cell.setAttribute("onclick", objName + ".bookDate(" + x + ", " + y + ");")))
        row.appendChild(cell);
      }
      body.appendChild(row);
    }
  }
  
  let popCells = function() {
    monthTitle.innerHTML = monthNames[soMonth.getMonth()] + " " + String(soMonth.getYear() + 1900);
    for (let y = 0; y < dateRows; y++) {
      for (let x = 0; x < 7; x++) {
        let datDif = (y * 7) + x -soMonth.getDay();
        let tempDate = new Date();
        tempDate.setTime(soMonth.getTime());
        tempDate.setDate(tempDate.getDate() + datDif);
        let cell = body.rows[y].cells[x];
        cell.setAttribute("time", tempDate.getUTCDate());
        cell.innerHTML = "<p>" + tempDate.getDate() + "<\p>";
      }
    }
  }
  
  this.iniatiate = function () {
    genCells();
    popCells();
  }
  
  this.prev = function () {
    soMonth.setMonth(soMonth.getMonth() - 1);
    popCells();
  }
  
  this.next = function () {
    soMonth.setMonth(soMonth.getMonth() + 1);
    console.log(soMonth);
    popCells();
  }
  
  this.bookDate = function (x, y) {
    y = 
  }
}

calElement = document.getElementById("bookingCalender");
cal = new monthCalender(calElement, document.getElementById("topDate"), "cal");
cal.iniatiate();
document.getElementById("left").setAttribute("onclick", "cal.prev()");
document.getElementById("right").setAttribute("onclick", "cal.next()");


