var submitAction = 0;

document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("searchModalFooter").hidden = true;

  document.getElementById("searchSubmit").addEventListener("click", function(){
    switch(submitAction) {
      case 1:
        searchForUser()
        break;
      case 2:
        searchForEvents()
        break;
      case 3:
        searchForAvaliability()
        break;
      default:
      // code block
    }
  });
  document.getElementById("searchUser").addEventListener("click", function(){
    submitAction = 1;
  });
  document.getElementById("searchEvent").addEventListener("click", function(){
    submitAction = 2;
  });
  document.getElementById("searchAvaliability").addEventListener("click", function(){
    submitAction = 3;
  });

  document.getElementById("yearAvaliableSearch").addEventListener("change", function(){
    document.getElementById("monthAvaliableSearchLabel").hidden = false;
    document.getElementById("monthAvaliableSearch").hidden = false;
  });

  document.getElementById("monthAvaliableSearch").addEventListener("change", function(){
    document.getElementById("dayAvaliableSearchLabel").hidden = false;
    document.getElementById("dayAvaliableSearch").hidden = false;
    year = document.getElementById("yearAvaliableSearch").value;
    month = document.getElementById("monthAvaliableSearch").value;
    fillDayDrop(year,month,"Avaliable")
  });

  document.getElementById("yearEventSearch").addEventListener("change", function(){
    document.getElementById("monthEventSearchLabel").hidden = false;
    document.getElementById("monthEventSearch").hidden = false;
  });

  document.getElementById("monthEventSearch").addEventListener("change", function(){
    document.getElementById("dayEventSearchLabel").hidden = false;
    document.getElementById("dayEventSearch").hidden = false;
    year = document.getElementById("yearEventSearch").value;
    month = document.getElementById("monthEventSearch").value;
    fillDayDrop(year,month,"Event")
  });

  document.getElementById("newBookingButton").addEventListener('click',function(){
    document.getElementById("findBy").hidden = false;
    document.getElementById("makeBooking").hidden = true;
  })

  updateRooms();

  fillFindBy();
});

//runs get request to search for user in database and displays results
async function searchForUser(){
  fName = document.getElementById("firstnameSearch").value;
  sName = document.getElementById("surnameSearch").value;
  email = document.getElementById("emailSearch").value;
  phoneNumber = document.getElementById("phoneNoSearch").value;
  try{
    let response = await fetch('http://localhost:8090/customersearch?fname=' + fName + '&sname=' + sName + '&email=' + email + '&phone=' + phoneNumber,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
      });
    if(response.ok){
      var body = await response.text();
      var customers = JSON.parse(body);
      document.getElementById('byUser').hidden = true;
      document.getElementById('searchResults').innerHTML += '<h5> Found ' + customers.length + ' match in the database </h5>';
      for(var i=0; i<customers.length; i++){
        document.getElementById('searchResults').innerHTML += '<p> Name : ' + customers[i].fName + ' ' +  customers[i].lName + ' Email: ' + customers[i].email + ' Phone Number: ' + customers[i].phone;
        document.getElementById('searchResults').innerHTML += '<button type="button" class="btn btn-primary newColor" id="result'+i+'" data-toggle="modal" data-target="#viewUsersBookingsModal">View Bookings</button>';
        document.getElementById('result'+i).addEventListener('click', getUserBookings(customers[i].id));
      }
    } else {
      throw new Error('Error getting customers' + response.code);
    }
    } catch (error) {
      alert ('Problem: ' + error);
    }
  document.getElementById("searchModalFooter").hidden = true;
}

//creates tables from users community and hostel bookings
async function getUserBookings(customerID){
  try{
    let response = await fetch('http://localhost:8090/customerbookings?id=' + customerID,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
      });
      if(response.ok){
        var body = await response.text();
        var bookings = JSON.parse(body);

        for(var i=0;i<bookings['community'].length;i++){
          tableRow='<tr><th scope="row">'+bookings['community'][i].bookingID+'</th><td>'+bookings['community'][i].start+'</td><td>'+bookings['community'][i].end+'</td><td>'+bookings['community'][i].priceOfBooking+'</td><td>'+bookings['community'][i].paid+'</td><td>'+ bookings['community'][i].name+'</td></tr>';
          document.getElementById('usersCommunityBookingTableBody').innerHTML += tableRow;
        }
        console.log(bookings['hostel'][0]);
        for(var i=0;i<bookings['hostel'].length;i++){
          tableRow='<tr><th scope="row">'+bookings['hostel'][i].bookingID+'</th><td>'+bookings['hostel'][i].startDate+'</td><td>'+bookings['hostel'][i].endDate+'</td><td>'+bookings['hostel'][i].roomID+'</td><td>'+bookings['hostel'][i].pricePerNight+'</td><td>'+ bookings['hostel'][i].noOfPeople+'</td></tr>';
          document.getElementById('usersHostelBookingTableBody').innerHTML += tableRow;
        }
      }else{
        throw new Error('Error getting customers' + response.code);
      }
      } catch (error) {
        alert ('Problem: ' + error);
      }
}

