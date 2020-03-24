const hostAddr = "localhost";
const hostPort = "8090";

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
  
  document.getElementById("activityCards").appendChild(card);
}

function modifyPopUp(id) {
  activity = activities[id];
  document.getElementById("popUpTitle").innerHTML = activity["name"];
  document.getElementById("popUpDesc").innerHTML = activity["description"];
  document.getElementById("popUpImg").src = activity["imagePath"];
}

createCards();

function monthCalender() {
  
}


