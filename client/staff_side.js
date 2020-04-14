/*

//hide submit button for editbookingModal
document.getElementById("editBookingModalFooter").hidden = true;

//on submit on editbookingModal
document.getElementById("searchBookingSubmitBtn").addEventListener("click", function()

//change submit action on selection of type of booking
document.getElementById("activityBookingSearchFormBtn").addEventListener("click", function()

//change submit action on selection of type of booking
document.getElementById("communityBookingSearchFormBtn").addEventListener("click", function()

//change submit action on selection of type of booking
document.getElementById("hostelBookingSearchFormBtn").addEventListener("click", function()

//runs get request to search activity booking in database and displays results
async function searchActivityBooking()

//runs get request to search community booking in database and displays results
async function searchCommunityBooking()

//runs get request to search hostel booking in database and displays results
async function searchHostelBooking()

//creates tables from users activity bookings only
async function viewUserActivityBookings()

//creates tables from users community bookings only
async function viewUserCommunityBookings()

//creates tables from users hostel bookings only
async function viewUserHostelBookings()

//on sumbit on updateActivityBookingModal
document.getElementById('updateActivityBookingSubmitBtn').addEventListener('click',function(

//on sumbit on updateCommunityBookingModal
document.getElementById('updateCommunityBookingSubmitBtn').addEventListener('click',function()

//on sumbit on updateHostelBookingModal
  document.getElementById('updateHostelBookingSubmitBtn').addEventListener('click',function()

//update activity booking
async function updateActivityBooking()

//update community booking
async function updateCommunityBooking()

//update hostel booking
async function updateHostelBooking()

//cancel activity booking
async function cancelUserActivityBookings(activityBookingId)

//cancel commuity booking
async function cancelUserCommunityBookings(communityBookingId)
*/

var submitAction = 0;
var week = 1;
//holds the current date for calender use
var n =  new Date();
var y = n.getYear();
var m = n.getMonth() + 1;
var d = n.getDate();
var day = n.getDay();

