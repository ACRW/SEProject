// Test area
console.log(document.getElementsByName('maxPeople'))

// Selecting page elements
const responseField = document.getElementsByName("responseField");//error message
const showUser = document.getElementsByName("SubmittionResponse");//submission message
const maxPeople = document.getElementsByName('maxPeople'); // input field 
const numNights = document.getElementsByName('numNights'); // number of nights
const paymentTable = document.getElementsByClassName("table"); // table
const pricePerNight = document.getElementsByName('pricePerNight'); // table content 2
const numOfPeople = document.getElementsByName('numOfPeople'); // table content 3
const duration = document.getElementsByName('duration'); // table content 4
const totalPrice = document.getElementsByName('total Price'); // table content 5
const payButtons = document.getElementsByClassName("row"); // button display
const bookButtons = document.getElementsByName('submit'); // button itself

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
    // get element do the replacement 
    responseField.innerHTML = "<p>Sorry, No hostel room available.</p><p>Please wait for release.</p>";
    paymentButton.disable = true;
    paymentTable.style.display = "none";
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
    const roomNum = document.getElementsByName('roomNum');

    for(i=0; i<rooms.length; i++){
      // update limit
      maxPeople[i].max = rooms[i]['noOfPeople']
      // update payment table
      roomNum[i].innerHTML = rooms[i]['roomNumber']
      pricePerNight[i].innerHTML = rooms[i]['pricePerNight']

      // find not avialable nights
      let weekInfo = rooms[i]['nights']
      let NotBookableDate = [];
      for(j=0; j<weekInfo.length; j++){
        if(weekInfo[j] === '0'){
          NotBookableDate.push(j);
        }
      }
      // update calender 
      // Loretta PLZ HELP ME HERE!!!!! //
    }

    
  }
}

updateHostel();

// synchronize number of people info into the payment table
for(i=0; i<maxPeople.length; i++){
  maxPeople[i].addEventListener('change', ()=>{
    for(i=0; i<maxPeople.length; i++){
      // update number of peopke
      numOfPeople[i].innerHTML=maxPeople[i].value;
      // if both number of people and number of night are selected
      if(maxPeople[i].value != 0 && numNights[i].value != 0){
        console.log(maxPeople[i].value)
        console.log(numNights[i].value)
        // update total value
        totalPrice[i].innerHTML = Number(pricePerNight[i].innerHTML)*maxPeople[i].value*numNights[i].value;
        payButtons[i].hidden = false;
      }else{
        totalPrice[i].innerHTML = '--';
        payButtons[i].hidden = true;
      }
    }

  })
}

// synchronize number of nights info into the payment table
for(i=0; i<numNights.length; i++){
  numNights[i].addEventListener('change', ()=>{
    for(i=0; i<numNights.length; i++){
      // update number of night
      duration[i].innerHTML=numNights[i].value;

      // if both number of people and number of night are selected
      if(maxPeople[i].value != 0 && numNights[i].value != 0){
        console.log(maxPeople[i].value)
        console.log(numNights[i].value)
        // update total value
        totalPrice[i].innerHTML = Number(pricePerNight[i].innerHTML)*maxPeople[i].value*numNights[i].value;
        payButtons[i].hidden = false;
      }else{
        totalPrice[i].innerHTML = '--';
        payButtons[i].hidden = true;
      }
    }
  })
}


// 下面四个是需要时间模块正常工作后才能做的,最后一个我把模板写出来了：
// show year,month,date one by one (3 all together cause difficulty)
// disable all not avialable date for each week (will achieve in updateHostel() function )
// use '/roomavailability' double check before make booking 

// make booking using: '/staffhostelbooking' random generate customer id
for(i=0; i<bookButtons.length; i++){
  bookButtons[i].addEventListener('click', ()=>{
    for(i=0; i<bookButtons.length; i++){
      submitBooking(i, customerid, roomid, start, end);// here need the reall data
    }
  });
}

submitBooking = async(index, customerid, roomid, start, end) => {
  const url ='/staffhostelbooking';
  const queryParams ='';
  const endpoint = `${url}${queryParams}`
  try{
    const response = await fetch( endpoint, {
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      body:{
        customerid:0, // fake for now
        roomid: roomid,
        start: start,
        end: end
      }
    })
    if(response.ok){
      showUser[index].innerHTML = "<p>Order submitted successfully.</p><p> Cheer</p>";
      payButtons[index].disable = true;
    }else{
      showUser[index].innerHTML = "<p>Submission failed.</p><p> Please try agin.</p>";
      throw new Error('Error booking hostel.' + response.code);
    }
  }catch(error){
    alert ('Error: ' + error + ' Possible solution: check your internet connection');
  }
}




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


