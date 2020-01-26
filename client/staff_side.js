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

  document.getElementById('bookingRoomDropdown').addEventListener('change',function(){
    fillPrice()
    fillBookingTable()
  });

  document.getElementById('numberOfGuests').addEventListener('change',function(){
    //fillHostelPrice()
    fillHostelDropdown()
    fillHostelBookingTable()
  });

  document.getElementById('hostelRoomsLargeEnough').addEventListener('change',function(){
    fillHostelPrice()
  });

  document.getElementById('bookingDurationTime').addEventListener('change',function(){
    calculatePrice()
  });

  document.getElementById('calenderNext').addEventListener('click',function(){
    fillBookingTable()
  })

  document.getElementById('calenderPrev').addEventListener('click',function(){
    fillBookingTable()
  })

  document.getElementById('hostelCalenderNext').addEventListener('click',function(){
    fillHostelBookingTable()
  })

  document.getElementById('hostelCalenderPrev').addEventListener('click',function(){
    fillHostelBookingTable()
  })
  updateRooms();

  fillFindBy();

  document.getElementById('day1').addEventListener('click',function(){
    document.getElementById('chosenDate').innerHTML = document.getElementById('day1').innerHTML
  })
  document.getElementById('day2').addEventListener('click',function(){
    if(document.getElementById('day2').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day2').innerHTML

  })
  document.getElementById('day3').addEventListener('click',function(){
    if(document.getElementById('day3').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day3').innerHTML
  })
  document.getElementById('day4').addEventListener('click',function(){
    if(document.getElementById('day4').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day4').innerHTML
  })
  document.getElementById('day5').addEventListener('click',function(){
    if(document.getElementById('day5').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day5').innerHTML
  })
  document.getElementById('day6').addEventListener('click',function(){
    if(document.getElementById('day6').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day6').innerHTML
  })
  document.getElementById('day7').addEventListener('click',function(){
    if(document.getElementById('day7').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day7').innerHTML
  })

  document.getElementById('hday1').addEventListener('click',function(){
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday1').innerHTML
  })
  document.getElementById('hday2').addEventListener('click',function(){
    if(document.getElementById('hday2').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday2').innerHTML

  })
  document.getElementById('hday3').addEventListener('click',function(){
    if(document.getElementById('hday3').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday3').innerHTML
  })
  document.getElementById('hday4').addEventListener('click',function(){
    if(document.getElementById('hday4').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday4').innerHTML
  })
  document.getElementById('hday5').addEventListener('click',function(){
    if(document.getElementById('hday5').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday5').innerHTML
  })
  document.getElementById('hday6').addEventListener('click',function(){
    if(document.getElementById('hday6').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday6').innerHTML
  })
  document.getElementById('hday7').addEventListener('click',function(){
    if(document.getElementById('hday7').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday7').innerHTML
  })

  document.getElementById('numberOfGuests').addEventListener('change',function(){
    if(Number.isInteger(parseInt(document.getElementById('numberOfGuests').value)) == false){
      document.getElementById('newHostelBookingError').innerHTML = 'Please enter an integer for number of guests'
    }else{
    document.getElementById('afterNumOfGuest').hidden = false
  }})

});

//runs get request to search for user in database and displays results
async function searchForUser(){
  fName = document.getElementById("firstnameSearch").value;
  sName = document.getElementById("surnameSearch").value;
  email = document.getElementById("emailSearch").value;
  phoneNumber = document.getElementById("phoneNoSearch").value;

  if((fName + sName + email + phoneNumber).length ==0 ){
    document.getElementById('searchError').innerHTML = 'Please enter at least one parameter to search by'

  }else{
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
      if(body=='0matches'){
        document.getElementById('searchResults').innerHTML += '<h5> No results found </h5>';
        document.getElementById('byUser').hidden = true;
      }else {
      var customers = JSON.parse(body);
      document.getElementById('byUser').hidden = true;
      document.getElementById('searchResults').innerHTML += '<h5> Found ' + customers.length + ' match in the database </h5>';
      for(var i=0; i<customers.length; i++){
        document.getElementById('searchResults').innerHTML += '<p> Name : ' + customers[i].fName + ' ' +  customers[i].lName + ' Email: ' + customers[i].email + ' Phone Number: ' + customers[i].phone;
        document.getElementById('searchResults').innerHTML += '<button type="button" class="btn btn-primary newColor" id="result'+i+'" data-toggle="modal" data-target="#viewUsersBookingsModal">View Bookings</button>';
        document.getElementById('result'+i).addEventListener('click', getUserBookings(customers[i].id));
      }
    }
    document.getElementById("searchModalFooter").hidden = true;
  } else if(response.status == 400){
    document.getElementById('searchError').innerHTML = 'Please enter at least one parameter to search by'
  }else{
      throw new Error('Error getting customers' + response.code);
    }
    } catch (error) {
      alert ('Problem: ' + error);
    }
  }


}

//creates tables from users community and hostel bookings
async function getUserBookings(customerID){
  if(customerID==''){
    document.getElementById('usersBookingError').innerHTML = 'Error getting customer ID'
  }else{
  var exist =  await checkCustomerExists(customerID)

  if(exist == true){
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
        console.log(body)
        var bookings = JSON.parse(body);
        if(bookings['community']!= null){
          for(var i=0;i<bookings['community'].length;i++){
            tableRow='<tr><th scope="row">'+bookings['community'][i].bookingID+'</th><td>'+bookings['community'][i].start+'</td><td>'+bookings['community'][i].end+'</td><td>'+bookings['community'][i].priceOfBooking+'</td><td>'+bookings['community'][i].paid+'</td><td>'+ bookings['community'][i].name+'</td></tr>';
            document.getElementById('usersCommunityBookingTableBody').innerHTML += tableRow;
          }
        }
        if(bookings['hostel']!= null){
          for(var i=0;i<bookings['hostel'].length;i++){
            tableRow='<tr><th scope="row">'+bookings['hostel'][i].bookingID+'</th><td>'+bookings['hostel'][i].startDate+'</td><td>'+bookings['hostel'][i].endDate+'</td><td>'+bookings['hostel'][i].roomID+'</td><td>'+bookings['hostel'][i].pricePerNight+'</td><td>'+ bookings['hostel'][i].noOfPeople+'</td></tr>';
            document.getElementById('usersHostelBookingTableBody').innerHTML += tableRow;
          }
        }
        if(bookings['community'].length == null && bookings['hostel'].length == null){
          document.getElementById('usersBookingError').innerHTML = 'User has no bookings'
        }
      } else{
        throw new Error('Error getting customers' + response.code);
      }
      } catch (error) {
        alert ('Problem: ' + error);
      }
    }else{
      document.getElementById('usersBookingError').innerHTML = 'User does not exist in the database'
    }
  }
}

//fills drop boxes
async function updateRooms() {
    const rooms = await getCommunityRooms();
    if(rooms == 'Error'){
      document.getElementById('errorMessage').innerHTML = 'Error fetching community rooms'
    }else{
    roomDrop = document.getElementById("roomSelectDrop");
    bookRoomDrop = document.getElementById("bookingRoomDropdown");
    for (i = 0; i < rooms.length; i++) {
        let option = document.createElement("option");
        let option2 = document.createElement("option");
        option.text = rooms[i]["name"];
        option2.text = rooms[i]["name"];
        option.value = rooms[i]["id"];
        option2.value = rooms[i]["id"];
        bookRoomDrop.add(option2);
        roomDrop.add(option);
    }
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

async function fillHostelDropdown(){
  hostelRoomDrop = document.getElementById("hostelRoomsLargeEnough");
  guestNum = document.getElementById('numberOfGuests').value

  if(Number.isInteger(parseInt(guestNum)) == false){
  document.getElementById('newHostelBookingError').innerHTML= 'Please enter an integer for number of guests'
}else{
  try{
  let response = await fetch('http://localhost:8090/roomslargeenough?guestnum=' + guestNum, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
  });
  if(response.ok){

  let body = await response.text();
  if(body == '0matches'){
    document.getElementById('newHostelBookingError').innerHTML = 'No rooms large enough for number of guests try splitting party into several smaller ones.'
    document.getElementById('afterNumOfGuest').hidden = true
  }else{
  var rooms = JSON.parse(body);
  for(var i=0; i<rooms.length;i++){
    let option = document.createElement("option")
    option.text = rooms[i].roomNumber.padStart(3,'0') + '£' + rooms[i].pricePerNight
    option.value = rooms[i].id
    hostelRoomDrop.add(option);

  }
}
}else{
  throw new Error('Error getting Rooms' + response.code);
  return 'Error'
}
}catch (error){
  alert ('Error: ' + error);
}
}
}

async function getCommunityRooms(startDate, endDate) { // Need to add error handling at some point.
    try{
    let response = await fetch('http://localhost:8090/rooms?types=community', {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if(response.ok){
    let body = await response.text();
    var rooms = JSON.parse(body);
    return rooms["community"]
  }else{
    throw new Error('Error getting Rooms' + response.code);
    return 'Error'
  }
  }catch (error){
    alert ('Error: ' + error);
  }
}

async function searchForAvaliability(){
  roomName = document.getElementById("roomSelectDrop").value;
  year = document.getElementById("yearAvaliableSearch").value;
  month = document.getElementById("monthAvaliableSearch").value;
  day = document.getElementById("dayAvaliableSearch").value;
  dateCombined = year+ '-' + month + '-' + day;
  if(roomName == '' || dateCombined== '--'){
    document.getElementById(avaliabiltySearchError).innerHTML = 'Please fill all parameters for the search'
  }else{
  try{
  let response = await fetch('http://localhost:8090/rooms?types=community', {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
  });
  if(response.ok){
  let body = await response.text();
  var rooms = JSON.parse(body);
  roomID = 0;
  if(rooms['community'].length == 0){
    document.getElementById(avaliabiltySearchError).innerHTML = 'No rooms found in the database'
  }else{
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
  if(response2.ok){
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
}else{
  throw new Error('Error getting Rooms' + response.code);
  document.getElementById(avaliabiltySearchError).innerHTML = 'Error checking avaliabilty of room'

}
}
}else{
  throw new Error('Error getting Rooms' + response.code);
  document.getElementById(avaliabiltySearchError).innerHTML = 'Error fetching rooms from the database'
}
}catch(error){
  alert ('Error: ' + error);
}
}
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
  if(name == '' && dateCombined== ''){
    document.getElementById('eventSearchError').innerHTML = 'Please enter at least one parameter to search by'
  }else{
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
      if(body=='0matches'){
        document.getElementById('byEvent').hidden = true;
        document.getElementById('searchResults').innerHTML += '<h5> No results found </h5>';
      }else{
      var events = JSON.parse(body);
      document.getElementById('byEvent').hidden = true;
      document.getElementById('searchResults').innerHTML += '<h5> Found ' + events.length + ' match in the database </h5>';
      for(var i=0; i<events.length; i++){
        document.getElementById('searchResults').innerHTML += '<p> Name : ' + events[i].name + ' Description: ' + events[i].description + ' Capacity: ' + events[i].capacity;
      }
    }
    } else {
      throw new Error('Error getting customers' + response.code);
      document.getElementById('eventSearchError').innerHTML = 'Please enter at least one parameter to search by'
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
  document.getElementById("searchModalFooter").hidden = true;
}
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
        document.getElementById('findByNameDropdown0').innerHTML += '<a onclick="bookingView('+customers[i].id+')">' + customers[i].fName + ' ' + customers[i].lName + '</a>';
        document.getElementById('findByPhoneNumberDropdown0').innerHTML += '<a onclick="bookingView('+customers[i].id+')">' + customers[i].phone + '</a>';
        document.getElementById('findByEmailDropdown0').innerHTML += '<a onclick="bookingView('+customers[i].id+')">' + customers[i].email +  '</a>'
        document.getElementById('findByNameDropdown1').innerHTML += '<a onclick="hostelBookingView('+customers[i].id+')">' + customers[i].fName + ' ' + customers[i].lName + '</a>';
        document.getElementById('findByPhoneNumberDropdown1').innerHTML += '<a onclick="hostelBookingView('+customers[i].id+')">' + customers[i].phone + '</a>';
        document.getElementById('findByEmailDropdown1').innerHTML += '<a onclick="hostelBookingView('+customers[i].id+')">' + customers[i].email +  '</a>'

      }

    }else{
      throw new Error('Error getting customers' + response.code);
      document.getElementById('errorMessage').innerHTML = 'Error fetching customers'
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
    try{
      let response = await fetch('http://localhost:8090/events',
        {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
            }
        });
      if(response.ok){
        var body = await response.text();
        var events = JSON.parse(body);
        for(var i = 0; i<events.length; i++){

          document.getElementById('findByEventNameDropdown').innerHTML += '<a onclick="eventStatsView('+events[i].id+')">' + events[i].name + '</a>';
        }
      }else{
        throw new Error('Error getting events' + response.code);
        document.getElementById('errorMessage').innerHTML = 'Error fetching events'
      }
      } catch (error) {
        alert ('Error: ' + error);
      }
  }

async function bookingView(id){
  document.getElementById('makeBooking').hidden = false;
  document.getElementById('findBy').hidden = true;
  if(id == null){
    document.getElementById('errorMessage').innerHTML = 'No id supplied when searching for customer'
  }else{
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
      document.getElementById('bookingButtonDiv').innerHTML = '<div class="col-sm-3"><a class="btn btn-primary newColor" href="#" role="button" onclick="newBooking('+customers[0].id+')">Book & Pay at desk</a></div>'

    }else{
      throw new Error('Error getting customers' + response.code);
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
  }
}

async function hostelBookingView(id){
  document.getElementById('makeHostelBooking').hidden = false;
  document.getElementById('findBy1').hidden = true;
  if(id == null){
    document.getElementById('errorMessage').innerHTML = 'No id supplied when searching for customer'
  }else{
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
      document.getElementById('customerInfo1').innerHTML= 'Customer Name:' + customers[0].fName + ' ' + customers[0].lName;
      document.getElementById('hostelBookingButtonDiv').innerHTML = '<div class="col-sm-3"><a class="btn btn-primary newColor" href="#" role="button" onclick="newHostelBooking('+customers[0].id+')">Book & Pay at desk</a></div>'

    }else{
      throw new Error('Error getting customers' + response.code);
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
  }
}

async function eventStatsView(id){
  try{
    let response = await fetch('http://localhost:8090/eventstatistics?id='+id,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });
    if(response.ok){
      var body = await response.text();
      if(body == '0matches'){
        document.getElementById('eventStatistics').innerHTML = "No matches found";
      }else{
      var stats = JSON.parse(body);
      document.getElementById('eventStatistics').innerHTML = "Event Name: " + stats[0].name + " Description: " + stats[0].description + " Tickets Sold: " + stats[0].numSold + '/' + stats[0].capacity;
    }
    }else{
      throw new Error('Error getting statistics' + response.code);
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
}

async function newBooking(id){
  startTime = parseInt(document.getElementById('bookingStartTime').value) + 8;
  duration = document.getElementById('bookingDurationTime').value;
  day = document.getElementById('chosenDate').innerHTML.substring(4)
  month =  document.getElementById('chosenDate').value
  free = true
  if(startTime == '' || duration == '' || day == '' || month == null){
    document.getElementById('newBookingError').innerHTML = 'Please fill in all sections'
  }else{
  if(duration == 0.5){
    endTime = new Date(2020, month, day, startTime, 30, 0, 0).getTime()/1000;
    if(document.getElementById(startTime + '.' + day + '.' + month).innerHTML == 'Busy'){
      document.getElementById('newBookingError').innerHTML = 'Room is busy at that time'
      free = false
    }
  }else if(duration == 1){
    endTime = new Date(2020, month, day, startTime + 1, 0, 0, 0).getTime()/1000;
    if(document.getElementById(startTime + '.' + day + '.' + month).innerHTML == 'Busy'){
      document.getElementById('newBookingError').innerHTML = 'Room is busy at that time'
      free = false
    }
  }else if(duration == 1.5){
    endTime = new Date(2020, month, day, startTime+1, 30, 0, 0).getTime()/1000;
    if(document.getElementById(startTime + '.' + day + '.' + month).innerHTML == 'Busy' || document.getElementById((parseInt(startTime)+1).toString() + '.' + day + '.' + month).innerHTML == 'Busy'){
      document.getElementById('newBookingError').innerHTML = 'Room is busy at that time'
      free=false
    }
  }else{
    endTime = new Date(2020, month, day, startTime+2, 0, 0, 0).getTime()/1000;
    if(document.getElementById(startTime + '.' + day + '.' + month).innerHTML == 'Busy' || document.getElementById((parseInt(startTime)+1).toString() + '.' + day + '.' + month).innerHTML == 'Busy'){
      document.getElementById('newBookingError').innerHTML = 'Room is busy at that time'
      free=false
    }
  }
  if(free == true){
  startTime = new Date(2020, month, day, startTime, 0, 0, 0).getTime()/1000;
  roomId = document.getElementById('bookingRoomDropdown').value;
  price = document.getElementById('totalBookingPrice').innerText;
  paid = 0
  let response = await fetch('http://localhost:8090/staffcommunitybooking',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'customerid=' + id + '&roomid=' + roomId + '&start=' + startTime + '&end=' + endTime + '&price=' + price + '&paid=' + paid
    });
  if(!response.ok){
    throw new Error('problem adding new event ' + response.code);
  }else{
    document.getElementById('newBookingError').innerHTML='Booking successful'

  }
}
}
}

async function newHostelBooking(id){
  if(numberOfGuests)
  startDay = document.getElementById('chosenHostelDate').innerHTML.substring(4)
  month =  document.getElementById('chosenHostelDate').value
  endMonth = month
  numberOfGuests = document.getElementById('numberOfGuests').value
  if(Number.isInteger(parseInt(numberOfGuests)) == false){
    document.getElementById('newHostelBookingError').innerHTML= 'Please enter an integer for number of guests'
  }else if(startDay == '' || numberOfGuests == '' || month == null){
    document.getElementById('newHostelBookingError').innerHTML= 'Please fill in all fields to complete booking'
  }else{
  numberOfNights = document.getElementById('numberOfNights').value
  endDay = (parseInt(startDay) + parseInt(numberOfNights)) % daysInMonth(2020,month)
  if(endDay<startDay){
    endMonth = month +1

  }else{
    endMonth = month
  }
  startTime = new Date(2020, month, startDay, 0, 0, 0, 0).getTime()/1000;
  endTime = new Date(2020, endMonth, endDay, 0, 0, 0, 0).getTime()/1000;

  roomId = document.getElementById('hostelRoomsLargeEnough').value;
  let response = await fetch('http://localhost:8090/staffhostelbooking',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'customerid=' + id + '&roomid=' + roomId + '&start=' + startTime + '&end=' + endTime
    });
  if(!response.ok){
    throw new Error('problem adding new event ' + response.code);
  }else{
    document.getElementById('newHostelBookingError').innerHTML='Booking successful'
    resetHostelBooking()
  }
}
}

async function fillPrice(){
  roomId = document.getElementById('bookingRoomDropdown').value;
  if(roomId==''){
    document.getElementById('newBookingError').innerHTML='Room id not supplied'
  }else{
  try{
    let response = await fetch('http://localhost:8090/communityroomprice?id='+roomId,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });
    if(response.ok){
      var body = await response.text();
      if(body=='0matches'){
    }else{
      var price = JSON.parse(body);
      document.getElementById('roomName').innerText = price[0].name;
      document.getElementById('roomPricePerHour').innerText = price[0].pricePerHour
    }
    }else{
      throw new Error('Error getting statistics' + response.code);
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
  }
}

function fillHostelPrice(){
    document.getElementById('numPeople').innerHTML= document.getElementById('numberOfGuests').value;

    document.getElementById('hostelRoomPricePerHour').innerHTML = document.getElementById('hostelRoomsLargeEnough').options[document.getElementById('hostelRoomsLargeEnough').selectedIndex].text.substring(4);
    console.log
    document.getElementById('totalHostelBookingPrice').innerHTML = parseInt(document.getElementById('numPeople').innerHTML) * parseInt(document.getElementById('hostelRoomPricePerHour').innerHTML)

}

function calculatePrice(){
  price = document.getElementById('roomPricePerHour').innerText * document.getElementById('bookingDurationTime').value
  document.getElementById('totalBookingPrice').innerText = price
}

async function fillBookingTable(){
  roomId = document.getElementById('bookingRoomDropdown').value;
  if(roomId==null){
    document.getElementById('newBookingError').innerHTML='Room id not supplied'
  }else{
  try{
    let response = await fetch('http://localhost:8090/roomavailability?type=community&id='+roomId,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });
    if(response.ok){
      var body = await response.text();

      var busy = JSON.parse(body);
      for(var i =0; i<busy["busy"].length; i++){
        for(var j= busy["busy"][i].start.substring(11,13); j<=busy["busy"][i].end.substring(11,13); j++ ){
          if(document.getElementById(j.toString() + '.' + busy["busy"][i].start.substring(2,4)+ '.' + (parseInt(busy["busy"][i].start.substring(5,7))-1) ) != null){
            document.getElementById(j.toString() + '.' + busy["busy"][i].start.substring(2,4)+ '.' + (parseInt(busy["busy"][i].start.substring(5,7))-1) ).innerHTML = 'Busy';
          }

      }
    }
    }else{
      throw new Error('Error getting statistics' + response.code);
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
}
}

async function fillHostelBookingTable(){

  guestNum = document.getElementById('numberOfGuests').value;
  if(Number.isInteger(parseInt(guestNum)) == false){
    document.getElementById('newHostelBookingError').innerHTML= 'Please enter an integer for number of guests'
  }else {
  if(guestNum==''){
    document.getElementById('newHostelBookingError').innerHTML='Guest number not supplied'
  }else{
  month =  document.getElementById('chosenHostelDate').value
  document.getElementById('hostelFull').innerHTML = '<td>Full</td>'
  for(var i = 1; i<8;i++){
    day = document.getElementById('hday'+i).innerHTML.substring(4)
    if(day==1 && i!=1){
      month = month +1
    }

    date = new Date(2020, month, day, 0, 0, 0, 0).getTime()/1000;
  try{
    let response = await fetch('http://localhost:8090/checkhostelavaliability?date='+ date +'&guestNum=' + guestNum,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });
    if(response.ok){
      var body = await response.text();

      if(body == 'true'){
        document.getElementById('hostelFull').innerHTML += '<td>Full</td>'
      }else{
        document.getElementById('hostelFull').innerHTML += '<td></td>'
      }

    }else{
      throw new Error('Error getting room avaliabilty' + response.code);
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
}
}
}
}

async function checkCustomerExists(id){
  try{
    let response = await fetch('http://localhost:8090/customerexists?id='+id,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });
    if(response.ok){
      var body = await response.text();
      if(body == '0matches'){
        return false
      }else{
        return true
      }
    }else{
      throw new Error('Error checking for existance' + response.code);
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
}

function resetHostelBooking(){
  document.getElementById('afterNumOfGuest').hidden=true;
  document.getElementById('numberOfGuests').value = '';
}