//on loading of content
document.addEventListener("DOMContentLoaded", function () {

  //sets up the calender dates to the current week
  for(var i = 1; i <8 ; i++){
        var x = day-i;
        document.getElementById('cday' + i).innerHTML = (d-x).toString().padStart(2,'0') + '/' + m.toString().padStart(2,'0');

        //dealing with weeks that wrap over months
        if(isValidDate(d-x,m,y) == false){
            document.getElementById('cday' + i).innerHTML = (d-x  + daysInMonth(y,m-1) ).toString().padStart(2,'0')+ '/' + (m -1).toString().padStart(2,'0');
        }
    }

  //hide submit button
  document.getElementById("searchModalFooter").hidden = true;

  //on submit on search modal
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

  //change submit action on selection of type of search
  document.getElementById("searchUser").addEventListener("click", function(){
    submitAction = 1;
  });

  //change submit action on selection of type of search
  document.getElementById("searchEvent").addEventListener("click", function(){
    submitAction = 2;
  });

  //change submit action on selection of type of search
  document.getElementById("searchAvaliability").addEventListener("click", function(){
    submitAction = 3;
  });

  //hide submit button for editbookingModal
  document.getElementById("editBookingModalFooter").hidden = true;

  //on submit on editbookingModal
  document.getElementById("searchBookingSubmitBtn").addEventListener("click", function(){
    switch(submitActionforeditbookingModal) {
      case 1:
        searchActivityBooking()
        break;
      case 2:
        searchCommunityBooking()
        break;
      case 3:
        searchHostelBooking()
        break;
      default:
      // code block
    }
  });

  //on sumbit on updateActivityBookingModal
  document.getElementById('updateActivityBookingSubmitBtn').addEventListener('click',function(){
    updateActivityBooking()
  });

  //on sumbit on updateCommunityBookingModal
  document.getElementById('updateCommunityBookingSubmitBtn').addEventListener('click',function(){
    updateCommunityBooking()
  });

  //on sumbit on updateHostelBookingModal
  document.getElementById('updateHostelBookingSubmitBtn').addEventListener('click',function(){
    updateHostelBooking()
  });

  //change submit action on selection of type of booking
  document.getElementById("activityBookingSearchFormBtn").addEventListener("click", function(){
    submitActionforeditbookingModal = 1;
  });

  //change submit action on selection of type of booking
  document.getElementById("communityBookingSearchFormBtn").addEventListener("click", function(){
    submitActionforeditbookingModal = 2;
  });

  //change submit action on selection of type of booking
  document.getElementById("hostelBookingSearchFormBtn").addEventListener("click", function(){
    submitActionforeditbookingModal = 3;
  });

  //on choosing year reveal months
  document.getElementById("yearAvaliableSearch").addEventListener("change", function(){
    document.getElementById("monthAvaliableSearchLabel").hidden = false;
    document.getElementById("monthAvaliableSearch").hidden = false;
  });

  //on choosing month reveal day and fill day drop down
  document.getElementById("monthAvaliableSearch").addEventListener("change", function(){
    document.getElementById("dayAvaliableSearchLabel").hidden = false;
    document.getElementById("dayAvaliableSearch").hidden = false;

    //fill day drop with correct amount of days
    year = document.getElementById("yearAvaliableSearch").value;
    month = document.getElementById("monthAvaliableSearch").value;
    fillDayDrop(year,month,"AvaliableSearch")
  });

  //on choosing year reveal months
  document.getElementById("yearEventSearch").addEventListener("change", function(){
    document.getElementById("monthEventSearchLabel").hidden = false;
    document.getElementById("monthEventSearch").hidden = false;
  });

  //on choosing month reveal days and fill day drop down
  document.getElementById("monthEventSearch").addEventListener("change", function(){
    document.getElementById("dayEventSearchLabel").hidden = false;
    document.getElementById("dayEventSearch").hidden = false;

    //fill day drop with correct amount of days
    year = document.getElementById("yearEventSearch").value;
    month = document.getElementById("monthEventSearch").value;
    fillDayDrop(year,month,"EventSearch")
  });

  //on choosing year reveal months
  document.getElementById("yearEventNew").addEventListener("change", function(){
    document.getElementById("monthEventNewLabel").hidden = false;
    document.getElementById("monthEventNew").hidden = false;
  });

  //on choosing month reveal days and fill day drop down
  document.getElementById("monthEventNew").addEventListener("change", function(){
    document.getElementById("dayEventNewLabel").hidden = false;
    document.getElementById("dayEventNew").hidden = false;

    //fill day drop with correct amount of days
    year = document.getElementById("yearEventNew").value;
    month = document.getElementById("monthEventNew").value;
    fillDayDrop(year,month,"EventNew")
  });

  //on choosing year reveal months
  document.getElementById("yearActivityNew").addEventListener("change", function(){
    document.getElementById("monthActivityNewLabel").hidden = false;
    document.getElementById("monthActivityNew").hidden = false;
  });

  //on choosing month reveal days and fill day drop down
  document.getElementById("monthActivityNew").addEventListener("change", function(){
    document.getElementById("dayActivityNewLabel").hidden = false;
    document.getElementById("dayActivityNew").hidden = false;

    //fill day drop with correct amount of days
    year = document.getElementById("yearActivityNew").value;
    month = document.getElementById("monthActivityNew").value;
    fillDayDrop(year,month,"ActivityNew")
  });

  //when new booking button clicked reset form, hide parts and reveal others
  document.getElementById("newBookingButton").addEventListener('click',function(){
    document.getElementById("findBy").hidden = false;
    document.getElementById("makeBooking").hidden = true;

  })

  //once a room selected fill price and avaliabilty table
  document.getElementById('bookingRoomDropdown').addEventListener('change',function(){
    //gets price
    fillPrice()

    //fills table with avaliabilty of room
    fillBookingTable()
  });

  //once number of guests entered
  document.getElementById('numberOfGuests').addEventListener('change',function(){
    //selects all rooms that can fit the correct number of guests
    fillHostelDropdown()
  });

  //once room selected
  document.getElementById('hostelRoomsLargeEnough').addEventListener('change',function(){
    //fill price
    fillHostelPrice()

    //fill avaliabilty of room
    fillHostelBookingTable()
  });

  document.getElementById('numOfPeopleActivity').addEventListener('change',function(){
    fillActivityPrice()
  })

  //once booking duration is selected
  document.getElementById('bookingDurationTime').addEventListener('change',function(){
    //calculate and display the final price
    calculatePrice()
  });

  //on next button
  document.getElementById('calenderNext').addEventListener('click',function(){
    //update avaliabilty table
    fillBookingTable()
  })

  //on prev button
  document.getElementById('calenderPrev').addEventListener('click',function(){
    //update avaliabilty table
    fillBookingTable()
  })

  //on next button
  document.getElementById('hostelCalenderNext').addEventListener('click',function(){
    //update avaliabilty table
    fillHostelBookingTable()
  })

  //on prev button
  document.getElementById('hostelCalenderPrev').addEventListener('click',function(){
    //update avaliabilty table
    fillHostelBookingTable()
  })

  //update list of rooms
  updateRooms();

  //fill search dropdowns
  fillFindBy();

  fillActivities();

  //on click of day header set chosen date
  document.getElementById('day1').addEventListener('click',function(){
    document.getElementById('chosenDate').innerHTML = document.getElementById('day1').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('day2').addEventListener('click',function(){
    if(document.getElementById('day2').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day2').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('day3').addEventListener('click',function(){
    if(document.getElementById('day3').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day3').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('day4').addEventListener('click',function(){
    if(document.getElementById('day4').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day4').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('day5').addEventListener('click',function(){
    if(document.getElementById('day5').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day5').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('day6').addEventListener('click',function(){
    if(document.getElementById('day6').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day6').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('day7').addEventListener('click',function(){
    if(document.getElementById('day7').innerHTML.substring(4) == 1){
      document.getElementById('chosenDate').value = document.getElementById('chosenDate').value + 1
    }
    document.getElementById('chosenDate').innerHTML = document.getElementById('day7').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('hday1').addEventListener('click',function(){
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday1').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('hday2').addEventListener('click',function(){
    if(document.getElementById('hday2').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday2').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('hday3').addEventListener('click',function(){
    if(document.getElementById('hday3').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday3').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('hday4').addEventListener('click',function(){
    if(document.getElementById('hday4').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday4').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('hday5').addEventListener('click',function(){
    if(document.getElementById('hday5').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday5').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('hday6').addEventListener('click',function(){
    if(document.getElementById('hday6').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday6').innerHTML
  })

  //on click of day header set chosen date
  document.getElementById('hday7').addEventListener('click',function(){
    if(document.getElementById('hday7').innerHTML.substring(4) == 1){
      document.getElementById('chosenHostelDate').value = document.getElementById('chosenHostelDate').value + 1
    }
    document.getElementById('chosenHostelDate').innerHTML = document.getElementById('hday7').innerHTML
  })

  //on entering number of guests
  document.getElementById('numberOfGuests').addEventListener('change',function(){
    //check if integer
    if(Number.isInteger(parseInt(document.getElementById('numberOfGuests').value)) == false){

      //print error message
      document.getElementById('newHostelBookingError').innerHTML = 'Please enter an integer for number of guests'
    }else{

    //show form for booking hostel room
    document.getElementById('afterNumOfGuest').hidden = false
  }})

  //create new ticket type
  document.getElementById('newTicketType').addEventListener('click',function(){
    addTicketType()
  })

  //creates new event on enter
  document.getElementById('createNewEvent').addEventListener('click',function(){
    createNewEvent()
  })

  //when customer id div changed get the user bookings
  document.getElementById('customerId').addEventListener('change',function(){
    getUserBookings()
  })

  //when notifications selected
  document.getElementById('notificationButton').addEventListener('click',function(){
    getNotifications()
  })

  //moves the calender forward a week
  document.getElementById('nextWeek').addEventListener('click', function(){
    m = forwardWeek(m)
  })

  //moves the calender back a week
  document.getElementById('prevWeek').addEventListener('click', function(){
    m = backWeek(m)
  })

  //on click trys to mkae payment in database
  document.getElementById('makePaymentButton').addEventListener('click', function(){
    makePayment()
  })

  //fills the calender with bookings for that week
  fillCalender()
});

//checks if date is valid ie 30th Feb not valid
function isValidDate(d, m, y) {
    m = parseInt(m, 10) - 1;
    return m >= 0 && m < 12 && d > 0 && d <= daysInMonth(y, m);
}



function aforwardWeek(m){
    for(var i = 1; i <8 ; i++){
      var x = parseInt(document.getElementById('cday' + i).innerHTML.substring(0,2)) + 7;

      document.getElementById('cday' + i).innerHTML = x.toString().padStart(2,'0') + '/' + m.toString().padStart(2,'0');
    }
}


//changing the calender to the next week
function forwardWeek(m){

  overMonth = false
  for(var i = 1; i <8 ; i++){
      var x = parseInt(document.getElementById('cday' + i).innerHTML.substring(0,2)) + 7;
      document.getElementById('cday' + i).innerHTML = x.toString().padStart(2,'0') + '/' + m.toString().padStart(2,'0');
      if(isValidDate(x,m-1,y) == false && overMonth == false){


          if(daysInMonth(y,m)-x == 0){
            document.getElementById('cday' + i).innerHTML = ((x)% daysInMonth(y,m-1)).toString().padStart(2,'0') + '/' + m.toString().padStart(2,'0');

            m = m+ 1;
            overMonth = true

          }else if(daysInMonth(y,m)-x == -1 && overMonth == false ){

            m = m+ 1;
            overMonth = true
            document.getElementById('cday' + i).innerHTML = ((x)% daysInMonth(y,m-1)).toString().padStart(2,'0') + '/' + m.toString().padStart(2,'0');

          }else{
            document.getElementById('cday' + i).innerHTML = ((x)% daysInMonth(y,m-1)).toString().padStart(2,'0') + '/' + m.toString().padStart(2,'0');
          }
      }else{
        if(isValidDate(x,m-2,y) == false && overMonth == true){
          document.getElementById('cday' + i).innerHTML = ((x)% daysInMonth(y,m-1)).toString().padStart(2,'0') + '/' + m.toString().padStart(2,'0');

        }
      }
  }
  week +=1
  if( week == 3){
        document.getElementById('nextWeek').style.visibility = 'hidden';
    }else{
        document.getElementById('prevWeek').style.visibility = 'visible';
    }
  //updates calender
  fillCalender()
  return m
}

//changing the calender to the previous week
function backWeek(m){
    var monthSub = false;
    for(var i = 7; i > 0 ; i--){
        var x = parseInt(document.getElementById('cday' + i).innerHTML) - 7;
        document.getElementById('cday' + i).innerHTML = x.toString().padStart(2,'0') + '/' + m.toString().padStart(2,'0');
        if(isValidDate(x,m-1,y) == false){
            console.log(x)
            if(x == 0 && monthSub == false){
                document.getElementById('cday' + i).innerHTML = (x + daysInMonth(y,m)).toString().padStart(2,'0') + '/' + (m).toString().padStart(2,'0');

                m = m-1;
                monthSub = true;
            }else{
                document.getElementById('cday' + i).innerHTML =  (daysInMonth(y,m-1) + x).toString().padStart(2,'0') + '/' + (m).toString().padStart(2,'0');
            }
        }
    }
    week += -1
    if(week == -1){
        document.getElementById('prevWeek').style.visibility = 'hidden';
    }else{
        document.getElementById('nextWeek').style.visibility = 'visible';
    }
  //update calender
  fillCalender()
  return m
}

//runs get request to search for user in database and displays results
async function searchForUser(){
  document.getElementById('usersBookingError').innerHTML = ''

  //get parameters for search
  fName = document.getElementById("firstnameSearch").value;
  sName = document.getElementById("surnameSearch").value;
  email = document.getElementById("emailSearch").value;
  phoneNumber = document.getElementById("phoneNoSearch").value;

  //check that at least one parameter has been filled
  if((fName + sName + email + phoneNumber).length ==0 ){

    //error message if nothing to search by
    document.getElementById('searchError').innerHTML = 'Please enter at least one parameter to search by'

  }else{

    //find customer in the database
    try{
      let response = await fetch('http://localhost:8090/customersearch?fname=' + fName + '&sname=' + sName + '&email=' + email + '&phone=' + phoneNumber,
        {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
            }
          });

    //if response is fine
    if(response.ok){
      var body = await response.text();

      //if no matches found in the database
      if(body=='0matches'){

        //error message of no results found
        document.getElementById('searchResults').innerHTML += '<h5> No results found </h5>';
        document.getElementById('byUser').hidden = true;
      }else {

        //get customers
        var customers = JSON.parse(body);
        document.getElementById('byUser').hidden = true;

        //inform customer of how many customers found in the database
        document.getElementById('searchResults').innerHTML += '<h5> Found ' + customers.length + ' match in the database </h5>';
        //for each matching customer display
        for(var i=0; i<customers.length; i++){
          document.getElementById('searchResults').innerHTML += '<p> Name : ' + customers[i].fName + ' ' +  customers[i].lName + ' Email: ' + customers[i].email + ' Phone Number: ' + customers[i].phone;

        }
        if(customers.length != 1){
          document.getElementById('searchResults').innerHTML += '<h5> Please narrow search down to one customer to view bookings made by them </h5>';

        }else{
          document.getElementById('searchResults').innerHTML += '<button type="button" class="btn btn-primary newColor" id="result0" data-toggle="modal" data-target="#viewUsersBookingsModal" onclick=setUser('+customers[0].id+')>View Bookings</button>';
          //on click of button
          document.getElementById('result0').addEventListener('click', function(){
            getUserBookings()
            });
          }
        }


        document.getElementById("searchModalFooter").hidden = true;

        //if no parameters sent to the database
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
async function getUserBookings(){


  //get customer id
  customerID = document.getElementById('customerId').value

  //if no customer id provided
  if(customerID==''){

    //error message
    document.getElementById('usersBookingError').innerHTML = 'Error getting customer ID'
  }else{

    //check customer exists
    var exist =  await checkCustomerExists(customerID)
    if(exist == true){

      //get all bookings the customer has made
      try{
        let response = await fetch('http://localhost:8090/customerbookings?id=' + customerID,
        {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
            }
          });

          //if response is fine
          if(response.ok){
            var body = await response.text();
            if(body == '0bookings'){
              document.getElementById('usersBookingError').innerHTML = 'No bookings found for that user'
            }else{
            var bookings = JSON.parse(body);


            //if community bookings made
            if(bookings['community']!= null){

              //go through all the bookings to display them
              for(var i=0;i<bookings['community'].length;i++){
                tableRow='<tr><th scope="row">'+bookings['community'][i].bookingID+'</th><td>'+bookings['community'][i].start+'</td><td>'+bookings['community'][i].end+'</td><td>'+bookings['community'][i].priceOfBooking+'</td><td>'+bookings['community'][i].paid+'</td><td>'+ bookings['community'][i].name+'</td></tr>';
                document.getElementById('usersCommunityBookingTableBody').innerHTML += tableRow;
              }
            }

            //if hostel bookings made
            if(bookings['hostel']!= null){

              //go through all the bookings to display them
              for(var i=0;i<bookings['hostel'].length;i++){
                tableRow='<tr><th scope="row">'+bookings['hostel'][i].bookingID+'</th><td>'+bookings['hostel'][i].startDate+'</td><td>'+bookings['hostel'][i].endDate+'</td><td>'+bookings['hostel'][i].roomID+'</td><td>'+bookings['hostel'][i].pricePerNight+'</td><td>'+ bookings['hostel'][i].noOfPeople+'</td></tr>';
                document.getElementById('usersHostelBookingTableBody').innerHTML += tableRow;
              }
            }

            //if no bookings have been made by user
            if(bookings['community']== null && bookings['hostel']== null){

              //display error message
              document.getElementById('usersBookingError').innerHTML = 'User has no bookings'
            }
          }
          } else{
            throw new Error('Error getting customers' + response.code);
          }
        } catch (error) {
          alert ('Problem: ' + error);
        }
      }else{

        //if user doesn't exist print error message
        document.getElementById('usersBookingError').innerHTML = 'User does not exist in the database'
      }
    }

}


//fills drop boxes
async function updateRooms() {

    //gets community rooms
    const rooms = await getCommunityRooms()

    //if can't get rooms
    if(rooms == 'Error'){

      //print error message
      document.getElementById('errorMessage').innerHTML = 'Error fetching community rooms'
    }else{

    //get both drop downs
    roomDrop = document.getElementById("roomSelectDrop");
    bookRoomDrop = document.getElementById("bookingRoomDropdown");

    // for each room
    for (i = 0; i < rooms.length; i++) {

        //add as an option for drop down
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

//returns number of days in month of year
function daysInMonth (year, month) {
    return new Date(year, month, 0).getDate();
}

//fill drop down with correct number of days
function fillDayDrop(year, month, searchType){
  daysDrop = document.getElementById("day"+searchType);

  //for number of days
  for(var i=1; i<=daysInMonth(year,month);i++){

    //add as an option for drop down
    let option = document.createElement("option")
    option.text = i.toString().padStart(2,'0');
    daysDrop.add(option);

  }
}

//fill hostel rooms in drop down
async function fillHostelDropdown(){

  //get parameters
  hostelRoomDrop = document.getElementById("hostelRoomsLargeEnough");
  guestNum = document.getElementById('numberOfGuests').value

  //check if guest number is and integer
  if(Number.isInteger(parseInt(guestNum)) == false){

    //print error message
    document.getElementById('newHostelBookingError').innerHTML= 'Please enter an integer for number of guests'
  }else{

    //get rooms that an fit the number of guests
    try{
      let response = await fetch('http://localhost:8090/roomslargeenough?guestnum=' + guestNum, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
          }
        });

        //if response is fine
        if(response.ok){
          let body = await response.text();

          //if database returns no matches
          if(body == '0matches'){

            //print error message
            document.getElementById('newHostelBookingError').innerHTML = 'No rooms large enough for number of guests try splitting party into several smaller ones.'
            document.getElementById('afterNumOfGuest').hidden = true
          }else{
            var rooms = JSON.parse(body);

            //for rooms returned
            for(var i=0; i<rooms.length;i++){

              //add as an option to dropdown
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

//fetch all community rooms from database
async function getCommunityRooms(startDate, endDate) { // Need to add error handling at some point.

    //make call to database
    try{
      let response = await fetch('http://localhost:8090/rooms?types=community', {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        });

        //if response is fine return rooms
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


//find avaliabilty for community room
async function searchForAvaliability(){

  //get parameters
  roomName = document.getElementById("roomSelectDrop").value;
  year = document.getElementById("yearAvaliableSearch").value;
  month = document.getElementById("monthAvaliableSearch").value;
  day = document.getElementById("dayAvaliableSearch").value;
  dateCombined = year+ '-' + month + '-' + day;

  //if no room name or date
  if(roomName == '' || dateCombined== '--'){

    //print error message
    document.getElementById(avaliabiltySearchError).innerHTML = 'Please fill all parameters for the search'
  }else{
  try{
    let response = await fetch('http://localhost:8090/rooms?types=community', {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      //if response is fine
      if(response.ok){
        let body = await response.text();
        var rooms = JSON.parse(body);
        roomID = 0;

        //if no matching rooms
        if(rooms['community'].length == 0){

          //print error message
          document.getElementById(avaliabiltySearchError).innerHTML = 'No rooms found in the database'
        }else{

          //for each room
          for(var i=0; i<rooms['community'].length; i++){

            // if matching room found
            if (rooms['community'][i].name == roomName){

              //set roomID
              roomID = rooms['community'][i].id;
            }
          }

  //fetch room avaliabilty for specified room
  let response2 = await fetch('http://localhost:8090/roomavailability?type=community&id='+roomID, {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      }
  });

  //if response is fine
  if(response2.ok){
  let body2 = await response2.text();
  var availability = JSON.parse(body2);

  //for each time peiod during the day
  for(var i=1; i< 14; i++){
    document.getElementById('timeTable' + i).innerHTML = 'Avaliable';
  }

  //for each busy period
  for(var i=0; i< availability.busy.length; i++){

    //if date is in calender table
    if(availability["busy"][i].start.substring(0,10) == dateCombined){

      //for time period of booking
      for(var j= availability["busy"][i].start.substring(11,13); j<=availability["busy"][i].end.substring(11,13); j++ ){

        //change state to busy
        document.getElementById('timeTable' + (j-8).toString()).innerHTML = 'Busy';
      }
    }
  }

  //make form avaliable
  document.getElementById("roomAvailabilityTable").hidden = false;
  document.getElementById("byAvaliability").hidden = true;
  document.getElementById("searchModalFooter").hidden = true;
  }else{

  //if error throw response
  throw new Error('Error getting Rooms' + response.code);
  document.getElementById(avaliabiltySearchError).innerHTML = 'Error checking avaliabilty of room'

  }
}
  }else{

    //if error throw response
    throw new Error('Error getting Rooms' + response.code);
    document.getElementById(avaliabiltySearchError).innerHTML = 'Error fetching rooms from the database'
    }
  }catch(error){
  alert ('Error: ' + error);
  }
}
};

//search for specific events
async function searchForEvents(){

  //get parameters
  name = document.getElementById("eventSearch").value;
  year = document.getElementById("yearEventSearch").value;
  month = document.getElementById("monthEventSearch").value;
  day = document.getElementById("dayEventSearch").value;
  var dateCombined = year+ '-' + month + '-' + day;

  //if no date provided
  if(dateCombined.length != 10){
    dateCombined = ''
  }

  //if no parameters
  if(name == '' && dateCombined== ''){

    //print error
    document.getElementById('eventSearchError').innerHTML = 'Please enter at least one parameter to search by'
  }else{

  //search for event
  try{
    let response = await fetch('http://localhost:8090/eventsearch?name=' + name + '&date=' + dateCombined,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
      });

    //if response is fine
    if(response.ok){
      var body = await response.text();

      //if no matches in the database found
      if(body=='0matches'){

        //print error message
        document.getElementById('byEvent').hidden = true;
        document.getElementById('searchResults').innerHTML += '<h5> No results found </h5>';
      }else{
      var events = JSON.parse(body);

      //show number of results
      document.getElementById('byEvent').hidden = true;
      document.getElementById('searchResults').innerHTML += '<h5> Found ' + events.length + ' match in the database </h5>';

      //display results
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

  //hide search button
  document.getElementById("searchModalFooter").hidden = true;
}
}

//fill search buttons
async function fillFindBy(){

  //get all customer information in database
  try{
    let response = await fetch('http://localhost:8090/customers',
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });

    //if response is fine
    if(response.ok){
      var body = await response.text();
      var customers = JSON.parse(body);

      //for each customer in database
      for(var i = 0; i<customers.length; i++){

        //add items to drop down
        document.getElementById('findByNameDropdown0').innerHTML += '<a onclick="bookingView('+customers[i].id+')">' + customers[i].fName + ' ' + customers[i].lName + '</a>';
        document.getElementById('findByPhoneNumberDropdown0').innerHTML += '<a onclick="bookingView('+customers[i].id+')">' + customers[i].phone + '</a>';
        document.getElementById('findByEmailDropdown0').innerHTML += '<a onclick="bookingView('+customers[i].id+')">' + customers[i].email +  '</a>'
        document.getElementById('findByNameDropdown1').innerHTML += '<a onclick="hostelBookingView('+customers[i].id+')">' + customers[i].fName + ' ' + customers[i].lName + '</a>';
        document.getElementById('findByPhoneNumberDropdown1').innerHTML += '<a onclick="hostelBookingView('+customers[i].id+')">' + customers[i].phone + '</a>';
        document.getElementById('findByEmailDropdown1').innerHTML += '<a onclick="hostelBookingView('+customers[i].id+')">' + customers[i].email +  '</a>'
        document.getElementById('findByNameDropdown2').innerHTML += '<a onclick="activityBookingView('+customers[i].id+')">' + customers[i].fName + ' ' + customers[i].lName + '</a>';
        document.getElementById('findByPhoneNumberDropdown2').innerHTML += '<a onclick="activityBookingView('+customers[i].id+')">' + customers[i].phone + '</a>';
        document.getElementById('findByEmailDropdown2').innerHTML += '<a onclick="activityBookingView('+customers[i].id+')">' + customers[i].email +  '</a>'
        document.getElementById('findByNameDropdown3').innerHTML += '<a onclick="paymentView('+customers[i].id+')">' + customers[i].fName + ' ' + customers[i].lName + '</a>';
        document.getElementById('findByPhoneNumberDropdown3').innerHTML += '<a onclick="paymentView('+customers[i].id+')">' + customers[i].phone + '</a>';
        document.getElementById('findByEmailDropdown3').innerHTML += '<a onclick="paymentView('+customers[i].id+')">' + customers[i].email +  '</a>'
      }
    }else{
      throw new Error('Error getting customers' + response.code);
      document.getElementById('errorMessage').innerHTML = 'Error fetching customers'
    }
    } catch (error) {
      alert ('Error: ' + error);
    }

    //get all events in database
    try{
      let response = await fetch('http://localhost:8090/events',
        {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
            }
        });

      //if response is fine
      if(response.ok){
        var body = await response.text();
        var events = JSON.parse(body);

        //for all events
        for(var i = 0; i<events.length; i++){

          //add name to the dropdown
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


//view booking calender and customer name
async function bookingView(id){
  document.getElementById('makeBooking').hidden = false;
  document.getElementById('findBy').hidden = true;

  //if no id
  if(id == null){

    //print error
    document.getElementById('errorMessage').innerHTML = 'No id supplied when searching for customer'
  }else{

  //get customer info
  try{
    let response = await fetch('http://localhost:8090/customersearch?id='+id,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });

    //if response is fine
    if(response.ok){
      var body = await response.text();
      var customers = JSON.parse(body);

      //display customer name
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

//view hostel booking page
async function hostelBookingView(id){

  //show form
  document.getElementById('makeHostelBooking').hidden = false;
  document.getElementById('findBy1').hidden = true;

  //if no id supplied
  if(id == null){

    //print error
    document.getElementById('errorMessage').innerHTML = 'No id supplied when searching for customer'
  }else{

  //search for customer
  try{
    let response = await fetch('http://localhost:8090/customersearch?id='+id,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });

    //if response is fine
    if(response.ok){
      var body = await response.text();
      var customers = JSON.parse(body);

      //display customer name
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

//view activity booking page
async function activityBookingView(id){

  //show form
  document.getElementById('makeActivityBooking').hidden = false;
  document.getElementById('findBy2').hidden = true;

  //if no id supplied
  if(id == null){

    //print error
    document.getElementById('errorMessage').innerHTML = 'No id supplied when searching for customer'
  }else{

  //search for customer
  try{
    let response = await fetch('http://localhost:8090/customersearch?id='+id,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });

    //if response is fine
    if(response.ok){
      var body = await response.text();
      var customers = JSON.parse(body);

      //display customer name
      document.getElementById('customerInfo2').innerHTML= 'Customer Name:' + customers[0].fName + ' ' + customers[0].lName;
      document.getElementById('activityBookingButtonDiv').innerHTML = '<div class="col-sm-3"><a class="btn btn-primary newColor" href="#" role="button" onclick="newActivityBooking('+customers[0].id+')">Book & Pay at desk</a></div>'

    }else{
      throw new Error('Error getting customers' + response.code);
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
  }
}

//view payment page
async function paymentView(id){
  paymentDropdown = document.getElementById('usersBookingForPayment')
  //show form
  document.getElementById('makePayment').hidden = false;
  document.getElementById('findBy3').hidden = true;

  //if no id supplied
  if(id == null){

    //print error
    document.getElementById('errorMessage').innerHTML = 'No id supplied when searching for customer'
  }else{

  //search for customer
  try{
    let response = await fetch('http://localhost:8090/paymentneeded?id='+id,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });

    //if response is fine
    if(response.ok){
      var body = await response.text();
      var bookings = JSON.parse(body);
      for(var i=0; i< bookings['activity'].length; i++){
        let option = document.createElement("option")
        option.text = 'A ' + bookings['activity'][i].dateTime +  ' ' + ' £' + bookings['activity'][i].price
        option.value = bookings['activity'][i].id
        paymentDropdown.add(option);
      }
      for(var i=0; i< bookings['community'].length; i++){
        let option = document.createElement("option")
        option.text = 'C ' + bookings['community'][i].start +  ' ' + ' £' + bookings['community'][i].priceOfBooking
        option.value = bookings['community'][i].id
        paymentDropdown.add(option);
      }
      for(var i=0; i< bookings['hostel'].length; i++){
        let option = document.createElement("option")
        option.text = 'H ' + bookings['hostel'][i].startDate +  ' ' + ' £' + bookings['hostel'][i].price
        option.value = bookings['hostel'][i].id
        paymentDropdown.add(option);
      }
    }else{
      throw new Error('Error getting customers' + response.code);
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
  }
}


//view stats about event
async function eventStatsView(id){

  //get event statistics
  try{
    let response = await fetch('http://localhost:8090/eventstatistics?id='+id,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });

    //if response is fine
    if(response.ok){
      var body = await response.text();

      //if no matches found
      if(body == '0matches'){

        //print error message
        document.getElementById('eventStatistics').innerHTML = "No matches found";
      }else{
      var stats = JSON.parse(body);

      //print stats
      document.getElementById('eventStatistics').innerHTML = "Event Name: " + stats[0].name + " Description: " + stats[0].description + " Tickets Sold: " + stats[0].numSold + '/' + stats[0].capacity;
    }
    }else{
      throw new Error('Error getting statistics' + response.code);
    }
    } catch (error) {
      alert ('Error: ' + error);
    }
}

//create new booking
async function newBooking(id){

  //get parameters
  startTime = parseInt(document.getElementById('bookingStartTime').value) + 8;
  duration = document.getElementById('bookingDurationTime').value;
  day = document.getElementById('chosenDate').innerHTML.substring(4).padStart(2,'0')
  month =  document.getElementById('chosenDate').value
  free = true

  //if any of the parameters not defined
  if(startTime == '' || duration == '' || day == '' || month == null){
    document.getElementById('newBookingError').innerHTML = 'Please fill in all sections'
  }else{

  //create end time from start time and duration
  if(duration == 0.5){
    endTime = new Date(2020, month, day, startTime, 30, 0, 0).getTime()/1000;

    //check if room is busy at the time
    if(document.getElementById(startTime + '.' + day + '.' + month).innerHTML == 'Busy'){
      document.getElementById('newBookingError').innerHTML = 'Room is busy at that time'
      free = false
    }
  }else if(duration == 1){

    //check if room is busy at the time
    endTime = new Date(2020, month, day, startTime + 1, 0, 0, 0).getTime()/1000;
    if(document.getElementById(startTime + '.' + day + '.' + month).innerHTML == 'Busy'){
      document.getElementById('newBookingError').innerHTML = 'Room is busy at that time'
      free = false
    }
  }else if(duration == 1.5){

    //check if room is busy at the time
    endTime = new Date(2020, month, day, startTime+1, 30, 0, 0).getTime()/1000;
    if(document.getElementById(startTime + '.' + day + '.' + month).innerHTML == 'Busy' || document.getElementById((parseInt(startTime)+1).toString() + '.' + day + '.' + month).innerHTML == 'Busy'){
      document.getElementById('newBookingError').innerHTML = 'Room is busy at that time'
      free=false
    }
  }else{

    //check if room is busy at the time
    endTime = new Date(2020, month, day, startTime+2, 0, 0, 0).getTime()/1000;
    if(document.getElementById(startTime + '.' + day + '.' + month).innerHTML == 'Busy' || document.getElementById((parseInt(startTime)+1).toString() + '.' + day + '.' + month).innerHTML == 'Busy'){
      document.getElementById('newBookingError').innerHTML = 'Room is busy at that time'
      free=false
    }
  }

  //if room is avaliable
  if(free == true){

    //get parameters
    startTime = new Date(2020, month, day, startTime, 0, 0, 0).getTime()/1000;
    roomId = document.getElementById('bookingRoomDropdown').value;
    price = document.getElementById('totalBookingPrice').innerText;

    //set paid to 0 as no way for guest to pay so must pay at desk
    paid = 0

    //create new community bookings
    let response = await fetch('http://localhost:8090/staffcommunitybooking',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'customerid=' + id + '&roomid=' + roomId + '&start=' + startTime + '&end=' + endTime + '&price=' + price + '&paid=' + paid
      });

      //if response isn't fine
      if(!response.ok){
        throw new Error('problem adding new event ' + response.code);
      }else{

        //if booking is success then display message
        document.getElementById('newBookingError').innerHTML='Booking successful'
      }
    }
  }
}


//create new hostel booking
async function newHostelBooking(id){

  //get parameters
  startDay = document.getElementById('chosenHostelDate').innerHTML.substring(4)
  startMonth =  document.getElementById('chosenHostelDate').value
  numberOfNights = document.getElementById('numberOfNights').value
  endDay = (parseInt(startDay) + parseInt(numberOfNights)) % daysInMonth(2020,month)

  //if booking spans over the end of a month
  if(endDay<startDay){
    endMonth = startMonth +1
  }else{
    endMonth = startMonth
  }

  //get number of guests
  numberOfGuests = document.getElementById('numberOfGuests').value

  //check that number of guests is an integer
  if(Number.isInteger(parseInt(numberOfGuests)) == false){

    //print error message
    document.getElementById('newHostelBookingError').innerHTML= 'Please enter an integer for number of guests'

    //check all parameters defined
  }else if(startDay == '' || numberOfGuests == '' || month == null){

    //print error message
    document.getElementById('newHostelBookingError').innerHTML= 'Please fill in all fields to complete booking'
  }else{

  //create array of days in booking
  days = []
  days.push(startDay + '.' + startMonth)
  day = startDay
  month = startMonth + 1

  //for each day in booking
  for(var i = 0; i<numberOfNights;i++){
    day = (parseInt(startDay) + i) % daysInMonth(2020,month)

    //check if booking spans over a month
    if(day<startDay){
      month = month +1
      }
    }

    //push day to array
    days.push(day + '.' + month.toString().padStart(2,'0'))
  }
  //calculate end date from the start date and number of nights
  endDay = (parseInt(startDay) + parseInt(numberOfNights)) % daysInMonth(2020,startMonth)

  //calculate epoch value for start and end date
  startTime = new Date(2020, month, startDay, 0, 0, 0, 0).getTime()/1000;
  endTime = new Date(2020, endMonth, endDay, 0, 0, 0, 0).getTime()/1000;
  roomId = document.getElementById('hostelRoomsLargeEnough').value;
  free = true

  //check room avaliabilty
    try{
      let response = await fetch('http://localhost:8090/roomavailability?type=hostel&id='+roomId,
        {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
            }
        });

      //if response is fine
      if(response.ok){
        var body = await response.text();
        var busy = JSON.parse(body)

        //for all busy periods
        for(var i =0; i<busy["busy"].length; i++){

          //for each day in array
          for(var j = 0; j<days.length; j++){

            //if busy start date matches day in booking
            if(days[j] == busy['busy'][i].startDate.substring(8,10)+'.'+busy['busy'][i].startDate.substring(5,7) || days[j] == busy['busy'][i].endDate.substring(8,10)+'.'+busy['busy'][i].endDate.substring(5,7)){

              //room is not free
              free = false
            }
          }
        }
      }else{
        throw new Error('Error getting room avaliabilty' + response.code);
      }
      } catch (error) {
        alert ('Error: ' + error);
      }

      //if room is not free
      if(free == false){

        //print error message
        document.getElementById('newHostelBookingError').innerHTML= 'Room is not avaliable at this time'
      }else{
        price = document.getElementById('totalHostelBookingPrice').innerText
        //create new hostel booking
        let response = await fetch('http://localhost:8090/staffhostelbooking',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'customerid=' + id + '&roomid=' + roomId + '&start=' + startTime + '&end=' + endTime + '&numberOfPeople=' + numberOfGuests + '&price=' + price
        });

        //if response isn't fine
        if(!response.ok){

          //error message
          throw new Error('problem adding new event ' + response.code);
        }else{

          //success message
          document.getElementById('newHostelBookingError').innerHTML='Booking successful'

          //reset forms
          resetHostelBooking()
        }
      }
}

//create new activity booking
async function newActivityBooking(id){

  //get parameters
  year = document.getElementById('yearActivityNew').value
  month = document.getElementById('monthActivityNew').value
  day = document.getElementById('monthActivityNew').value
  time = document.getElementById('monthActivityNew').value + 8

  //get number of guests
  numberOfGuests = document.getElementById('numOfPeopleActivity').value

  //check that number of guests is an integer
  if(Number.isInteger(parseInt(numberOfGuests)) == false){

    //print error message
    document.getElementById('newActivityBookingError').innerHTML= 'Please enter an integer for number of people'

    //check all parameters defined
  }else if(day == '' || numberOfGuests == '' || time == ''){

    //print error message
    document.getElementById('newActivityBookingError').innerHTML= 'Please fill in all fields to complete booking'
  }


  //calculate epoch value for start and end date
  startTime = new Date(year, month, day, time, 0, 0, 0).getTime()/1000;
  activityId = document.getElementById('activityDropdown').value;
  price = document.getElementById('totalActivityBookingPrice').innerText
  numOfPeople = document.getElementById('numOfPeopleActivity').value

  try{
        //create new hostel booking
        let response = await fetch('http://localhost:8090/staffactivitybooking',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'customerid=' + id + '&activityid=' + activityId + '&datetime=' + startTime + '&numberofpeople=' + numOfPeople + '&paid=0&price=' + price
        });

        //if response isn't fine
        if(!response.ok){

          //error message
          throw new Error('problem adding new event ' + response.code);
        }else{

          //success message
          document.getElementById('newActivityBookingError').innerHTML='Booking successful'

          //reset forms
          resetActivityBooking()
        }

    } catch (error) {
      alert ('Error: ' + error);
    }
}

//get price of community room
async function fillPrice(){

  //get roomID
  roomId = document.getElementById('bookingRoomDropdown').value;

  //if no room
  if(roomId==''){

    //print error message
    document.getElementById('newBookingError').innerHTML='Room id not supplied'
  }else{

    //get price for room
    try{
      let response = await fetch('http://localhost:8090/communityroomprice?id='+roomId,
        {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
            }
          });

      //if response is fine
      if(response.ok){
        var body = await response.text();

        //if no match found for room
        if(body=='0matches'){

          //error errorMessage
        }else{
          var price = JSON.parse(body);

          //set name and price per hour in time
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

//get price of hostel room
function fillHostelPrice(){

    //get number of people
    document.getElementById('numPeople').innerHTML= document.getElementById('numberOfGuests').value;

    //get price per hour from drop down
    document.getElementById('hostelRoomPricePerHour').innerHTML = document.getElementById('hostelRoomsLargeEnough').options[document.getElementById('hostelRoomsLargeEnough').selectedIndex].text.substring(4);

    //calculate total by people * price
    document.getElementById('totalHostelBookingPrice').innerHTML = parseInt(document.getElementById('numPeople').innerHTML) * parseInt(document.getElementById('hostelRoomPricePerHour').innerHTML)

}

//get price of activity room
function fillActivityPrice(){

    //get number of people
    document.getElementById('activityNumPeople').innerHTML= document.getElementById('numOfPeopleActivity').value;

    //get price per hour from drop down
    document.getElementById('activityPricePerHour').innerHTML = document.getElementById('activityDropdown').options[document.getElementById('activityDropdown').selectedIndex].text.split('£')[1];

    //calculate total by people * price
    document.getElementById('totalActivityBookingPrice').innerHTML = parseInt(document.getElementById('activityNumPeople').innerHTML) * parseInt(document.getElementById('activityPricePerHour').innerHTML)

}


//calculate cost for community booking
function calculatePrice(){

  //price = per hour * duration
  price = document.getElementById('roomPricePerHour').innerText * document.getElementById('bookingDurationTime').value

  //display price
  document.getElementById('totalBookingPrice').innerText = price
}

//fill room avaliabilty calender
async function fillBookingTable(){

  //get room id
  roomId = document.getElementById('bookingRoomDropdown').value;

  //if no id
  if(roomId==null){

    //print error message
    document.getElementById('newBookingError').innerHTML='Room id not supplied'
  }else{

    //get room avaliabilty
    try{
      let response = await fetch('http://localhost:8090/roomavailability?type=community&id='+roomId,
        {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
            }
          });

      //if response is fine
      if(response.ok){
        var body = await response.text();
        var busy = JSON.parse(body);

        //for all busy periods
        for(var i =0; i<busy["busy"].length; i++){

          //for each hour between start and end time
          for(var j= busy["busy"][i].start.substring(11,13); j<=busy["busy"][i].end.substring(11,13); j++ ){

            //if date is in week being shown
            if(document.getElementById(j.toString() + '.' + busy["busy"][i].start.substring(8,10)+ '.' + (parseInt(busy["busy"][i].start.substring(5,7))-1))  != null){

              //set hour to be busy
              document.getElementById(j.toString() + '.' + busy["busy"][i].start.substring(8,10)+ '.' + (parseInt(busy["busy"][i].start.substring(5,7))-1) ).innerHTML = 'Busy';
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

//fill hostel avaliabilty calender
async function fillHostelBookingTable(){

  //get room id
  roomId = document.getElementById('hostelRoomsLargeEnough').value;

  //check that guest number is integer
  if(Number.isInteger(parseInt(guestNum)) == false){

    //print error message
    document.getElementById('newHostelBookingError').innerHTML= 'Please enter an integer for number of guests'
  }else {

    //if no id supplied
    if(roomId==''){

      //print error message
      document.getElementById('newHostelBookingError').innerHTML='Room id not supplied'
    }else{
      month =  document.getElementById('chosenHostelDate').value

      //get room avaliabilty
      try{
        let response = await fetch('http://localhost:8090/roomavailability?type=hostel&id='+roomId,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          }
        });

      //if response is fine
      if(response.ok){
        var body = await response.text();
        var busy = JSON.parse(body);

        //for all busy periods
        for(var i =0; i<busy["busy"].length; i++){

          //get number of days in month
          dayInMonth = daysInMonth(busy["busy"][i].startDate.substring(0,4),busy["busy"][i].startDate.substring(5,7)-1)
          month = document.getElementById('chosenHostelDate').value

          //if spans end of month
          if(busy["busy"][i].startDate.substring(8,10) > busy["busy"][i].endDate.substring(8,10)){

            //for part of booking in first month
            for(var j=busy["busy"][i].startDate.substring(8,10); j<=dayInMonth;j++){

              //check if day is in current calender
              if(document.getElementById(j+'.'+month) != null){

                //display busy
                document.getElementById(j+'.'+month).innerHTML= 'Busy'
              }
            }
            month = month +1

            //for part of booking from start of month to end of booking
            for(var j=1; j<busy["busy"][i].endDate.substring(8,10);j++){

              //check if day is in current calender
              if(document.getElementById(j+'.'+month) != null){

                //display busy
                document.getElementById(j+'.'+month).innerHTML= 'Busy'
              }
            }
        }else{

          //from first day of booking to last
          for(var j=busy["busy"][i].startDate.substring(8,10); j<busy["busy"][i].endDate.substring(8,10);j++){

            //check if day is in current calender
            if(document.getElementById(j+'.'+month) != null){

              //display busy
              document.getElementById(j+'.'+month).innerHTML= 'Busy'
              }
            }
          }
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

//check if customer is in the database
async function checkCustomerExists(id){

  //look for customer in database
  try{
    let response = await fetch('http://localhost:8090/customerexists?id='+id,
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });

    //if response is fine
    if(response.ok){
      var body = await response.text();

      //if no matches found
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

//reset forms and hide calender
function resetHostelBooking(){
  document.getElementById('afterNumOfGuest').hidden=true;
  document.getElementById('numberOfGuests').value = '';
}

//reset forms and hide calender
function resetActivityBooking(){
  document.getElementById('numOfPeopleActivity').value = '';
}

//reset forms and hide calender
function resetPayment(){
  document.getElementById('makePayment').hidden = true;
  document.getElementById('findBy3').hidden = false;
  document.getElementById('newPaymentError').innerHTML = '';
}


//add new ticket type to event
function addTicketType(){

  //get parameters
  typeName = document.getElementById('nameOfTicket').value;
  typePrice = document.getElementById('priceOfTicket').value;

  //check if price is integer needs to work for float
  if(Number.isInteger(parseInt(typePrice)) == false){

    //print error message
    document.getElementById('newEventError').innerHTML= 'Please enter a number for the price'
  }else{
    document.getElementById('ticketTypes').innerHTML += typeName + ':' + typePrice +','
  }

  //reset forms
  document.getElementById('nameOfTicket').value = ''
  document.getElementById('priceOfTicket').value = ''
}


//create new event
async function createNewEvent(){

  //get parameters
  ticketTypes = document.getElementById('ticketTypes').innerHTML
  name = document.getElementById('nameOfEvent').value
  description = document.getElementById('descriptionOfEvent').value
  capacity = document.getElementById('capacityOfEvent').value
  year = document.getElementById("yearEventNew").value;
  month = document.getElementById("monthEventNew").value;
  day = document.getElementById("dayEventNew").value;
  startTime = document.getElementById("newEventStartTime").value + 8;

  //convert date to epoch time
  date = new Date(year, month, day, startTime, 0, 0, 0).getTime()/1000;

  //post new event and add new tickets
  try{
    let response = await fetch('http://localhost:8090/newevent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'tickets=' + ticketTypes + '&name=' + name + '&date=' + date+ '&description=' + description + '&capacity=' + capacity
    });

  //if response isn't fine
  if(!response.ok){
    throw new Error('problem adding new event ' + response.code);
  }else{
    document.getElementById('newBookingError').innerHTML='Booking successful'
  }
}catch(error){
  alert('Error' + error)
}
}

//get one of each type of booking still awaiting approval
async function getNotifications(){

  //get all requests
  try{
    let response = await fetch('http://localhost:8090/bookingrequests',
    {
      method: 'GET',
      headers: {
          "Content-Type": "application/json"
        }
    });

    //if response is ok
    if(response.ok){
      var body = await response.text();
      var requests = JSON.parse(body)

      //display information
      document.getElementById('notificationBody').innerHTML = '<p> One booking of each type is displayed please act on a request to view the next one </p>'
      document.getElementById('notificationBody').innerHTML += '<p> Before you deny a request please inform the client by phone or email the reason for your decision </p>';


      //if community request exists
      if(requests['community'].length>=1){
        document.getElementById('notificationBody').innerHTML += '<p> Community Booking Requests </p>';
        //display info about request
        statement = 'Booking Request for ' + requests['community'][0].name + ' from ' + requests['community'][0].start + ' - ' + requests['community'][0].end + ' by ' + requests['community'][0].fName + ' ' + requests['community'][0].lName;
        customerInfo = ' Customer email: ' + requests['community'][0].email + ' Customer phone: ' + requests['community'][0].phone + ' Booking Price: £' + requests['community'][0].priceOfBooking;
        document.getElementById('notificationBody').innerHTML += '<p id="request' + requests['community'][0].id + '"> '+statement + customerInfo +' </p>';
        document.getElementById('notificationBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="approveC'+ requests['community'][0].id+'"> Approve </button>';
        document.getElementById('notificationBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="denyC'+requests['community'][0].id+'"> Deny </button>';

        //add listeners to buttons
        document.getElementById('approveC'+requests['community'][0].id).addEventListener("click", function(){
          approveCRequest(requests['community'][0].id);
        });
        document.getElementById('denyC'+requests['community'][0].id).addEventListener("click", function(){
          denyCRequest(requests['community'][0].id);
        });

      }

      //if activity request exists
      if(requests['activity'].length>=1){
        document.getElementById('notificationBody').innerHTML += '<p> Activity Booking Requests </p>';
        //display info about request
        statement = 'Booking Request for ' + requests['activity'][0].name + ' from ' + requests['activity'][0].dateTime + ' by ' + requests['activity'][0].fName + ' ' + requests['activity'][0].lName;
        customerInfo = ' Customer email: ' + requests['activity'][0].email + ' Customer phone: ' + requests['activity'][0].phone + ' Booking Price: £' + requests['activity'][0].priceOfBooking;
        document.getElementById('notificationBody').innerHTML += '<p id="request' + requests['activity'][0].id + '"> '+statement + customerInfo +' </p>';

        document.getElementById('notificationBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="approveA'+ requests['activity'][0].id+'"> Approve </button>';
        document.getElementById('notificationBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="denyA'+requests['activity'][0].id+'"> Deny </button>';

        //add listeners to buttons
        document.getElementById('approveA'+requests['activity'][0].id).addEventListener("click", function(){
          approveCRequest(requests['activity'][0].id);
        });
        document.getElementById('denyA'+requests['activity'][0].id).addEventListener("click", function(){
          denyCRequest(requests['activity'][0].id);
        });

      }

      //if hostel request exists
      if(requests['hostel'].length>=1){
        document.getElementById('notificationBody').innerHTML += '<p> Hostel Booking Requests </p>';
        //display info about request
        statement = 'Booking Request for ' + requests['hostel'][0].roomNumber + ' from ' + requests['hostel'][0].start + ' by ' + requests['hostel'][0].fName + ' ' + requests['hostel'][0].lName;
        customerInfo = ' Customer email: ' + requests['hostel'][0].email + ' Customer phone: ' + requests['hostel'][0].phone + ' Booking Price: £' + requests['hostel'][0].priceOfBooking;
        document.getElementById('notificationBody').innerHTML += '<p id="request' + requests['hostel'][0].id + '"> '+statement + customerInfo +' </p>';

        document.getElementById('notificationBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="approveH'+ requests['hostel'][0].id+'"> Approve </button>';
        document.getElementById('notificationBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="denyH'+requests['hostel'][0].id+'"> Deny </button>';

        //add listeners to buttons
        document.getElementById('approveH'+requests['hostel'][0].id).addEventListener("click", function(){
          approveCRequest(requests['hostel'][0].id);
        });
        document.getElementById('denyH'+requests['hostel'][0].id).addEventListener("click", function(){
          denyCRequest(requests['hostel'][0].id);
        });

      }
    }else{
      throw new Error('Error  ' + response.code);
    }
  }catch(error){
    alert('Error' + error)
  }
}

//approves a community booking request
async function approveCRequest(id){

  //add new community booking and delete from request
  try{
    let response = await fetch('http://localhost:8090/approvecommunityrequest',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    });

  //if response isn't fine
  if(!response.ok){
    throw new Error('problem aproving event ' + response.code);
  }else{
    getNotifications()
  }
}catch(error){
  alert('Error' + error)
}
}

//approves an activity booking request
async function approveARequest(id){

  //add new activity booking and delete from request
  try{
    let response = await fetch('http://localhost:8090/approveactivityrequest',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    });

  //if response isn't fine
  if(!response.ok){
    throw new Error('problem aproving event ' + response.code);
  }else{
    getNotifications()
  }
}catch(error){
  alert('Error' + error)
}
}

//approves a hostel booking request
async function approveHRequest(id){

  //add new hostel booking and delete from request
  try{
    let response = await fetch('http://localhost:8090/approvehostelrequest',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    });

  //if response isn't fine
  if(!response.ok){
    throw new Error('problem aproving event ' + response.code);
  }else{
    getNotifications()
  }
}catch(error){
  alert('Error' + error)
}
}

//denys a community booking request
async function denyCRequest(id){

  //delete from request
  try{
    let response = await fetch('http://localhost:8090/denycommunityrequest',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    });

  //if response isn't fine
  if(!response.ok){
    throw new Error('problem aproving event ' + response.code);
  }else{
    getNotifications()
  }
}catch(error){
  alert('Error' + error)
}
}

//denys an activity booking request
async function denyARequest(id){

  //delete from request
  try{
    let response = await fetch('http://localhost:8090/denyactivityrequest',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    });

  //if response isn't fine
  if(!response.ok){
    throw new Error('problem aproving event ' + response.code);
  }else{
    getNotifications()
  }
}catch(error){
  alert('Error' + error)
}
}

//denys a hostel booking request
async function denyHRequest(id){

  //delete from request
  try{
    let response = await fetch('http://localhost:8090/denyhostelrequest',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    });

  //if response isn't fine
  if(!response.ok){
    throw new Error('problem aproving event ' + response.code);
  }else{
    getNotifications()
  }
}catch(error){
  alert('Error' + error)
}
}

//fills calender with bookings
async function fillCalender(){

  //gets all events
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
      var events = JSON.parse(body)
      eventFound = false;

      //reset
      for(var j = 1; j< 8; j++){
        document.getElementById('day' + j + 'E').innerHTML = ''
        document.getElementById('day' + j + 'A').innerHTML = ''
        document.getElementById('day' + j + 'C').innerHTML = ''
        document.getElementById('day' + j + 'H').innerHTML = ''
      }
      //go through all events
      for(var i = 0; i<events.length; i++){

            //for each day in the week
            for(var j = 1; j< 8; j++){

                //if dates match, event in that week
                if((events[i].datetime.substring(8,10)+'/'+events[i].datetime.substring(5,7)).toString()==document.getElementById('cday' + j).textContent.toString()){

                    //display info about event
                    document.getElementById('day' + j + 'E').innerHTML += 'Name: ' + events[i].name + '\n'
                    document.getElementById('day' + j + 'E').innerHTML += '  Start Time: ' + events[i].datetime.substring(11,16)

                }
            }
        }
    }
  }catch(error){
    alert('Error' + error)
  }

  //get all bookings
  try{
    let response = await fetch('http://localhost:8090/bookings',
      {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
          }
      });
    if(response.ok){
      var body = await response.text();
      var bookings = JSON.parse(body)
      eventFound = false;

      //go through activity bookings
      for(var i = 0; i<bookings['activity'].length; i++){
        console.log(bookings)
            for(var j = 1; j< 8; j++){

               if((bookings['activity'][i].dateTime.substring(8,10)+'/'+bookings['activity'][i].dateTime.substring(5,7)).toString()==document.getElementById('day' + j).textContent.toString()){
                    document.getElementById('day' + j + 'A').innerHTML += 'Start Time: ' + bookings['activity'][i].datetime.substring(11,16) + '\n'
                    document.getElementById('day' + j + 'A').innerHTML += '  Number of People: ' + bookings['activity'].numberOfPeople

                }
            }
      }

      // go through hostel bookings
      for(var i = 0; i<bookings['hostel'].length; i++){
            for(var j = 1; j< 8; j++){

              //put start date in calender
               if((bookings['hostel'][i].startDate.substring(8,10)+'/'+bookings['hostel'][i].startDate.substring(5,7)).toString()==document.getElementById('day' + j).textContent.toString()){
                    document.getElementById('day' + j + 'H').innerHTML += ' Start of Booking for ' + bookings['activity'].noOfPeople + ' people'

              }

              //put end date in calender
              if((bookings['hostel'][i].endDate.substring(8,10)+'/'+bookings['hostel'][i].endDate.substring(5,7)).toString()==document.getElementById('day' + j).textContent.toString()){
                   document.getElementById('day' + j + 'H').innerHTML += ' End of Booking for ' + bookings['hostel'].noOfPeople + ' people'

               }

            }
      }

      //go through community bookings
      for(var i = 0; i<bookings['community'].length; i++){
            for(var j = 1; j< 8; j++){
               if((bookings['community'][i].start.substring(8,10)+'/'+bookings['community'][i].start.substring(5,7)).toString()==document.getElementById('day' + j).textContent.toString()){
                    document.getElementById('day' + j + 'C').innerHTML += 'Start Time: ' + bookings['community'][i].start.substring(11,16) + '\n'
                    document.getElementById('day' + j + 'C').innerHTML += '  End Time: ' + bookings['community'][i].end.substring(11,16)

                }
            }
      }

    }
  }catch(error){
    alert('Error' + error)
  }
}

//fill dropdown with activities avaliable to be booked
async function fillActivities(){

  //get dropdown
  activityDropdown = document.getElementById('activityDropdown')

  //fetch activities
  try{
    let response = await fetch('http://localhost:8090/activities',
    {
      method: 'GET',
      headers: {
          "Content-Type": "application/json"
        }
    });

  //if response isn't fine
  if(!response.ok){
    throw new Error('Problem ' + response.code);
  }else{
    var body = await response.text();
    var activities = JSON.parse(body)

    //go through activities
    for(var i=0; i<activities.length;i++){

      //add as an option to dropdown
      let option = document.createElement("option")
      option.text = activities[i].name + ' £' + activities[i].price
      option.value = activities[i].id
      activityDropdown.add(option);
    }
  }
}catch(error){
  alert('Error' + error)
}
}

//change payment status of booking
async function makePayment(){

  id = document.getElementById('usersBookingForPayment').value
  type = document.getElementById('usersBookingForPayment').options[document.getElementById('usersBookingForPayment').selectedIndex].text.substring(0,1);

  //get type of booking
  switch(type){
    case "A":
      tableName = 'activity'
      break;
    case "C":
      tableName = 'community'
      break;
    case "H":
      tableName = 'hostel'
      break
  }

  //make payment
  try{
    let response = await fetch('http://localhost:8090/makepayment',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id + '&type=' + tableName
    });

  //if response isn't fine
  if(!response.ok){
    throw new Error('problem aproving event ' + response.code);
  }else{
    document.getElementById('newPaymentError').innerHTML = 'Database changed correctly'
    resetPayment()
  }
}catch(error){
  alert('Error' + error)
}
}

//runs get request to search activity booking in database and displays results
async function searchActivityBooking(){
  document.getElementById('usersBookingErrorforsearchActivityBooking').innerHTML = ''

  //get parameters for search
  fName = document.getElementById("firstnameSearchforactivityBookingSearchForm").value;
  sName = document.getElementById("surnameSearchforactivityBookingSearchForm").value;
  email = document.getElementById("emailSearchforactivityBookingSearchForm").value;
  phoneNumber = document.getElementById("phoneNoSearchforactivityBookingSearchForm").value;

  //check that at least one parameter has been filled
  if((fName + sName + email + phoneNumber).length ==0 ){

    //error message if nothing to search by
    document.getElementById('bookingSearchError').innerHTML = 'Please enter at least one parameter to search by'

  }
  else{

    //find customer in the database
    try{

      let response = await fetch('http://localhost:8090/customersearch?fname=' + fName + '&sname=' + sName + '&email=' + email + '&phone=' + phoneNumber,
        {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
            }
          });

      //if response is fine
      if(response.ok){
        var body = await response.text();

        //if no matches found in the database
        if(body=='0matches'){
          //error message of no results found
          document.getElementById('bookingSearchResults').innerHTML += '<h5> No results found </h5>';
          document.getElementById('activityBookingSearchForm').hidden = true;
        }

        else{
          //get customers
          var customers = JSON.parse(body);
          document.getElementById('activityBookingSearchForm').hidden = true;

          //inform customer of how many customers found in the database
          document.getElementById('bookingSearchResults').innerHTML += '<h5> Found ' + customers.length + ' match in the database </h5>';

          //for each matching customer display
          for(var i=0; i<customers.length; i++){
            document.getElementById('bookingSearchResults').innerHTML += '<p> Name : ' + customers[i].fName + ' ' +  customers[i].lName + ' Email: ' + customers[i].email + ' Phone Number: ' + customers[i].phone;
          }

          if(customers.length != 1){
            document.getElementById('bookingSearchResults').innerHTML += '<h5> Please narrow search down to one customer to view bookings made by them </h5>';
          }

          else{
            document.getElementById('bookingSearchResults').innerHTML += '<button type="button" class="btn btn-primary newColor" id="viewActivityBookingBtn" data-toggle="modal" data-target="#viewUsersActivityBookingsModal" onclick=setUser('+customers[0].id+')>View Bookings</button>';

            //on click of button
            document.getElementById('viewActivityBookingBtn').addEventListener('click', function(){
              viewUserActivityBookings()
            });
          }
        }

        document.getElementById("editBookingModalFooter").hidden = true;

      }

      //if no parameters sent to the database
      else if(response.status == 400){
        document.getElementById('bookingSearchError').innerHTML = 'Please enter at least one parameter to search by'
      }

      else{
        throw new Error('Error getting customers' + response.code);
      }
    }

    catch (error) {
        alert ('Problem: ' + error);
    }
  }
}

//runs get request to search community booking in database and displays results
async function searchCommunityBooking(){
  document.getElementById('usersBookingErrorforsearchCommunityBooking').innerHTML = ''

  //get parameters for search
  fName = document.getElementById("firstnameSearchforcommunityBookingSearchForm").value;
  sName = document.getElementById("surnameSearchforcommunityBookingSearchForm").value;
  email = document.getElementById("emailSearchforcommunityBookingSearchForm").value;
  phoneNumber = document.getElementById("phoneNoSearchforcommunityBookingSearchForm").value;

  //check that at least one parameter has been filled
  if((fName + sName + email + phoneNumber).length ==0 ){

    //error message if nothing to search by
    document.getElementById('bookingSearchError').innerHTML = 'Please enter at least one parameter to search by'

  }
  else{

    //find customer in the database
    try{

      let response = await fetch('http://localhost:8090/customersearch?fname=' + fName + '&sname=' + sName + '&email=' + email + '&phone=' + phoneNumber,
        {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
            }
          });

      //if response is fine
      if(response.ok){
        var body = await response.text();

        //if no matches found in the database
        if(body=='0matches'){
          //error message of no results found
          document.getElementById('bookingSearchResults').innerHTML += '<h5> No results found </h5>';
          document.getElementById('communityBookingSearchForm').hidden = true;
        }

        else{
          //get customers
          var customers = JSON.parse(body);
          document.getElementById('communityBookingSearchForm').hidden = true;

          //inform customer of how many customers found in the database
          document.getElementById('bookingSearchResults').innerHTML += '<h5> Found ' + customers.length + ' match in the database </h5>';

          //for each matching customer display
          for(var i=0; i<customers.length; i++){
            document.getElementById('bookingSearchResults').innerHTML += '<p> Name : ' + customers[i].fName + ' ' +  customers[i].lName + ' Email: ' + customers[i].email + ' Phone Number: ' + customers[i].phone;
          }

          if(customers.length != 1){
            document.getElementById('bookingSearchResults').innerHTML += '<h5> Please narrow search down to one customer to view bookings made by them </h5>';
          }

          else{
            document.getElementById('bookingSearchResults').innerHTML += '<button type="button" class="btn btn-primary newColor" id="viewCommunityBookingBtn" data-toggle="modal" data-target="#viewUsersCommunityBookingsModal" onclick=setUser('+customers[0].id+')>View Bookings</button>';

            //on click of button
            document.getElementById('viewCommunityBookingBtn').addEventListener('click', function(){
              viewUserCommunityBookings()
            });
          }
        }

        document.getElementById("editBookingModalFooter").hidden = true;

      }

      //if no parameters sent to the database
      else if(response.status == 400){
        document.getElementById('bookingSearchError').innerHTML = 'Please enter at least one parameter to search by'
      }

      else{
        throw new Error('Error getting customers' + response.code);
      }
    }

    catch (error) {
        alert ('Problem: ' + error);
    }
  }
}

//runs get request to search hostel booking in database and displays results
async function searchHostelBooking(){
  document.getElementById('usersBookingErrorforsearchHostelBooking').innerHTML = ''

  //get parameters for search
  fName = document.getElementById("firstnameSearchforhostelBookingSearchForm").value;
  sName = document.getElementById("surnameSearchforhostelBookingSearchForm").value;
  email = document.getElementById("emailSearchforhostelBookingSearchForm").value;
  phoneNumber = document.getElementById("phoneNoSearchforhostelBookingSearchForm").value;

  //check that at least one parameter has been filled
  if((fName + sName + email + phoneNumber).length ==0 ){

    //error message if nothing to search by
    document.getElementById('bookingSearchError').innerHTML = 'Please enter at least one parameter to search by'

  }
  else{

    //find customer in the database
    try{

      let response = await fetch('http://localhost:8090/customersearch?fname=' + fName + '&sname=' + sName + '&email=' + email + '&phone=' + phoneNumber,
        {
          method: 'GET',
          headers: {
              "Content-Type": "application/json"
            }
          });

      //if response is fine
      if(response.ok){
        var body = await response.text();

        //if no matches found in the database
        if(body=='0matches'){
          //error message of no results found
          document.getElementById('bookingSearchResults').innerHTML += '<h5> No results found </h5>';
          document.getElementById('hostelBookingSearchForm').hidden = true;
        }

        else{
          //get customers
          var customers = JSON.parse(body);
          document.getElementById('hostelBookingSearchForm').hidden = true;

          //inform customer of how many customers found in the database
          document.getElementById('bookingSearchResults').innerHTML += '<h5> Found ' + customers.length + ' match in the database </h5>';

          //for each matching customer display
          for(var i=0; i<customers.length; i++){
            document.getElementById('bookingSearchResults').innerHTML += '<p> Name : ' + customers[i].fName + ' ' +  customers[i].lName + ' Email: ' + customers[i].email + ' Phone Number: ' + customers[i].phone;
          }

          if(customers.length != 1){
            document.getElementById('bookingSearchResults').innerHTML += '<h5> Please narrow search down to one customer to view bookings made by them </h5>';
          }

          else{
            document.getElementById('bookingSearchResults').innerHTML += '<button type="button" class="btn btn-primary newColor" id="viewHostelBookingBtn" data-toggle="modal" data-target="#viewUsersHostelBookingsModal" onclick=setUser('+customers[0].id+')>View Bookings</button>';

            //on click of button
            document.getElementById('viewHostelBookingBtn').addEventListener('click', function(){
              viewUserHostelBookings()
            });
          }
        }

        document.getElementById("editBookingModalFooter").hidden = true;

      }

      //if no parameters sent to the database
      else if(response.status == 400){
        document.getElementById('bookingSearchError').innerHTML = 'Please enter at least one parameter to search by'
      }

      else{
        throw new Error('Error getting customers' + response.code);
      }
    }

    catch (error) {
        alert ('Problem: ' + error);
    }
  }
}

//creates tables from users activity bookings only
async function viewUserActivityBookings(){

  //get customer id
  customerID = document.getElementById('customerId').value

  //if no customer id provided
  if(customerID==''){
    //error message
    document.getElementById('usersBookingErrorforviewUserActivityBookings').innerHTML = 'Error getting customer ID'
  }

  else{
    //check customer exists
    var exist =  await checkCustomerExists(customerID)
    if(exist == true){

      //get activity bookings the customer has made
      try{
        let response = await fetch('http://localhost:8090/customerbookings?id=' + customerID,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          }
        });

        //if response is fine
        if(response.ok){
          var body = await response.text();

          if(body == '0bookings'){
            document.getElementById('usersBookingErrorforviewUserActivityBookings').innerHTML = 'No bookings found for that user'
          }

          else{
            var bookings = JSON.parse(body);

            //if activity bookings made
            if(bookings['activity']!= null){
              //go through all the activity bookings to display them
              for(var i=0;i<bookings['activity'].length;i++){
                tableRow='<tr><th scope="row">'+bookings['activity'][i].bookingID+'</th><td>'+bookings['activity'][i].dateTime+'</td><td>'+bookings['activity'][i].numberOfPeople+'</td><td>'+bookings['activity'][i].price+'</td><td>'+bookings['activity'][i].paid+'</td><td>'+ bookings['activity'][i].name+'</td></tr>';
                document.getElementById('usersActivityBookingTableforEditBody').innerHTML += tableRow;
                document.getElementById('usersActivityBookingTableforEditBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="editActivityBookingBtn" data-toggle="modal" data-target="#updateActivityBookingModal" onclick=setActivityBookingID('+bookings['activity'][i].bookingID+')>Edit</button>';
                document.getElementById('usersActivityBookingTableforEditBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="cancelActivityBookingBtn" data-toggle="modal" data-target="#viewUsersActivityBookingsModal" onclick=cancelUserActivityBookings('+bookings['activity'][i].bookingID+')>Cancel</button>';
              }
            }

            //if no activity booking have been made by user
            if(bookings['activity']== null ){
              //display error message
              document.getElementById('usersBookingErrorforviewUserActivityBookings').innerHTML = 'User has no bookings'
            }
          }
        }
        else{
          throw new Error('Error getting customers' + response.code);
        }
      }
      catch (error){
        alert ('Problem: ' + error);
      }
    }
    else{
      //if user doesn't exist print error message
      document.getElementById('usersBookingErrorforviewUserActivityBookings').innerHTML = 'User does not exist in the database'
    }
  }
}

//creates tables from users community bookings only
async function viewUserCommunityBookings(){

  //get customer id
  customerID = document.getElementById('customerId').value

  //if no customer id provided
  if(customerID==''){
    //error message
    document.getElementById('usersBookingErrorforviewUserCommunityBookings').innerHTML = 'Error getting customer ID'
  }

  else{
    //check customer exists
    var exist =  await checkCustomerExists(customerID)
    if(exist == true){

      //get community bookings the customer has made
      try{
        let response = await fetch('http://localhost:8090/customerbookings?id=' + customerID,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          }
        });

        //if response is fine
        if(response.ok){
          var body = await response.text();

          if(body == '0bookings'){
            document.getElementById('usersBookingErrorforviewUserCommunityBookings').innerHTML = 'No bookings found for that user'
          }

          else{
            var bookings = JSON.parse(body);

            //if community bookings made
            if(bookings['community']!= null){
              //go through all the community bookings to display them
              for(var i=0;i<bookings['community'].length;i++){
                tableRow='<tr><th scope="row">'+bookings['community'][i].bookingID+'</th><td>'+bookings['community'][i].start+'</td><td>'+bookings['community'][i].end+'</td><td>'+bookings['community'][i].priceOfBooking+'</td><td>'+bookings['community'][i].paid+'</td><td>'+ bookings['community'][i].name+'</td></tr>';
                document.getElementById('usersCommunityBookingTableforEditBody').innerHTML += tableRow;
                document.getElementById('usersCommunityBookingTableforEditBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="editCommunityBookingBtn" data-toggle="modal" data-target="#updateCommunityBookingModal" onclick=setCommunityBookingID('+bookings['community'][i].bookingID+')>Edit</button>';
                document.getElementById('usersCommunityBookingTableforEditBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="cancelCommunityBookingBtn" data-toggle="modal" data-target="#viewUsersCommunityBookingsModal" onclick=cancelUserCommunityBookings('+bookings['community'][i].bookingID+')>Cancel</button>';
              }
            }

            //if no community booking have been made by user
            if(bookings['community']== null ){
              //display error message
              document.getElementById('usersBookingErrorforviewUserCommunityBookings').innerHTML = 'User has no bookings'
            }
          }
        }
        else{
          throw new Error('Error getting customers' + response.code);
        }
      }
      catch (error){
        alert ('Problem: ' + error);
      }
    }
    else{
      //if user doesn't exist print error message
      document.getElementById('usersBookingErrorforviewUserCommunityBookings').innerHTML = 'User does not exist in the database'
    }
  }
}

//creates tables from users hostel bookings only
async function viewUserHostelBookings(){

  //get customer id
  customerID = document.getElementById('customerId').value

  //if no customer id provided
  if(customerID==''){
    //error message
    document.getElementById('usersBookingErrorforviewUserHostelBookings').innerHTML = 'Error getting customer ID'
  }

  else{
    //check customer exists
    var exist =  await checkCustomerExists(customerID)
    if(exist == true){

      //get hostel bookings the customer has made
      try{
        let response = await fetch('http://localhost:8090/customerbookings?id=' + customerID,
        {
          method: 'GET',
          headers: {
            "Content-Type": "application/json"
          }
        });

        //if response is fine
        if(response.ok){
          var body = await response.text();

          if(body == '0bookings'){
            document.getElementById('usersBookingErrorforviewUserHostelBookings').innerHTML = 'No bookings found for that user'
          }

          else{
            var bookings = JSON.parse(body);

            //if hostel bookings made
            if(bookings['hostel']!= null){
              //go through all the hostel bookings to display them
              for(var i=0;i<bookings['hostel'].length;i++){
                tableRow='<tr><th scope="row">'+bookings['hostel'][i].bookingID+'</th><td>'+bookings['hostel'][i].startDate+'</td><td>'+bookings['hostel'][i].endDate+'</td><td>'+bookings['hostel'][i].roomID+'</td><td>'+bookings['hostel'][i].pricePerNight+'</td><td>'+ bookings['hostel'][i].noOfPeople+'</td></tr>';
                document.getElementById('usersHostelBookingTableforEditBody').innerHTML += tableRow;
                document.getElementById('usersHostelBookingTableforEditBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="editHostelBookingBtn" data-toggle="modal" data-target="#updateHostelBookingModal" onclick=setHostelBookingID('+bookings['hostel'][i].bookingID+')>Edit</button>';
                document.getElementById('usersHostelBookingTableforEditBody').innerHTML += '<button type="button" class="btn btn-primary newColor" id="cancelHostelBookingBtn" data-toggle="modal" data-target="#viewUsersHostelBookingsModal" onclick=cancelUserHostelBookings('+bookings['hostel'][i].bookingID+')>Cancel</button>';
              }
            }

            //if no hostel booking have been made by user
            if(bookings['hostel']== null ){
              //display error message
              document.getElementById('usersBookingErrorforviewUserHostelBookings').innerHTML = 'User has no bookings'
            }
          }
        }
        else{
          throw new Error('Error getting customers' + response.code);
        }
      }
      catch (error){
        alert ('Problem: ' + error);
      }
    }
    else{
      //if user doesn't exist print error message
      document.getElementById('usersBookingErrorforviewUserHostelBookings').innerHTML = 'User does not exist in the database'
    }
  }
}


//update activity booking
async function updateActivityBooking(){

  //get activity booking id
  activityBookingID = document.getElementById('activitybookingId').value

  //get number of people
  numberOfPeople = document.getElementById('numberOfPeopleActivityforEdit').value

  //check that number of people is an integer
  if(Number.isInteger(parseInt(numberOfPeople)) == false){
    //print error message
    document.getElementById('updateActivityBookingError').innerHTML= 'Please enter an integer for number of people'
  }

  price = document.getElementById('priceActivityforEdit').value

  try{
    //edit exist activity booking
    let response = await fetch('http://localhost:8090/updateactivitybooking',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'bookingid=' + activityBookingID + '&type=booking' + '&numberofpeople=' + numberOfPeople + '&price=' + price
    });

    //if response isn't fine
    if(!response.ok){
        //error message
        throw new Error('problem editing the booking ' + response.code);
    }
    else{
        //success message
        document.getElementById('updateActivityBookingError').innerHTML='Booking successful'
    }
  }
  catch(error){
    alert ('Error: ' + error);
  }
}

//update community booking
async function updateCommunityBooking(){
  //get community booking id
  communityBookingID = document.getElementById('communitybookingId').value

  //get parameters
  startYear = document.getElementById('startYearCommunityforEdit').value
  startMonth = document.getElementById('startMonthCommunityforEdit').value
  startDay = document.getElementById('startDayCommunityforEdit').value
  startHour = document.getElementById('startHourCommunityforEdit').value
  //calculate epoch value for start and end date
  startTime = (new Date(startYear, startMonth-1, startDay, startHour, 0, 0, 0).getTime()+8*3600*1000)/1000;


  endYear = document.getElementById('endYearCommunityforEdit').value
  endMonth = document.getElementById('endMonthCommunityforEdit').value
  endDay = document.getElementById('endDayCommunityforEdit').value
  endHour = document.getElementById('endHourCommunityforEdit').value
  endTime = (new Date(endYear, endMonth-1, endDay, endHour, 0, 0, 0).getTime()+8*3600*1000)/1000;
  price = document.getElementById('priceCommunityforEdit').value

  try{
    //edit exist community booking
    let response = await fetch('http://localhost:8090/updatecommunitybooking',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'bookingid=' + communityBookingID + '&type=booking' + '&start=' + startTime + '&end=' + endTime + '&price=' + price
    });

    //if response isn't fine
    if(!response.ok){
        //error message
        throw new Error('problem editing the booking ' + response.code);
    }
    else{
        //success message
        document.getElementById('updateCommunityBookingError').innerHTML='Booking successful'
    }
  }
  catch(error){
    alert ('Error: ' + error);
  }
}

//update hostel booking
async function updateHostelBooking(){
  //get hostel booking id
  hostelBookingID = document.getElementById('hostelbookingId').value

  //get parameters
  startYear = document.getElementById('startYearHostelforEdit').value
  startMonth = document.getElementById('startMonthHostelforEdit').value
  startDay = document.getElementById('startDayHostelforEdit').value
  startHour = document.getElementById('startHourHostelforEdit').value
  //calculate epoch value for start and end date
  startTime = (new Date(startYear, startMonth-1, startDay, startHour, 0, 0, 0).getTime()+8*3600*1000)/1000;


  endYear = document.getElementById('endYearHostelforEdit').value
  endMonth = document.getElementById('endMonthHostelforEdit').value
  endDay = document.getElementById('endDayHostelforEdit').value
  endHour = document.getElementById('endHourHostelforEdit').value
  endTime = (new Date(endYear, endMonth-1, endDay, endHour, 0, 0, 0).getTime()+8*3600*1000)/1000;


  price = document.getElementById('priceHostelforEdit').value

  //get number of people
  numberOfPeople = document.getElementById('numberOfPeopleHostelforEdit').value

  try{
    //edit exist community booking
    let response = await fetch('http://localhost:8090/updatehostelbooking',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'bookingid=' + hostelBookingID + '&type=booking' + '&start=' + startTime + '&end=' + endTime + '&price=' + price + '&numberofpeople=' + numberOfPeople
    });

    //if response isn't fine
    if(!response.ok){
        //error message
        throw new Error('problem editing the booking ' + response.code);
    }
    else{
        //success message
        document.getElementById('updateHostelBookingError').innerHTML='Booking successful'
    }
  }
  catch(error){
    alert ('Error: ' + error);
  }
}

//cancel activity booking
async function cancelUserActivityBookings(activityBookingId){
  //if no id
  if(activityBookingId == null){
    //print error
    document.getElementById('usersBookingErrorforsearchActivityBooking').innerHTML = 'No id supplied when canceling for the booking'
  }
  else{
    //get customer info
    try{
      //cancel exist activity booking
      let response = await fetch('http://localhost:8090/cancelbooking',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'id=' + activityBookingId + '&type=activity'
      });

      //if response is fine
      if(response.ok){
        //success message
        document.getElementById('cancelActivityBookingError').innerHTML='Cancel Booking successful'
      }
      else{
        throw new Error('Error canceling booking' + response.code);
      }
    }
    catch (error) {
      alert ('Error: ' + error);
    }
  }
}

//cancel commuity booking
async function cancelUserCommunityBookings(communityBookingId){
  //if no id
  if(communityBookingId == null){
    //print error
    document.getElementById('usersBookingErrorforsearchCommunityBooking').innerHTML = 'No id supplied when canceling for the booking'
  }
  else{
    //get customer info
    try{
      //cancel exist activity booking
      let response = await fetch('http://localhost:8090/cancelbooking',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'id=' + communityBookingId + '&type=community'
      });

      //if response is fine
      if(response.ok){
        //success message
        document.getElementById('cancelCommunityBookingError').innerHTML='Cancel Booking successful'
      }
      else{
        throw new Error('Error canceling booking' + response.code);
      }
    }
    catch (error) {
      alert ('Error: ' + error);
    }
  }
}

//cancel hostel booking
async function cancelUserHostelBookings(hostelBookingId){
   //if no id
  if(hostelBookingId == null){
    //print error
    document.getElementById('usersBookingErrorforsearchHostelBooking').innerHTML = 'No id supplied when canceling for the booking'
  }
  else{
    //get customer info
    try{
      //cancel exist activity booking
      let response = await fetch('http://localhost:8090/cancelbooking',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: 'id=' + hostelBookingId + '&type=hostel'
      });

      //if response is fine
      if(response.ok){
        //success message
        document.getElementById('cancelHostelBookingError').innerHTML='Cancel Booking successful'
      }
      else{
        throw new Error('Error canceling booking' + response.code);
      }
    }
    catch (error) {
      alert ('Error: ' + error);
    }
  }
}
