// Test area
console.log(document.getElementsByName('maxPeople'))

// // Selecting page elements
// const eventPic = document.getElementsByName("eventPic");
 const responseField = document.getElementById("responseField");
 const payButtons = document.getElementsByClassName("row")
 const paymentTable = document.getElementById("paymentTable");
// const paymentButton = document.getElementById("fat-btn");

// AJAX function
// when open the page, fetch hostel infor from the database
getHostel = async() => {
  const url ='/rooms';
  const queryParams ='?types=hostel';
  const endpoint = `${url}${queryParams}`
  try{
    const response = await fetch( endpoint, {
      method:"GET",
      headers:{
        "Content-Type": "application/json"
      }
    })
    if(response.ok){
      if(response.body === '0types' || response.body === '0database'){
        // get element do the replacement 
        responseField.innerHTML = "<p>Sorry, No hostel room available.</p><p>Please wait for release.</p>";
        paymentButton.disable = true;
        paymentTable.style.display = "none";
      } else{
        const jsonResponse = await response.json();
        // render json response
        if(jsonResponse.error){
          responseField.innerHTML = "<p>Sorry, error occurs.</p><p> Try later.</p>";
          payButtons.disable = true;
          paymentTable.style.display = "none";
        } else {
          return jsonResponse["hostel"]

        }
      }
    }
    throw new Error('Error getting hostel.' + response.code);
  }catch(error){
    alert ('Error: ' + error + ' Possible solution: check your internet connection');
  }
}

// use hostel info fetched to update the html
updateHostel = async() => {
  const rooms = await getHostel();
  if(rooms == 'Error'){
    responseField.innerHTML = 'Error fetching hostel rooms'
  }else{
    // change in the summary box
    // room type, Price per person per night
    console.log(rooms)

    // change the max in the number of people label
    const maxPeople = document.getElementsByName('maxPeople');
    const roomNum = document.getElementsByName('roomNum');
    const pricePerNight = document.getElementsByName('pricePerNight');
    for(i=0; i<maxPeople.length; i++){
      maxPeople[i].max = rooms[i]['noOfPeople']
      roomNum[i].innerHTML = rooms[i]['roomNumber']
      pricePerNight[i].innerHTML = rooms[i]['pricePerNight']

    }

    // roomDrop = document.getElementById("roomSelectDrop");
    // bookRoomDrop = document.getElementById("bookingRoomDropdown");
    // for (i = 0; i < rooms.length; i++) {
    //     let option = document.createElement("option");
    //     let option2 = document.createElement("option");
    //     option.text = rooms[i]["name"];
    //     option2.text = rooms[i]["name"];
    //     option.value = rooms[i]["id"];
    //     option2.value = rooms[i]["id"];
    //     bookRoomDrop.add(option2);
    //     roomDrop.add(option);
  }
}
updateHostel();


////////////////////////////////////////////////////////////////////////////


document.getElementById('month1').addEventListener("change", function(){
    year = document.getElementById("year1").value;
    month = document.getElementById("month1").value;
    fillDayDrop(year,month,'day1')
  });

document.getElementById('month2').addEventListener("change", function(){
    year = document.getElementById("year2").value;
    month = document.getElementById("month2").value;
    fillDayDrop(year,month,'day2')
  });

document.getElementById('month3').addEventListener("change", function(){
    year = document.getElementById("year3").value;
    month = document.getElementById("month3").value;
    fillDayDrop(year,month,'day3')
  });

document.getElementById('month4').addEventListener("change", function(){
    year = document.getElementById("year4").value;
    month = document.getElementById("month4").value;
    fillDayDrop(year,month,'day4')
  });

document.getElementById('month5').addEventListener("change", function(){
    year = document.getElementById("year5").value;
    month = document.getElementById("month5").value;
    fillDayDrop(year,month,'day5')
  });


function daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
 }


function fillDayDrop(year, month,dayValue){
  daysDrop = document.getElementById(dayValue);
  for(var i=1; i<=daysInMonth(year,month);i++){
    var d = new Date();
    var today=d.getDate();
    if(i>=today){
      let option = document.createElement("option")
      option.text = i.toString().padStart(2,'0'); 
      daysDrop.add(option); 
    }
  }
}