//fills drop boxes
async function updateRooms() {
    const rooms = await getRooms();
    roomDrop = document.getElementById("roomSelectDrop");
    for (i = 0; i < rooms.length; i++) {
        let option = document.createElement("option");
        option.text = rooms[i]["name"];
        roomDrop.add(option);
    }
}

function daysInMonth (year, month) {
    return new Date(year, month, 0).getDate();
}

function fillDayDrop(year, month, searchType){
  daysDrop = document.getElementById("day"+searchType+"Search");
  for(var i=1; i<=daysInMonth(year,month);i++){
    let option = document.createElement("option")
    option.text = i.toString().padStart(2,'0');
    daysDrop.add(option);

  }
}

async function getRooms(startDate, endDate) { // Need to add error handling at some point.
    let response = await fetch('http://localhost:8090/rooms?types=community', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    let body = await response.text();
    var rooms = JSON.parse(body);
    return rooms["community"]
}

async function searchForAvaliability(){
  roomName = document.getElementById("roomSelectDrop").value;
  year = document.getElementById("yearAvaliableSearch").value;
  month = document.getElementById("monthAvaliableSearch").value;
  day = document.getElementById("dayAvaliableSearch").value;
  dateCombined = year+ '-' + month + '-' + day;
  let response = await fetch('http://localhost:8090/rooms?types=community', {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
  });
  let body = await response.text();
  var rooms = JSON.parse(body);
  roomID = 0;
  for(var i=0; i<rooms['community'].length; i++){
    if (rooms['community'][i].name == roomName){
      roomID = rooms['community'][i].id;
    }
  }
  let response2 = await fetch('http://localhost:8090/roomavailability?type=community&id='+roomID, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
  });
  let body2 = await response2.text();
  var availability = JSON.parse(body2);
  for(var i=1; i< 14; i++){
    document.getElementById('timeTable' + i).innerHTML = 'Avaliable';
  }
  for(var i=0; i< availability.busy.length; i++){
    if(availability["busy"][i].start.substring(0,10) == dateCombined){
      for(var j= availability["busy"][i].start.substring(11,13); j<=availability["busy"][i].end.substring(11,13); j++ ){

        document.getElementById('timeTable' + (j-8).toString()).innerHTML = 'Busy';
      }
    }
  }
  document.getElementById("roomAvailabilityTable").hidden = false;
  document.getElementById("byAvaliability").hidden = true;
  document.getElementById("searchModalFooter").hidden = true;
};

async function searchForEvents(){
  name = document.getElementById("eventSearch").value;
  year = document.getElementById("yearEventSearch").value;
  month = document.getElementById("monthEventSearch").value;
  day = document.getElementById("dayEventSearch").value;
  var dateCombined = year+ '-' + month + '-' + day;
  if(dateCombined.length != 10){
    dateCombined = ''
  }
  try{
    let response = await fetch('http://localhost:8090/eventsearch?name=' + name + '&date=' + dateCombined,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
      });
    if(response.ok){
      var body = await response.text();
      var events = JSON.parse(body);
      document.getElementById('byEvent').hidden = true;
      document.getElementById('searchResults').innerHTML += '<h5> Found ' + events.length + ' match in the database </h5>';
      for(var i=0; i<events.length; i++){
        document.getElementById('searchResults').innerHTML += '<p> Name : ' + events[i].name + ' Description: ' + events[i].description + ' Capacity: ' + events[i].capacity;
      }
    } else {
      throw new Error('Error getting customers' + response.code);
    }
    } catch (error) {
      alert ('Problem: ' + error);
    }
  document.getElementById("searchModalFooter").hidden = true;
}

async function fillFindBy(){
  try{
    let response = await fetch('http://localhost:8090/customers',
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });
    if(response.ok){
      var body = await response.text();
      var customers = JSON.parse(body);
      for(var i = 0; i<customers.length; i++){
        document.getElementById('findByNameDropdown').innerHTML += '<a onclick="bookingView('+customers[i].id+')">' + customers[i].fName + ' ' + customers[i].lName + '</a>';
        document.getElementById('findByPhoneNumberDropdown').innerHTML += '<a onclick="bookingView('+customers[i].id+')">' + customers[i].phone + '</a>';
        document.getElementById('findByEmailDropdown').innerHTML += '<a onclick="bookingView('+customers[i].id+')">' + customers[i].email +  '</a>'
      }

    }else{
      throw new Error('Error getting customers' + response.code);
    }
    } catch (error) {
      alert ('Problem: ' + error);
    }
  }

async function bookingView(id){
  document.getElementById('makeBooking').hidden = false;
  document.getElementById('findBy').hidden = true;
  try{
    let response = await fetch('http://localhost:8090/customersearch?id='+id,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });
    if(response.ok){
      var body = await response.text();
      var customers = JSON.parse(body);
      document.getElementById('customerInfo').innerHTML= 'Customer Name:' + customers[0].fName + ' ' + customers[0].lName;

    }else{
      throw new Error('Error getting customers' + response.code);
    }
    } catch (error) {
      alert ('Problem: ' + error);
    }
}
