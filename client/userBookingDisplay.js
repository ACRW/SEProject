const hostAddr = "localhost";
const hostPort = "8090";

////// Selecting page elements //////
const usernameF = document.getElementById("username");
const booking1 = document.getElementById("booking1");
const booking2 = document.getElementById("booking2");



/*
/currentuser
{"type":"customer","userID":8}

/currentusername
[{"fName":"D","lName":"Rory"}]
*/

///// fetch infor from the database ////
// return [firstname, lastname]
async function getUserInfo () {
  // get current user name 
  let response = await fetch('http://' + hostAddr + ":" + hostPort + '/currentusername', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

  let tempUserName = await response.json();
  /*
  [{"fName":"D","lName":"Rory"}]
  */
  return [tempUserName[0]["fName"], tempUserName[0]["lName"]]
}

async function getConfirmedBookings () {
  let response = await fetch('http://' + hostAddr + ":" + hostPort + '/mybookings', {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  let tempBookings = await response.json();

  let flag = 1;
  for(booking of Object.assign([], tempBookings["activity"]).reverse()){ // lastest one first
    console.log(booking)
    if(booking == null){
      break;
    };
    let card = oneActivityCard(flag);
    document.getElementById("activity1").appendChild(card)
    // substitute
    document.getElementById("one-activity-header-" +String(flag)).innerHTML = "Time stamps" //
    document.getElementById("one-activity-title-" +String(flag)).innerHTML = booking["name"]
    document.getElementById("one-activity-description-" +String(flag)).innerHTML = booking["description"]
    document.getElementById("one-activity-starttime-" +String(flag)).innerHTML = booking["dateTime"] //
    document.getElementById("one-activity-people-" +String(flag)).innerHTML = booking["numberOfPeople"]
    document.getElementById("one-activity-price-" +String(flag)).innerHTML = booking["price"]
    document.getElementById("one-activity-paid-" +String(flag)).innerHTML = booking["paid"]
    document.getElementById("one-activity-id-" +String(flag)).innerHTML = booking["activityID"]

    flag++;
  }



  // 1 = activity, 2 = community, 3 = hostel
  let timeList = [];
  for(booking of tempBookings["activity"]){
    //[time,activity,bookingid]
    timeList.push([ booking["dateTime"], "activity", booking["bookingID"] ]);
  }

  for(booking of tempBookings["community"]){
    //[time,activity,bookingid]
    timeList.push([ booking["start"], "community", booking["bookingID"] ]);
  }

  for(booking of tempBookings["hostel"]){
    //[time,activity,bookingid]
    timeList.push([ booking["startDate"], "hostel", booking["bookingID"] ]);
  }

  console.log(timeList)

}

async function getBookingRequests () {
  let response = await fetch('http://' + hostAddr + ":" + hostPort + '/mybookingrequests', {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  let tempBookings = await response.json();
}

///// make the card functions /////
// booking1 activity
function oneActivityCard(number){
  let head = document.createElement('div');
  head.className = "card-header";
  head.id="one-activity-header-" +String(number);
  head.innerHTML = "Time stamps /eg: 2 days ago/ comming in 2 days";

  let title = document.createElement('h4'); // <h4></h4>
  title.className="card-title"; 
  title.id="one-activity-title-" +String(number);
  title.innerHTML = "Event type"; //<h4 className="card-title">Event type</h4>

  let description = document.createElement('b');
  description.innerHTML="Description: ";
  let descriptionContent = document.createElement('a');
  descriptionContent.id = "one-activity-description-" +String(number);
  descriptionContent.innerHTML = "paint(e)";
  let ilist2 =  document.createElement('li');
  ilist2.className ="list-group-item";
  ilist2.appendChild(description);
  ilist2.appendChild(descriptionContent);

  let startTime = document.createElement('b');
  startTime.innerHTML="Start Time: ";
  let startTimeContent = document.createElement('a');
  startTimeContent.id = "one-activity-starttime-" +String(number);
  startTimeContent.innerHTML = "2020-01-27T02:00:00.000Z(e)";
  let ilist3 =  document.createElement('li');
  ilist3.className ="list-group-item";
  ilist3.appendChild(startTime);
  ilist3.appendChild(startTimeContent);

  let people = document.createElement('b');
  people.innerHTML="Number of people: ";
  let peopleContent = document.createElement('a');
  peopleContent.id = "one-activity-people-" +String(number);
  peopleContent.innerHTML = "2(e)";
  let ilist4 =  document.createElement('li');
  ilist4.className ="list-group-item";
  ilist4.appendChild(people);
  ilist4.appendChild(peopleContent);

  let price = document.createElement('b');
  price.innerHTML="Price to pay: ";
  let priceContent = document.createElement('a');
  priceContent.id = "one-activity-price-" +String(number);
  priceContent.innerHTML = "60(e)";
  let ilist5 =  document.createElement('li');
  ilist5.className ="list-group-item";
  ilist5.appendChild(price);
  ilist5.appendChild(priceContent);

  let paid = document.createElement('b');
  paid.innerHTML="Have paid: ";
  let paidContent = document.createElement('a');
  paidContent.id = "one-activity-paid-" +String(number);
  paidContent.innerHTML = "60(e)";
  let ilist6 =  document.createElement('li');
  ilist6.className ="list-group-item";
  ilist6.appendChild(paid);
  ilist6.appendChild(paidContent);

  let bookingId = document.createElement('b');
  bookingId.innerHTML="The unique booking ID: ";
  let bookingIdContent = document.createElement('a');
  bookingIdContent.id = "one-activity-id-" +String(number);
  bookingIdContent.innerHTML = "27(e)";
  let ilist7 =  document.createElement('li');
  ilist7.className ="list-group-item";
  ilist7.appendChild(bookingId);
  ilist7.appendChild(bookingIdContent);

  let ulist = document.createElement('ul');
  ulist.className = "list-group list-group-flush";
  ulist.appendChild(ilist2);
  ulist.appendChild(ilist3);
  ulist.appendChild(ilist4);
  ulist.appendChild(ilist5);
  ulist.appendChild(ilist6);
  ulist.appendChild(ilist7);

  let body = document.createElement('div');
  body.className = "card-body";
  body.appendChild(title);
  body.appendChild(ulist);

  let text = document.createElement('div');
  text.className = "card text-center";
  text.appendChild(head);
  text.appendChild(body);

  let card = document.createElement('div');
  card.className = "col-sm-8 offset-sm-2";
  card.appendChild(text);
  return card
}
// booking1 community
// booking1 hostel
// booking2 activity
// booking2 community
// booking2 hostel

/////  load the page functions /////
const updateName = async() =>{
  const names = await getUserInfo();
  usernameF.innerHTML = names[0] + " " + names[1]
}


////// Action /////
// load the page
//  update
updateName();

getConfirmedBookings();
/*

updateConfirmedBookings();

window.onload = function() {
  // paging buttons
  booking1.addEventListener("click",function(){
    updateConfirmedBookings();
  });

  booking2.addEventListener("click",function(){
    updateBookingRequests();
  });
};

*/