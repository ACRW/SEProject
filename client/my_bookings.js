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

//// helper function ////
function addzero(num, length) {
  return (Array(length).join("0") + num).slice(-length);
};

const eraseFields = () =>{
  // both show the 'waiting response'
  document.getElementById("activity1default").hidden = false;
  document.getElementById("community1default").hidden = false;
  document.getElementById("hostel1default").hidden = false;
  document.getElementById("activity2default").hidden = false;
  document.getElementById("community2default").hidden = false;
  document.getElementById("hostel2default").hidden = false;

  // both hide all the 'no booking records'
  document.getElementById("activity1NoRecord").hidden = true;
  document.getElementById("community1NoRecord").hidden = true;
  document.getElementById("hostel1NoRecord").hidden = true;
  document.getElementById("activity2NoRecord").hidden = true;
  document.getElementById("community2NoRecord").hidden = true;
  document.getElementById("hostel2NoRecord").hidden = true;

  // both clean all the content cards
  document.getElementById("activity1").innerHTML = "";
  document.getElementById("community1").innerHTML = "";
  document.getElementById("hostel1").innerHTML = "";
  document.getElementById("activity2").innerHTML = "";
  document.getElementById("community2").innerHTML = "";
  document.getElementById("hostel2").innerHTML = "";
};

function showNav1(){
  // show nav 1
  document.getElementById("navigation1").hidden = false;
  // hide nav 2
  document.getElementById("navigation2").hidden = true;
}

function showNav2(){
  // show nav 2
  document.getElementById("navigation2").hidden = false;
  // hide nav 1
  document.getElementById("navigation1").hidden = true;
}


