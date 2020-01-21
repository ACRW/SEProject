var submitAction = 0;

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchModalFooter").hidden = true;

  document.getElementById("searchSubmit").addEventListener("click", function(){
    switch(submitAction) {
      case 1:
        searchForUser()
        break;
      case 2:
      // code block
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

  updateRooms();
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
    roomDrop1 = document.getElementById("roomSelectDrop1");
    roomDrop2 = document.getElementById("roomSelectDrop2");
    for (i = 0; i < rooms.length; i++) {
        let option = document.createElement("option");
        option.text = rooms[i]["name"];
        roomDrop1.add(option);
        roomDrop2.add(option);
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
  time = document.getElementById("timeSelectSearch").value
  duration = document.getElementById("durationSelectSearch").value
  roomName = document.getElementById("roomSelectDrop2").value
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
    for(var j= availability["busy"][i].start.substring(11,13); j<=availability["busy"][i].end.substring(11,13); j++ ){

      document.getElementById('timeTable' + (j-8).toString()).innerHTML = 'Busy';
    }
  }
  document.getElementById("roomAvailabilityTable").hidden = false;
  document.getElementById("byAvaliability").hidden = true;
  document.getElementById("searchModalFooter").hidden = true;
};
