const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"];
const greyCol = "#EDEDED";

let eventCards = {}; // Keeps track of all the event card classes, id matches position
let curEvent; // Current event card being looked at
let groupSize = 1;
let dateCards = document.getElementById("dateCards");
let table = document.getElementById("checkoutTable");
let totalCostElement = document.getElementById("totalCost");

async function createCards () { // Get the card information and create them
  let response = await fetch('/events', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
  let tempEvents = await response.json();
  for (tempEvent of tempEvents) {
    eventCards[tempEvent["id"]] = new eventCard(tempEvent);
  }
}

async function getTicketTypes(id) {
  let response = await fetch('/tickets?eventid=' + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
  let tempTypes = await response.json();
  return tempTypes;
}

function ticketCard(ticket, ticketList, tarEvent, parentEventCard) { // Constuctor for ticket types, supply ticketList so that it can modify the selected preference of other tickets;
  let eventDate = new Date(tarEvent["datetime"]);
  let selected = false;
  let cardElement; // Card div html element
  let quantity = 0;
  let quantCounter;
  let rowElement; // HTML row element to which to add the different values;
  let rowDisplayed = false; // Keeps track of whether the row has been added to the table;

  let createRow = function() {
    rowElement = document.createElement('tr');
    for (let i = 0; i < 5; i++) {
      rowElement.insertCell(i);
    }
    rowElement.cells[0].innerHTML = ticket["ticketType"];
    rowElement.cells[1].innerHTML = tarEvent["datetime"].slice(0, 10); // Thoughts in the future that you could have each ticket with its own date?
    rowElement.cells[2].innerHTML = "£ " + ticket["ticketPrice"];
  }

  let modifyRow = function() {
    if (!rowDisplayed) {
      table.appendChild(rowElement);
      rowDisplayed = true;
    }
    rowElement.cells[3].innerHTML = quantity;
    rowElement.cells[4].innerHTML = "£ " + (quantity * ticket["ticketPrice"]);
  };

  let changeQuantity = function(changeValue) {
    quantity += changeValue;
    if (quantity < 0) quantity = 0;
    quantCounter.innerHTML = quantity;
    parentEventCard.updateTotal();
    modifyRow();
  };

  let createCard = function(){
    cardTitle = document.createElement('div'); // Should call it card header really
    cardTitle.className = "card-header";
    cardTitle.innerHTML = "<h5>" + ticket["ticketType"] + "</h5>";

    cardFooter = document.createElement('div');
    cardFooter.className = "card-footer";
    cardFooter.innerHTML = "<h5> £" + (Math.round(ticket["ticketPrice"] * 100) / 100).toFixed(2); + "</h5>";

    let cardDate = document.createElement('div');
    cardDate.className = "card-text";
    cardDate.innerHTML = "<h5>"
      + dayNames[eventDate.getDay()] + " "
      + eventDate.getDate() + "<sup>" + dateSuffix(eventDate.getDate()) + "</sup> "
      + monthNames[eventDate.getMonth()] + " "
      + (eventDate.getYear() + 1900)
      + "</h5>";

    let addQuantBut = document.createElement('button');
    addQuantBut.setAttribute("type", "button");
    addQuantBut.className = "btn btn-secondary unselectable";
    addQuantBut.onclick = function(){changeQuantity(1);};
    addQuantBut.innerHTML = "+";
    addQuantBut.style = "width: 40px; font-size: 1.2rem;";

    let subQuantBut = addQuantBut.cloneNode(false);
    subQuantBut.onclick = function(){changeQuantity(-1);};
    subQuantBut.innerHTML = "-";

    quantCounter = document.createElement('p');
    quantCounter.innerHTML = quantity;
    quantCounter.style.margin="10px";
    //<button type="button" class="btn btn-primary newColorH=" onclick="submit()">Book this date</button>
    let quantRow = document.createElement('div');
    quantRow.className = "row";
    let addCol = document.createElement('div');
    addCol.className = "col-md-4 m-0 p-0";
    let quantCol = addCol.cloneNode(false);
    quantCol.style.textAlign = "center";
    quantCol.style.padding="20px";
    let subCol = addCol.cloneNode(false);
    //cardQuantity = document.createElement('div');
    //cardQuantity.classname = "card-text";
    subCol.appendChild(subQuantBut);
    quantCol.appendChild(quantCounter);
    addCol.appendChild(addQuantBut);
    quantRow.appendChild(subCol);
    quantRow.appendChild(quantCol);
    quantRow.appendChild(addCol);
    cardFooter.appendChild(quantRow);

    cardBody = document.createElement('div');
    cardBody.className = "card-body";
    cardBody.appendChild(cardDate);
    cardBody.style.backgroundColor = greyCol;
    cardFooter.style.backgroundColor = greyCol;

    newCard = document.createElement('div');

    newCard.className = "card m-3 newColorHov unselectable";
    newCard.style.width="10rem";
    newCard.appendChild(cardTitle);
    newCard.appendChild(cardBody);
    newCard.appendChild(cardFooter);
    cardElement = newCard;
  };

  this.redisplay = function() {
    if (rowDisplayed) { // Only if it has been previously displayed
      rowDisplayed = false;
      modifyRow();
    }
  };

  this.getCost = function () {
    return quantity * ticket["ticketPrice"];
  };

  this.getQuantity = function() {
    return quantity;
  };

  this.unselect = function () { // Used for turning off
    selected = false;
    cardStatus.innerHTML = "";
  };

  this.isSelected = function () {
    return selected;
  };

  this.displayCard = function () {
    dateCards.appendChild(cardElement);
  };

  this.getTicket = function() {
    return ticket;
  };

  createCard();
  createRow();
}

function eventCard (tarEvent) { // event card class, each instantiated class refers to a single card on the document. Bit of a mess, would be better to have dummy code inside html document.
  let ticketCardList = []; // List of ticket cards
  let imgSrc = "";
  let tickets = []; // List of ticket types fetched from server
  let totalCost = 0;

  let createCard = function() {
    let title = document.createElement('h4');
    title.className="card-title";
    title.innerHTML = tarEvent["name"];

    let desc = document.createElement('p');
    desc.className = "card-text";
    desc.innerHTML = tarEvent["description"];

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
    let bodyCol = document.createElement('div');
    bodyCol.className = "col-auto";
    bodyCol.appendChild(body);

    let imgBox = document.createElement('div');
    imgBox.className="col-md-4";

    let img = document.createElement('img');
    img.className = "card-img-top";
    if (!tarEvent["imagepath"]) imgSrc = "webimage/default.jpg"; // Select a default image if there is no image.
    else imgSrc = tarEvent["imagepath"];
    img.src = imgSrc;
    imgBox.appendChild(img);

    let cardRow = document.createElement('div');
    cardRow.className = "row no-gutter";
    cardRow.appendChild(imgBox);
    cardRow.appendChild(bodyCol);

    let card = document.createElement('div');
    card.appendChild(cardRow);
    card.className = "card mb-4";

    card.style.display = "display: inline-block";

    document.getElementById("eventCards").appendChild(card);
  }

  this.updateTotal = function() {
    totalCost = 0;
    for (ticket of ticketCardList) {
      totalCost += ticket.getCost();
    }
    totalCostElement.innerHTML = "Total Cost: £" + (Math.round(totalCost * 100) / 100).toFixed(2);
  };

  async function modifyPopUp() { // Modify the modal popup
    curEvent = eventCards[tarEvent["id"]];

    if (tickets.length == 0 || tickets === undefined) {
      tickets = await getTicketTypes(tarEvent["id"]);
      for (ticket of tickets) { // Create all the ticket objects
        ticketCardList.push(new ticketCard(ticket, ticketCardList, tarEvent, eventCards[tarEvent["id"]]));
      }
    }
    document.getElementById("popUpTitle").innerHTML = tarEvent["name"];
    document.getElementById("popUpDesc").innerHTML = tarEvent["description"];
    document.getElementById("popUpImg").src = imgSrc;
    for (let i = table.rows.length - 1; i > 0; i--) {
      table.deleteRow(i);
    }

    // display date cards
    dateCards.innerHTML = ""; // Remove previous stuff
    for (ticket of ticketCardList) {
      ticket.displayCard();
      ticket.redisplay();
    }

    eventCards[tarEvent["id"]].updateTotal();
  }

  this.getTickets = function() {
    let finalTickets = [];
    for (ticket of ticketCardList) {
      finalTickets.push({
        "ticket": ticket.getTicket(),
        "quantity": ticket.getQuantity()
      });
    }
    return finalTickets;
  }

  this.getID = function () {
    return tarEvent["id"];
  };

  this.getTotalCost = function() {
    return totalCost;
  };

  createCard();
}

function dateSuffix(day) {
  digit = day % 10;
  if (day < 21 && day > 3) return "th";
  else if (digit == 1) return "st";
  else if(digit == 2) return "nd";
  else if(digit == 3) return "rd";
  else return "th";
}

function groupSizeChange(size) {
  groupSize = size;
  document.getElementById("numOfPeople").innerHTML = groupSize;
  document.getElementById("totalPrice").innerHTML = "£" + groupSize * curEvent["price"];
};

async function submit() {
  let finalTickets = curEvent.getTickets();
  let quant = 0;
  for (ticket of finalTickets) {
    quant += ticket["quantity"];
  }
  if (quant == 0) {
    alert("Please select atleast one ticket");
    return;
  }

  let response = await fetch('/eventbooking', {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "eventid=" + String(curEvent.getID()) +
        "&numberoftickets=" + String(quant) +
        "&price=" + String(curEvent.getTotalCost())
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




/*// Information to reach API
const url = 'https://localhost:8090';
const queryParams ='/event';

// Selecting page elements
const eventPic = document.getElementsByName("eventPic");
const responseField = document.getElementById("responseField");
const paymentTable = document.getElementById("paymentTable");
const paymentButton = document.getElementById("fat-btn");

// AJAX function
// when open the page, fetch infor from the database
getevent = async() => {
  const endpoint = `${url}${queryParams}`
  try{
    const response = await fetch( '/event', {
      method:"GET",
      headers:{
        "Content-Type": "application/json"
      }
    })
    if(response.ok){
      console.log('test')
      if(response.body === '0matches' || response.body === '0database'){
        // get element do the replacement
        responseField.innerHTML = "<p>Sorry, No event available.</p><p>Please wait for release.</p>";
        paymentButton.disable = true;
        paymentTable.style.display = "none";
      } else{
        console.log('test');
        const jsonResponse = await response.json();
        // render json response
        // renderResponse(jsonResponse);
      }
    }
    throw new Error('Error getting event.' + response.code);
  }catch(error){
    console.log(error+'test')
  }
}
// call the function
getevent();


const renderResponse = (res) => {
  // Displays either message depending on results
  if(res.error){
    responseField.innerHTML = "<p>Sorry, error occurs.</p><p> Try later.</p>";
    paymentButton.disable = true;
    paymentTable.style.display = "none";
  } else {
    // Code to display the json file content code
    /*
    let structuredRes = JSON.stringify(res).replace(/,/g, ", \n");
    structuredRes = `<pre>${structuredRes}</pre>`;
    responseField.innerHTML = `${structuredRes}`;


    // get the number of event and display the right picture in right place
    const eventNumber = res.id.length;
    // get description and display on screen
    let description = res.description;
    // update the payment table

  }
}



// Clear previous results and display results to webpage
/*
const displaySuggestions = (event) => {
  event.preventDefault();
  while(responseField.firstChild){
    responseField.removeChild(responseField.firstChild)
  }
  getSuggestions();
}

submit.addEventListener('click', displaySuggestions);




window.onload = function(){
  // get all displaced pictures
  //let eventPic = document.getElementsByName("eventPic");
  this.console.log(eventPic.length)
  for(let i = 0; i< eventPic.length; i++){
    // when click show info:
    eventPic[i].onclick = function(){
      //let eventNumber = int(this.id);
      showBookInfo();
    }
  }
}

// when click the pic, show the book info
function showBookInfo() {
  let bookInfo = document.getElementById("bookInfo");
  //console.log(bookInfo.hidden)
  if (bookInfo.hidden === true) {
    bookInfo.hidden = false;
  } else {
    bookInfo.hidden = true;
  }
}*/