///// fetch infor from the database ////
// return [firstname, lastname]
async function getUserInfo () {
  // get current user name
  let response = await fetch('/currentusername', {
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
  let response = await fetch('/mybookings', {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  // when no booking record
  let temp = await response.text();
  if (temp == '0bookings'){
    // no booking record
    document.getElementById("activity1default").hidden = true;
    document.getElementById("activity1NoRecord").hidden = false;
    document.getElementById("community1default").hidden = true;
    document.getElementById("community1NoRecord").hidden = false;
    document.getElementById("hostel1default").hidden = true;
    document.getElementById("hostel1NoRecord").hidden = false;
    return
  }

  // have booking record
  let tempBookings = JSON.parse(temp);

  let elementNum = 0;
  let flag = 1;
  for(booking of Object.assign([], tempBookings["activity"]).reverse()){ // lastest one first
    //console.log(booking)
    if(booking == null){
      break;
    };
    let card = oneActivityCard(flag);
    document.getElementById("activity1").appendChild(card);
    elementNum ++;

    // prepare time (早为小，晚为大
    startTime = new Date(booking["dateTime"]);
    nowTime = Date.now();
    if(startTime < nowTime){
      // in the past
      document.getElementById("one-activity-header-" +String(flag)).innerHTML = "Expired";
    }else{
      // in the future
      let difference = startTime-nowTime;
      let day = parseInt(difference/(1000*60*60*24));
      if (day > 0){
        // comming in day days
        document.getElementById("one-activity-header-" +String(flag)).innerHTML = "Comming in " + String(day) + " days."
      }else{
        let hours =  parseInt(difference/(1000*60*60));
        if (hours > 0){
          // comming in hours hours
          document.getElementById("one-activity-header-" +String(flag)).innerHTML = "Comming in " + String(hours) + " hours."
        }else{
          // less than one hour, don't be late
          document.getElementById("one-activity-header-" +String(flag)).innerHTML = "Comming in less than one hour, hurry."
        }
      }
    }

    // formating date
    const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let formatted_date = addzero(startTime.getDate(), 2) + "-" + months[startTime.getMonth()] + "-" + startTime.getFullYear()+ " " + addzero(startTime.getHours(), 2) + ":" + addzero(startTime.getMinutes(), 2) + ":" + addzero(startTime.getSeconds(), 2);
    document.getElementById("one-activity-starttime-" +String(flag)).innerHTML = formatted_date;

    // substitute others
    document.getElementById("one-activity-title-" +String(flag)).innerHTML = booking["name"];
    document.getElementById("one-activity-description-" +String(flag)).innerHTML = booking["description"];
    document.getElementById("one-activity-people-" +String(flag)).innerHTML = booking["numberOfPeople"];
    document.getElementById("one-activity-price-" +String(flag)).innerHTML = booking["price"];
    document.getElementById("one-activity-paid-" +String(flag)).innerHTML = booking["paid"];
    document.getElementById("one-activity-id-" +String(flag)).innerHTML = booking["activityID"];

    flag++;
  }
  if(elementNum > 0){
    // more than one
    document.getElementById("activity1default").hidden = true;
    document.getElementById("activity1NoRecord").hidden = true;
  }else{
    // less than one
    document.getElementById("activity1default").hidden = true;
    document.getElementById("activity1NoRecord").hidden = false;
  }

  elementNum = 0;
  flag = 1;
  for(booking of Object.assign([], tempBookings["community"]).reverse()){
    //console.log(booking);
    if(booking == null){
      break;
    };
    let card = oneCommunityCard(flag);
    document.getElementById("community1").appendChild(card);
    elementNum ++;

    // prepare time (早为小，晚为大
    startTime = new Date(booking["start"]);
    endTime = new Date(booking["end"]);
    nowTime = Date.now();
    if(startTime < nowTime){
      // in the past
      document.getElementById("one-community-header-" +String(flag)).innerHTML = "Expired";
    }else{
      // in the future
      let difference = startTime-nowTime;
      let day = parseInt(difference/(1000*60*60*24));
      if (day > 0){
        // comming in day days
        document.getElementById("one-community-header-" +String(flag)).innerHTML = "Comming in " + String(day) + " days."
      }else{
        let hours =  parseInt(difference/(1000*60*60));
        if (hours > 0){
          // comming in hours hours
          document.getElementById("one-community-header-" +String(flag)).innerHTML = "Comming in " + String(hours) + " hours."
        }else{
          // less than one hour, don't be late
          document.getElementById("one-activity-header-" +String(flag)).innerHTML = "Comming in less than one hour, hurry."
        }
      }
    }

    // formating date
    const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let formatted_date = addzero(startTime.getDate(), 2) + "-" + months[startTime.getMonth()] + "-" + startTime.getFullYear()+ " " + addzero(startTime.getHours(), 2) + ":" + addzero(startTime.getMinutes(), 2) + ":" + addzero(startTime.getSeconds(), 2);
    document.getElementById("one-community-starttime-" +String(flag)).innerHTML = formatted_date;
    let formatted_date2 = addzero(endTime.getDate(), 2) + "-" + months[endTime.getMonth()] + "-" + endTime.getFullYear()+ " " + addzero(endTime.getHours(), 2) + ":" + addzero(endTime.getMinutes(), 2) + ":" + addzero(endTime.getSeconds(), 2);
    document.getElementById("one-community-endtime-" +String(flag)).innerHTML = formatted_date2;

    // substitute others
    document.getElementById("one-community-title-" +String(flag)).innerHTML = booking["name"];
    document.getElementById("one-community-description-" +String(flag)).innerHTML = booking["description"];
    document.getElementById("one-community-price-" +String(flag)).innerHTML = booking["priceOfBooking"];
    document.getElementById("one-community-paid-" +String(flag)).innerHTML = booking["paid"];
    document.getElementById("one-community-id-" +String(flag)).innerHTML = booking["bookingID"];

    flag++;
  }
  if(elementNum > 0){
    // more than one
    document.getElementById("community1default").hidden = true;
    document.getElementById("community1NoRecord").hidden = true;
  }else{
    // less than one
    document.getElementById("community1default").hidden = true;
    document.getElementById("community1NoRecord").hidden = false;
  }

  elementNum = 0;
  flag = 1;
  for(booking of Object.assign([], tempBookings["hostel"]).reverse()){
    //console.log(booking);
    if(booking == null){
      break;
    };
    let card = oneHostelCard(flag);
    document.getElementById("hostel1").appendChild(card);
    elementNum ++;

    // prepare time (早为小，晚为大
    startTime = new Date(booking["startDate"]);
    endTime = new Date(booking["endDate"]);
    nowTime = Date.now();
    if(startTime < nowTime){
      // in the past
      document.getElementById("one-hostel-header-" +String(flag)).innerHTML = "Expired";
    }else{
      // in the future
      let difference = startTime-nowTime;
      let day = parseInt(difference/(1000*60*60*24));
      if (day > 0){
        // comming in day days
        document.getElementById("one-hostel-header-" +String(flag)).innerHTML = "Comming in " + String(day) + " days."
      }else{
        let hours =  parseInt(difference/(1000*60*60));
        if (hours > 0){
          // comming in hours hours
          document.getElementById("one-hostel-header-" +String(flag)).innerHTML = "Comming in " + String(hours) + " hours."
        }else{
          // less than one hour, don't be late
          document.getElementById("one-hostel-header-" +String(flag)).innerHTML = "Comming in less than one hour, hurry."
        }
      }
    }

    // formating date
    const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let formatted_date = addzero(startTime.getDate(), 2) + "-" + months[startTime.getMonth()] + "-" + startTime.getFullYear()+ " " + addzero(startTime.getHours(), 2) + ":" + addzero(startTime.getMinutes(), 2) + ":" + addzero(startTime.getSeconds(), 2);
    document.getElementById("one-hostel-starttime-" +String(flag)).innerHTML = formatted_date;
    let formatted_date2 = addzero(endTime.getDate(), 2) + "-" + months[endTime.getMonth()] + "-" + endTime.getFullYear()+ " " + addzero(endTime.getHours(), 2) + ":" + addzero(endTime.getMinutes(), 2) + ":" + addzero(endTime.getSeconds(), 2);
    document.getElementById("one-hostel-endtime-" +String(flag)).innerHTML = formatted_date2;

    // substitute others
    document.getElementById("one-hostel-title-" +String(flag)).innerHTML ="Room"+ String(parseInt(booking["roomID"])+1);
    document.getElementById("one-hostel-people-" +String(flag)).innerHTML = booking["noOfPeople"];
    document.getElementById("one-hostel-price-" +String(flag)).innerHTML = booking["price"];
    document.getElementById("one-hostel-paid-" +String(flag)).innerHTML = booking["paid"];
    document.getElementById("one-hostel-id-" +String(flag)).innerHTML = booking["bookingID"];

    flag++;
  }
  if(elementNum > 0){
    // more than one
    document.getElementById("hostel1default").hidden = true;
    document.getElementById("hostel1NoRecord").hidden = true;
  }else{
    // less than one
    document.getElementById("hostel1default").hidden = true;
    document.getElementById("hostel1NoRecord").hidden = false;
  }
};

async function getBookingRequests () {
  let response = await fetch('/mybookingrequests', {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  // when no booking record
  let temp = await response.text();
  if (temp == '0bookings'){
    // no booking record
    document.getElementById("activity2default").hidden = true;
    document.getElementById("activity2NoRecord").hidden = false;
    document.getElementById("community2default").hidden = true;
    document.getElementById("community2NoRecord").hidden = false;
    document.getElementById("hostel2default").hidden = true;
    document.getElementById("hostel2NoRecord").hidden = false;
    return
  }

  // have booking record
  let tempBookings = JSON.parse(temp);

  let elementNum = 0;
  let flag = 1;
  for(booking of Object.assign([], tempBookings["activity"]).reverse()){
    //console.log(booking);
    if(booking == null){
      break;
    };
    let card = twoActivityCard(flag);
    document.getElementById("activity2").appendChild(card);
    elementNum++;

    // prepare time (早为小，晚为大
    startTime = new Date(booking["dateTime"]);
    nowTime = Date.now();
    if(startTime < nowTime){
      // in the past
      document.getElementById("two-activity-header-" +String(flag)).innerHTML = "Expired";
    }else{
      // in the future
      let difference = startTime-nowTime;
      let day = parseInt(difference/(1000*60*60*24));
      if (day > 0){
        // comming in day days
        document.getElementById("two-activity-header-" +String(flag)).innerHTML = "Comming in " + String(day) + " days."
      }else{
        let hours =  parseInt(difference/(1000*60*60));
        if (hours > 0){
          // comming in hours hours
          document.getElementById("two-activity-header-" +String(flag)).innerHTML = "Comming in " + String(hours) + " hours. Please consider make a phone call."
        }else{
          // less than one hour, don't be late
          document.getElementById("two-activity-header-" +String(flag)).innerHTML = "Comming in less than one hour! Definitely make a phone call now."
        }
      }
    }

    // substitute others
    document.getElementById("two-activity-title-" +String(flag)).innerHTML = booking["name"];
    document.getElementById("two-activity-description-" +String(flag)).innerHTML = booking["description"];
    document.getElementById("two-activity-people-" +String(flag)).innerHTML = booking["numberOfPeople"];
    document.getElementById("two-activity-price-" +String(flag)).innerHTML = booking["price"];
    document.getElementById("two-activity-id-" +String(flag)).innerHTML = booking["activityID"];

    flag++;
  }
  if(elementNum > 0){
    // more than one
    document.getElementById("activity2default").hidden = true;
    document.getElementById("activity2NoRecord").hidden = true;
  }else{
    // less than one
    document.getElementById("activity2default").hidden = true;
    document.getElementById("activity2NoRecord").hidden = false;
  }

  elementNum = 0;
  flag = 1;
  for(booking of Object.assign([], tempBookings["community"]).reverse()){
    //console.log(booking);
    if(booking == null){
      break;
    };
    let card = twoCommunityCard(flag);
    document.getElementById("community2").appendChild(card);
    elementNum++;

    // prepare time (早为小，晚为大
    startTime = new Date(booking["start"]);
    endTime = new Date(booking["end"]);
    nowTime = Date.now();
    if(startTime < nowTime){
      // in the past
      document.getElementById("two-community-header-" +String(flag)).innerHTML = "Expired";
    }else{
      // in the future
      let difference = startTime-nowTime;
      let day = parseInt(difference/(1000*60*60*24));
      if (day > 0){
        // comming in day days
        document.getElementById("two-community-header-" +String(flag)).innerHTML = "Comming in " + String(day) + " days."
      }else{
        let hours =  parseInt(difference/(1000*60*60));
        if (hours > 0){
          // comming in hours hours
          document.getElementById("two-community-header-" +String(flag)).innerHTML = "Comming in " + String(hours) + " hours. Please consider make a phone call."
        }else{
          // less than one hour, don't be late
          document.getElementById("two-activity-header-" +String(flag)).innerHTML = "Comming in less than one hour! Definitely make a phone call now."
        }
      }
    }

    // formating date
    const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let formatted_date = addzero(startTime.getDate(), 2) + "-" + months[startTime.getMonth()] + "-" + startTime.getFullYear()+ " " + addzero(startTime.getHours(), 2) + ":" + addzero(startTime.getMinutes(), 2) + ":" + addzero(startTime.getSeconds(), 2);
    document.getElementById("two-community-starttime-" +String(flag)).innerHTML = formatted_date;
    let formatted_date2 = addzero(endTime.getDate(), 2) + "-" + months[endTime.getMonth()] + "-" + endTime.getFullYear()+ " " + addzero(endTime.getHours(), 2) + ":" + addzero(endTime.getMinutes(), 2) + ":" + addzero(endTime.getSeconds(), 2);
    document.getElementById("two-community-endtime-" +String(flag)).innerHTML = formatted_date2;

    // substitute others
    document.getElementById("two-community-title-" +String(flag)).innerHTML = booking["name"];
    document.getElementById("two-community-description-" +String(flag)).innerHTML = booking["description"];
    document.getElementById("two-community-price-" +String(flag)).innerHTML = booking["priceOfBooking"];
    document.getElementById("two-community-id-" +String(flag)).innerHTML = booking["requestID"];
    flag++;
  }
  if(elementNum > 0){
    // more than one
    document.getElementById("community2default").hidden = true;
    document.getElementById("community2NoRecord").hidden = true;
  }else{
    // less than one
    document.getElementById("community2default").hidden = true;
    document.getElementById("community2NoRecord").hidden = false;
  }

  elementNum = 0;
  flag = 1;
  for(booking of Object.assign([], tempBookings["hostel"]).reverse()){
    //console.log(booking);
    if(booking == null){
      break;
    };
    let card = twoHostelCard(flag);
    document.getElementById("hostel2").appendChild(card);
    elementNum++;

    // prepare time (早为小，晚为大
    startTime = new Date(booking["startDate"]);
    endTime = new Date(booking["endDate"]);
    nowTime = Date.now();
    if(startTime < nowTime){
      // in the past
      document.getElementById("two-hostel-header-" +String(flag)).innerHTML = "Expired";
    }else{
      // in the future
      let difference = startTime-nowTime;
      let day = parseInt(difference/(1000*60*60*24));
      if (day > 0){
        // comming in day days
        document.getElementById("two-hostel-header-" +String(flag)).innerHTML = "Comming in " + String(day) + " days."
      }else{
        let hours =  parseInt(difference/(1000*60*60));
        if (hours > 0){
          // comming in hours hours
          document.getElementById("two-hostel-header-" +String(flag)).innerHTML = "Comming in " + String(hours) + " hours. Please consider make a phone call."
        }else{
          // less than one hour, don't be late
          document.getElementById("two-hostel-header-" +String(flag)).innerHTML = "Comming in less than one hour! Definitely make a phone call now."
        }
      }
    }

    // formating date
    const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    let formatted_date = addzero(startTime.getDate(), 2) + "-" + months[startTime.getMonth()] + "-" + startTime.getFullYear()+ " " + addzero(startTime.getHours(), 2) + ":" + addzero(startTime.getMinutes(), 2) + ":" + addzero(startTime.getSeconds(), 2);
    document.getElementById("two-hostel-starttime-" +String(flag)).innerHTML = formatted_date;
    let formatted_date2 = addzero(endTime.getDate(), 2) + "-" + months[endTime.getMonth()] + "-" + endTime.getFullYear()+ " " + addzero(endTime.getHours(), 2) + ":" + addzero(endTime.getMinutes(), 2) + ":" + addzero(endTime.getSeconds(), 2);
    document.getElementById("two-hostel-endtime-" +String(flag)).innerHTML = formatted_date2;

    // substitute others
    document.getElementById("two-hostel-title-" +String(flag)).innerHTML ="Room"+ String(parseInt(booking["roomID"])+1);
    document.getElementById("two-hostel-people-" +String(flag)).innerHTML = booking["noOfPeople"];
    document.getElementById("two-hostel-price-" +String(flag)).innerHTML = booking["price"];
    document.getElementById("two-hostel-id-" +String(flag)).innerHTML = booking["requestID"];

    flag++;
  }
  if(elementNum > 0){
    // more than one
    document.getElementById("hostel2default").hidden = true;
    document.getElementById("hostel2NoRecord").hidden = true;
  }else{
    // less than one
    document.getElementById("hostel2default").hidden = true;
    document.getElementById("hostel2NoRecord").hidden = false;
  }

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
  startTime.innerHTML="Start Time(dd-mm-yyyy hh:mm:ss): ";
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
function oneCommunityCard(number){
  let head = document.createElement('div');
  head.className = "card-header";
  head.id="one-community-header-" +String(number);
  head.innerHTML = "Time stamps /eg: 2 days ago/ comming in 2 days";

  let title = document.createElement('h4'); // <h4></h4>
  title.className="card-title";
  title.id="one-community-title-" +String(number);
  title.innerHTML = "Event type"; //<h4 className="card-title">Event type</h4>

  let description = document.createElement('b');
  description.innerHTML="Description: ";
  let descriptionContent = document.createElement('a');
  descriptionContent.id = "one-community-description-" +String(number);
  descriptionContent.innerHTML = "paint(e)";
  let ilist2 =  document.createElement('li');
  ilist2.className ="list-group-item";
  ilist2.appendChild(description);
  ilist2.appendChild(descriptionContent);

  let startTime = document.createElement('b');
  startTime.innerHTML="Start Time(dd-mm-yyyy hh:mm:ss): ";
  let startTimeContent = document.createElement('a');
  startTimeContent.id = "one-community-starttime-" +String(number);
  startTimeContent.innerHTML = "2020-01-27T02:00:00.000Z(e)";
  let ilist3 =  document.createElement('li');
  ilist3.className ="list-group-item";
  ilist3.appendChild(startTime);
  ilist3.appendChild(startTimeContent);

  let endTime = document.createElement('b');
  endTime.innerHTML="End Time(dd-mm-yyyy hh:mm:ss): ";
  let endTimeContent = document.createElement('a');
  endTimeContent.id = "one-community-endtime-" +String(number);
  endTimeContent.innerHTML = "2020-01-27T02:00:00.000Z(e)";
  let ilist1 =  document.createElement('li');
  ilist1.className ="list-group-item";
  ilist1.appendChild(endTime);
  ilist1.appendChild(endTimeContent);

  let price = document.createElement('b');
  price.innerHTML="Price to pay: ";
  let priceContent = document.createElement('a');
  priceContent.id = "one-community-price-" +String(number);
  priceContent.innerHTML = "60(e)";
  let ilist5 =  document.createElement('li');
  ilist5.className ="list-group-item";
  ilist5.appendChild(price);
  ilist5.appendChild(priceContent);

  let paid = document.createElement('b');
  paid.innerHTML="Have paid: ";
  let paidContent = document.createElement('a');
  paidContent.id = "one-community-paid-" +String(number);
  paidContent.innerHTML = "60(e)";
  let ilist6 =  document.createElement('li');
  ilist6.className ="list-group-item";
  ilist6.appendChild(paid);
  ilist6.appendChild(paidContent);

  let bookingId = document.createElement('b');
  bookingId.innerHTML="The unique booking ID: ";
  let bookingIdContent = document.createElement('a');
  bookingIdContent.id = "one-community-id-" +String(number);
  bookingIdContent.innerHTML = "27(e)";
  let ilist7 =  document.createElement('li');
  ilist7.className ="list-group-item";
  ilist7.appendChild(bookingId);
  ilist7.appendChild(bookingIdContent);

  let ulist = document.createElement('ul');
  ulist.className = "list-group list-group-flush";
  ulist.appendChild(ilist2);
  ulist.appendChild(ilist3);
  ulist.appendChild(ilist1);
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
// booking1 hostel
function oneHostelCard(number){
  let head = document.createElement('div');
  head.className = "card-header";
  head.id="one-hostel-header-" +String(number);
  head.innerHTML = "Time stamps /eg: 2 days ago/ comming in 2 days";

  let title = document.createElement('h4'); // <h4></h4>
  title.className="card-title";
  title.id="one-hostel-title-" +String(number);
  title.innerHTML = "Event type"; //<h4 className="card-title">Event type</h4>

  let startTime = document.createElement('b');
  startTime.innerHTML="Start Time(dd-mm-yyyy hh:mm:ss): ";
  let startTimeContent = document.createElement('a');
  startTimeContent.id = "one-hostel-starttime-" +String(number);
  startTimeContent.innerHTML = "2020-01-27T02:00:00.000Z(e)";
  let ilist3 =  document.createElement('li');
  ilist3.className ="list-group-item";
  ilist3.appendChild(startTime);
  ilist3.appendChild(startTimeContent);

  let endTime = document.createElement('b');
  endTime.innerHTML="End Time(dd-mm-yyyy hh:mm:ss): ";
  let endTimeContent = document.createElement('a');
  endTimeContent.id = "one-hostel-endtime-" +String(number);
  endTimeContent.innerHTML = "2020-01-27T02:00:00.000Z(e)";
  let ilist1 =  document.createElement('li');
  ilist1.className ="list-group-item";
  ilist1.appendChild(endTime);
  ilist1.appendChild(endTimeContent);

  let people = document.createElement('b');
  people.innerHTML="Number of people: ";
  let peopleContent = document.createElement('a');
  peopleContent.id = "one-hostel-people-" +String(number);
  peopleContent.innerHTML = "2(e)";
  let ilist4 =  document.createElement('li');
  ilist4.className ="list-group-item";
  ilist4.appendChild(people);
  ilist4.appendChild(peopleContent);

  let price = document.createElement('b');
  price.innerHTML="Price to pay: ";
  let priceContent = document.createElement('a');
  priceContent.id = "one-hostel-price-" +String(number);
  priceContent.innerHTML = "60(e)";
  let ilist5 =  document.createElement('li');
  ilist5.className ="list-group-item";
  ilist5.appendChild(price);
  ilist5.appendChild(priceContent);

  let paid = document.createElement('b');
  paid.innerHTML="Have paid: ";
  let paidContent = document.createElement('a');
  paidContent.id = "one-hostel-paid-" +String(number);
  paidContent.innerHTML = "60(e)";
  let ilist6 =  document.createElement('li');
  ilist6.className ="list-group-item";
  ilist6.appendChild(paid);
  ilist6.appendChild(paidContent);

  let bookingId = document.createElement('b');
  bookingId.innerHTML="The unique booking ID: ";
  let bookingIdContent = document.createElement('a');
  bookingIdContent.id = "one-hostel-id-" +String(number);
  bookingIdContent.innerHTML = "27(e)";
  let ilist7 =  document.createElement('li');
  ilist7.className ="list-group-item";
  ilist7.appendChild(bookingId);
  ilist7.appendChild(bookingIdContent);

  let ulist = document.createElement('ul');
  ulist.className = "list-group list-group-flush";
  ulist.appendChild(ilist3);
  ulist.appendChild(ilist1);
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
// booking2 activity
function twoActivityCard(number){
  let head = document.createElement('div');
  head.className = "card-header";
  head.id="two-activity-header-" +String(number);
  head.innerHTML = "Time stamps /eg: 2 days ago/ comming in 2 days";

  let title = document.createElement('h4'); // <h4></h4>
  title.className="card-title";
  title.id="two-activity-title-" +String(number);
  title.innerHTML = "Event type"; //<h4 className="card-title">Event type</h4>

  let description = document.createElement('b');
  description.innerHTML="Description: ";
  let descriptionContent = document.createElement('a');
  descriptionContent.id = "two-activity-description-" +String(number);
  descriptionContent.innerHTML = "paint(e)";
  let ilist2 =  document.createElement('li');
  ilist2.className ="list-group-item";
  ilist2.appendChild(description);
  ilist2.appendChild(descriptionContent);

  let startTime = document.createElement('b');
  startTime.innerHTML="Start Time(dd-mm-yyyy hh:mm:ss): ";
  let startTimeContent = document.createElement('a');
  startTimeContent.id = "two-activity-starttime-" +String(number);
  startTimeContent.innerHTML = "2020-01-27T02:00:00.000Z(e)";
  let ilist3 =  document.createElement('li');
  ilist3.className ="list-group-item";
  ilist3.appendChild(startTime);
  ilist3.appendChild(startTimeContent);

  let people = document.createElement('b');
  people.innerHTML="Number of people: ";
  let peopleContent = document.createElement('a');
  peopleContent.id = "two-activity-people-" +String(number);
  peopleContent.innerHTML = "2(e)";
  let ilist4 =  document.createElement('li');
  ilist4.className ="list-group-item";
  ilist4.appendChild(people);
  ilist4.appendChild(peopleContent);

  let price = document.createElement('b');
  price.innerHTML="Price to pay: ";
  let priceContent = document.createElement('a');
  priceContent.id = "two-activity-price-" +String(number);
  priceContent.innerHTML = "60(e)";
  let ilist5 =  document.createElement('li');
  ilist5.className ="list-group-item";
  ilist5.appendChild(price);
  ilist5.appendChild(priceContent);

  let bookingId = document.createElement('b');
  bookingId.innerHTML="The unique booking request ID: ";
  let bookingIdContent = document.createElement('a');
  bookingIdContent.id = "two-activity-id-" +String(number);
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
// booking2 community
function twoCommunityCard(number){
  let head = document.createElement('div');
  head.className = "card-header";
  head.id="two-community-header-" +String(number);
  head.innerHTML = "Time stamps /eg: 2 days ago/ comming in 2 days";

  let title = document.createElement('h4'); // <h4></h4>
  title.className="card-title";
  title.id="two-community-title-" +String(number);
  title.innerHTML = "Event type"; //<h4 className="card-title">Event type</h4>

  let description = document.createElement('b');
  description.innerHTML="Description: ";
  let descriptionContent = document.createElement('a');
  descriptionContent.id = "two-community-description-" +String(number);
  descriptionContent.innerHTML = "paint(e)";
  let ilist2 =  document.createElement('li');
  ilist2.className ="list-group-item";
  ilist2.appendChild(description);
  ilist2.appendChild(descriptionContent);

  let startTime = document.createElement('b');
  startTime.innerHTML="Start Time(dd-mm-yyyy hh:mm:ss): ";
  let startTimeContent = document.createElement('a');
  startTimeContent.id = "two-community-starttime-" +String(number);
  startTimeContent.innerHTML = "2020-01-27T02:00:00.000Z(e)";
  let ilist3 =  document.createElement('li');
  ilist3.className ="list-group-item";
  ilist3.appendChild(startTime);
  ilist3.appendChild(startTimeContent);

  let endTime = document.createElement('b');
  endTime.innerHTML="End Time(dd-mm-yyyy hh:mm:ss): ";
  let endTimeContent = document.createElement('a');
  endTimeContent.id = "two-community-endtime-" +String(number);
  endTimeContent.innerHTML = "2020-01-27T02:00:00.000Z(e)";
  let ilist1 =  document.createElement('li');
  ilist1.className ="list-group-item";
  ilist1.appendChild(endTime);
  ilist1.appendChild(endTimeContent);

  let price = document.createElement('b');
  price.innerHTML="Price to pay: ";
  let priceContent = document.createElement('a');
  priceContent.id = "two-community-price-" +String(number);
  priceContent.innerHTML = "60(e)";
  let ilist5 =  document.createElement('li');
  ilist5.className ="list-group-item";
  ilist5.appendChild(price);
  ilist5.appendChild(priceContent);

  let bookingId = document.createElement('b');
  bookingId.innerHTML="The unique booking request ID: ";
  let bookingIdContent = document.createElement('a');
  bookingIdContent.id = "two-community-id-" +String(number);
  bookingIdContent.innerHTML = "27(e)";
  let ilist7 =  document.createElement('li');
  ilist7.className ="list-group-item";
  ilist7.appendChild(bookingId);
  ilist7.appendChild(bookingIdContent);

  let ulist = document.createElement('ul');
  ulist.className = "list-group list-group-flush";
  ulist.appendChild(ilist2);
  ulist.appendChild(ilist3);
  ulist.appendChild(ilist1);
  ulist.appendChild(ilist5);
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
// booking2 hostel
function twoHostelCard(number){
  let head = document.createElement('div');
  head.className = "card-header";
  head.id="two-hostel-header-" +String(number);
  head.innerHTML = "Time stamps /eg: 2 days ago/ comming in 2 days";

  let title = document.createElement('h4'); // <h4></h4>
  title.className="card-title";
  title.id="two-hostel-title-" +String(number);
  title.innerHTML = "Event type"; //<h4 className="card-title">Event type</h4>

  let startTime = document.createElement('b');
  startTime.innerHTML="Start Time(dd-mm-yyyy hh:mm:ss): ";
  let startTimeContent = document.createElement('a');
  startTimeContent.id = "two-hostel-starttime-" +String(number);
  startTimeContent.innerHTML = "2020-01-27T02:00:00.000Z(e)";
  let ilist3 =  document.createElement('li');
  ilist3.className ="list-group-item";
  ilist3.appendChild(startTime);
  ilist3.appendChild(startTimeContent);

  let endTime = document.createElement('b');
  endTime.innerHTML="End Time(dd-mm-yyyy hh:mm:ss): ";
  let endTimeContent = document.createElement('a');
  endTimeContent.id = "two-hostel-endtime-" +String(number);
  endTimeContent.innerHTML = "2020-01-27T02:00:00.000Z(e)";
  let ilist1 =  document.createElement('li');
  ilist1.className ="list-group-item";
  ilist1.appendChild(endTime);
  ilist1.appendChild(endTimeContent);

  let people = document.createElement('b');
  people.innerHTML="Number of people: ";
  let peopleContent = document.createElement('a');
  peopleContent.id = "two-hostel-people-" +String(number);
  peopleContent.innerHTML = "2(e)";
  let ilist4 =  document.createElement('li');
  ilist4.className ="list-group-item";
  ilist4.appendChild(people);
  ilist4.appendChild(peopleContent);

  let price = document.createElement('b');
  price.innerHTML="Price to pay: ";
  let priceContent = document.createElement('a');
  priceContent.id = "two-hostel-price-" +String(number);
  priceContent.innerHTML = "60(e)";
  let ilist5 =  document.createElement('li');
  ilist5.className ="list-group-item";
  ilist5.appendChild(price);
  ilist5.appendChild(priceContent);

  let bookingId = document.createElement('b');
  bookingId.innerHTML="The unique booking ID: ";
  let bookingIdContent = document.createElement('a');
  bookingIdContent.id = "two-hostel-id-" +String(number);
  bookingIdContent.innerHTML = "27(e)";
  let ilist7 =  document.createElement('li');
  ilist7.className ="list-group-item";
  ilist7.appendChild(bookingId);
  ilist7.appendChild(bookingIdContent);

  let ulist = document.createElement('ul');
  ulist.className = "list-group list-group-flush";
  ulist.appendChild(ilist3);
  ulist.appendChild(ilist1);
  ulist.appendChild(ilist4);
  ulist.appendChild(ilist5);
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


/////  load the page functions /////
const updateName = async() =>{
  const names = await getUserInfo();
  usernameF.innerHTML = names[0] + " " + names[1]
}

// when page content loaded
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

    ////// Action /////
    // load the page
    //  update
    updateName(); // username
    getConfirmedBookings();
    // show the navigation1
    showNav1();

    // paging buttons
    booking1.addEventListener("click",function(){
      eraseFields();
      getConfirmedBookings();
      // show the navigation1
      showNav1();
    });

    booking2.addEventListener("click",function(){
      eraseFields();
      getBookingRequests();
      // show the navigation2
      showNav2();
    });
})
