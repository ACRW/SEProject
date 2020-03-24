const hostAddr = "localhost";
const hostPort = "8090";

let roomCards = {} // Keeps track of all the activity card classes
let rooms = {}

async function createCards () { // Get the card information and create them
  let response = await fetch('http://' + hostAddr + ":" + hostPort + '/rooms?types=hostel', {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
  let tempRooms = await response.json();
  
  for (room of tempRooms["hostel"]) {
    roomCards[room["id"]] = new RoomCard(room);
    rooms[room["id"]] = room;
  }
}

function RoomCard (room) { // room card class, each instantiated class refers to a single card on the document.
  let title = document.createElement('h4');
  title.className="card-title";
  title.innerHTML = "Room " + String(room["roomNumber"]);
  
  /*let desc = document.createElement('p');
  desc.className = "card-text";
  desc.innerHTML = room["description"];*/

  let button = document.createElement('a');
  button.className = "btn btn-primary newColor";
  button.type = "button";
  button.innerHTML = "Book Now";
  button.onclick= function(){updateFields(room["id"]);};//function () {console.log("test");};
  button.setAttribute("data-toggle", "modal");
  button.setAttribute("data-target", "#popUp");
  
  let body = document.createElement('div');
  body.className = "card-body";
  body.appendChild(title);
  //body.appendChild(desc);
  body.appendChild(button);
  
  let img = document.createElement('img');
  img.className = "card-img-top";
  img.src = room["imagePath"];
  
  let card = document.createElement('div');
  card.className = "card";
  card.appendChild(img);
  card.appendChild(body);
  card.style.display = "display: inline-block";
  
  document.getElementById("roomCards").appendChild(card);
}

function modifyPopUp(id) {
  room = rooms[id];
  //document.getElementById("popUpImg").src = room["imagePath"];
}

createCards();

let flag = true;
////// Selecting page elements //////
const room1 = document.getElementById("room1");
const room2 = document.getElementById("room2");
const room3 = document.getElementById("room3");
const room4 = document.getElementById("room4");
const room5 = document.getElementById("room5");

const responseField = document.getElementById("responseField");// error message place 

const maxPeople = document.getElementById("maxPeople"); // input field 

const wholeCalender = document.getElementById("cldFrame"); // whole calender
const startDateCalender = document.getElementById("startDateCalender"); // start date of the calander
const endDateCalender = document.getElementById("endDateCalender"); // end date of the calander

//const paymentTable = document.getElementsByClassName("table"); // whole table
const roomNumTable=document.getElementById("roomNum"); // table content 1
const pricePerNight = document.getElementById('pricePerNight'); // table content 2
const numOfPeople = document.getElementById('numOfPeople'); // table content 3
const startDateTable=document.getElementById('startDayTable');// table content 4
const endDateTable=document.getElementById('endDayTable');// table content 5
const durationTable=document.getElementById('duration');// table content 6
const totalPrice = document.getElementById('totalPrice'); // table content 7

const submitButton = document.getElementById("submitButton"); // the submittion button


////// All functions //////

/// calender functions ///

// get which weekday is the first day in a month
// year= yyyy, month = 1-12
// return a number 0-6 // 0 =sun,6=sat
function getWeekday(year,month){
  let d= new Date();
  d.setFullYear(year);
  d.setMonth(month-1);
  d.setDate(1);
  const weekday=d.getDay();
  return weekday
}

// add zero before number
// num is the number
// length is how long you want the string be
// addzero(11,4) returns 0011
// addzero(4,11) returns 00000000004
// addzero(123445677, 4) returns 5677
function addzero(num, length) {    
  return (Array(length).join("0") + num).slice(-length);
};

// get week info, return Error if error
// return the not vialable pattern of the room
const getWeekInfo = async(roomid) =>{
  const rooms = await getHostel();
  if(rooms == "Error"){
    responseField.innerHTML = "<p>Error fetching hostel rooms</P>";
    return "Error";
  }else{
    let weekInfo = rooms[roomid]['nights'];
    return weekInfo;
  }

};

// year= yyyy, month* = 0-11
// return a proper calander. the already booked date colored grey 
async function roomRented(year,month,roomid){
  let i;
  let response = await fetch('http://' + hostAddr + ":" + hostPort + '/roomavailability?type=hostel&id=' + String(roomid - 1), {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
  });
  let availability = await response.json();
  /* what inside json
  {"nights":"1111100",
  "id":"0",
  "busy":[{"startDate":"2020-02-23T00:00:00.000Z","endDate":"2020-03-17T00:00:00.000Z"},
          {"startDate":"2020-02-23T00:00:00.000Z","endDate":"2020-03-17T00:00:00.000Z"},
          {"startDate":"2020-02-23T00:00:00.000Z","endDate":"2020-03-17T00:00:00.000Z"}]}
  */
  const bookings = availability["busy"];// get the list
  let startlist=[];
  let endlist=[];

  for(i=0;i<bookings.length;i++){// each day from the list
    const start=bookings[i].startDate; // "2020-02-23T00:00:00.000Z"
    const end=bookings[i].endDate; // "2020-03-17T00:00:00.000Z"
    startlist.push(start.substring(0,10));// 2020-02-23
    endlist.push(end.substring(0,10));//2020-03-17
  }
  

  for(i=0;i<startlist.length;i++) { // for each pair of date
    /*key is, we only need to calculte the not available day of the month*/
    let id1=startlist[i];
    let ida=id1.split('-'); // [ '2020', '02', '23' ]2020 2
    let id2=endlist[i];
    let idb=id2.split('-'); // [ '2020', '03', '17' ]

    let year1 = Number(ida[0]);
    let month1 = Number(ida[1])-1;
    let day1 = Number(ida[2]);
    let date1 = new Date(year1,month1,day1);//start date

    let year2 = Number(idb[0]);
    let month2 = Number(idb[1])-1;
    let day2 = Number(idb[2]);
    let date2 = new Date(year2,month2,day2);//end date

    let dayinmonth=new Date(year,month+1,0).getDate();//days=28~31 as number of days in this month

    for(let day=1;day<=dayinmonth;day++){//for each day in the calander
      let dateNow = new Date(year,month,day);
      if(dateNow<date1){
        //do nothing
      }else if(date1<=dateNow && dateNow<= date2){
        //colored grey
        let fixeday=addzero(day,2);
        let fixedmonth=addzero(month+1,2);
        let idvalue=year+'-'+fixedmonth+'-'+fixeday;
        let cell=document.getElementById(idvalue);
        if(cell){// find it and colored grey
          cell.bgColor='gray';
        }
      }else{
        //do nothing 
      };
    };
  };

};

//calendar basic display
// set calander，grey pastdays，roomstates？？
// year= yyyy, month* = 0-11
// firstDay =0-6(which weekday is first day in this month)0 =sun,6=sat| 
// days=28~31 as number of days in this month
// roomid = roomid stored in the database
function showCld(year, month, firstDay, days, roomid,weekInfo){
  var i;
  var tagClass = "";
  var nowDate = new Date();
  var today=nowDate.getDate();
  let curMonth = nowDate.getMonth()+1;
  let curYear = nowDate.getFullYear();
  month = month+1

  //add current year and month to the top
  var topdateHtml = year  + '-'+ addzero(month,2);
  var topDate = document.getElementById('topDate');
  topDate.innerHTML = topdateHtml;    
  
  // add days html
  // a new row
  var tbodyHtml = '<tr>';
  //blank before first day
  for(i=0; i<firstDay; i++){//fill before 1st of the month
      tbodyHtml += "<td></td>";
  }
 
  var changLine = firstDay;

  for(i=1; i<=days; i++){
    // set class for current day and other days.
    if(year == nowDate.getFullYear() && month == nowDate.getMonth()+1 && i == today) {
      tagClass = "curDate"; // current date
    } 
    else{ 
      tagClass = "isDate"; // other date, set class for future reference
    }  
    //fill in the table, add class and id to each cell
    const fixedmonth=addzero(month,2)
    const fixedday=addzero(i,2)
    const idvalue=year+'-'+fixedmonth+'-'+fixedday// yyyy-mm-dd
    
    tbodyHtml += "<td class=" + tagClass + " id="+idvalue +">" + i + "</td>";
    changLine = (changLine+1)%7;

    //whether change the line
    if(changLine == 0 && i != days){
        tbodyHtml += "</tr><tr>";
    } 
  }

  if(changLine!=0){// after all days, fill the blank place
      for (i=changLine; i<7; i++) {
          tbodyHtml += "<td></td>";
      }
  }   

  tbodyHtml +="</tr>";// end
  var tbody = document.getElementById('tbody');
  tbody.innerHTML = tbodyHtml;// add to the html

  //gray the past days
  if (curYear == year && curMonth==month){
    for(let x=today-1;x>=1;x--){ // all days before today
      const fixedmonth=addzero(month,2)
      const fixedx=addzero(x,2)
      const idvalue1=year+'-'+fixedmonth+'-'+fixedx
      document.getElementById(idvalue1).bgColor='gray'
    }
  }

  // grey the fixed not avialable date
  let NotBookableDate = [];
  for(i=0; i<weekInfo.length; i++){// 0=monday,6=sunday
    if(weekInfo[i] === '0'){
      NotBookableDate.push(i);
    }
  }
  // [5,6] means sat&sun
  // in database 0=monday,6=sunday
  // in javaScript 0=sunday,6=sat
  for(i=0; i<NotBookableDate.length;i++){
    NotBookableDate[i] = (NotBookableDate[i]+1)%7;
  }

  for(i=0; i<NotBookableDate.length;i++){// for each date in the list
    for(let j=1; j<=days;j++){// for each day in the month
      let today = new Date(year,month-1,j);
      let date = today.getDay();
      if(date==NotBookableDate[i]){
        // colored grey
        let fixeday=addzero(j,2);
        let fixedmonth=addzero(month,2);
        let idvalue=year+'-'+fixedmonth+'-'+fixeday;
        let cell=document.getElementById(idvalue);
        if(cell){// find it and colored grey
          cell.bgColor='gray';
        }
      };
    }
  }
  
  // grey those days already be rented
  roomRented(year,month-1,roomid);
}

async function nextMonth(roomid){
  var topStr = document.getElementById("topDate").innerHTML;// yyyy-dd
  var pattern = /\d+/g;
  var listTemp = topStr.match(pattern); //['2019', '02']
  var year = Number(listTemp[0]);
  var month = Number(listTemp[1]); // 02 -> 2
  
  var nextMonth = month+1;
  if(nextMonth > 12){
      nextMonth = 1;
      year++;
  }
  var weekday=getWeekday(year,nextMonth); //which weekday is first day in a month
  // Date(year,nextMonth,1) is the defualt
  // eg Date(2020,2,1) gives 2020-03-01T00:00:00.000Z
  // max of this month，day-1,do Date(2020,2,0) get 2020-02-29T00:00:00.000Z. here 29 is what we want
  var dayinmonth=new Date(year,nextMonth,0).getDate();//days=28~31 as number of days in this month

  document.getElementById('topDate').innerHTML = '';

  let weekInfo= await getWeekInfo(roomid);
  if(weekInfo=="Error"){
    alert("Error: Cannot get the fixed not avaliable dates of this room");
    return;
  }
  showCld(year, nextMonth-1,weekday,dayinmonth,roomid,weekInfo);
}

async function preMonth(roomid){
  var topStr = document.getElementById("topDate").innerHTML;
  var pattern = /\d+/g;
  var listTemp = topStr.match(pattern);//['2019', '02']
  var year = Number(listTemp[0]);
  var month = Number(listTemp[1]);// 02 -> 2

  var preMonth = month-1;//1-12
  let today = new Date();
  let curMonth = today.getMonth()+1;//1-12

  if(preMonth<curMonth){
      return
  }else if(preMonth < 1){
    preMonth = 12;
    year--;
  }
  var weekday=getWeekday(year,preMonth);
  var dayinmonth=new Date(year,preMonth,0).getDate();

  document.getElementById('topDate').innerHTML = '';
  let weekInfo= await getWeekInfo(roomid);
  if(weekInfo=="Error"){
    alert("Error: Cannot get the fixed not avaliable dates of this room");
    return;
  }
  showCld(year, preMonth-1, weekday, dayinmonth,roomid,weekInfo);
}

// update the date inside the calender and the table
async function infor(e){ 
  let color=e.target.bgColor;
  if (color=='gray'){
    alert('This day can not be book');
    return;
  }

  let id = e.target.id;
  const startDateCalender = document.getElementById('startDateCalender').innerHTML;

  if(id =='tbody'){
    // means select multipul components->ignor
    return;
  }else if(startDateCalender=='--'){
    // put in startdate
    document.getElementById('startDateCalender').innerHTML=id;
    document.getElementById('startDayTable').innerHTML=id;
    return;
  }else{
    let idNow=id.split('-'); // [ '2020', '02', '23' ]
    let idStart=startDateCalender.split('-'); // [ '2020', '03', '17' ]

    let year1 = Number(idNow[0]);
    let month1 = Number(idNow[1])-1;
    let day1 = Number(idNow[2]);
    let userDate = new Date(year1,month1,day1); //user choosed date

    let year2 = Number(idStart[0]);
    let month2 = Number(idStart[1])-1;
    let day2 = Number(idStart[2]);
    let startDate = new Date(year2,month2,day2); //start date

    
    if(userDate>startDate){
      // put in enddate
      document.getElementById('endDateCalender').innerHTML=id;
      document.getElementById('endDayTable').innerHTML=id;
      // calculte duration 
      let duration = await calculateDuration(startDate,userDate);//start and end date
      if(duration=="Error"){
        alert("Error calculating duration");
        return;
      }
      durationTable.innerHTML=duration;
    }else if(userDate.getTime() === startDate.getTime()){
      if(flag){
        // update the end date same as the start date
        document.getElementById('endDateCalender').innerHTML=id;
        document.getElementById('endDayTable').innerHTML=id;
        // calculate duration
        let duration = await calculateDuration(startDate,userDate);//start and end date
        if(duration=="Error"){
          alert("Error calculating duration");
          return;
        }
        durationTable.innerHTML=duration;
        // change the flag
        flag=false;
      }else{
        // clear start date
        document.getElementById('startDateCalender').innerHTML='--';
        document.getElementById('startDayTable').innerHTML='--';
        // clear end date
        document.getElementById('endDateCalender').innerHTML='--';
        document.getElementById('endDayTable').innerHTML='--';
        durationTable.innerHTML='--';
        // change the flag
        flag=true;
      }

    }else{//userDate<startDate
      // put in startdate
      document.getElementById('startDateCalender').innerHTML=id;
      document.getElementById('startDayTable').innerHTML=id;
      // clean enddate
      document.getElementById('endDateCalender').innerHTML='--';
      document.getElementById('endDayTable').innerHTML='--';
      durationTable.innerHTML='--';
    }
    /////////A CHECK/////////////
    checkPrice();
    return;
  };
  
}

//start and end date
const calculateDuration=async(startDate,endDate)=>{
  // number of days in middle
  let Difference_In_Time = endDate.getTime() - startDate.getTime();   
  // To calculate the no. of days between two dates 
  let Difference_In_Days = parseInt(Difference_In_Time / (1000 * 3600 * 24)+0.5);// time zone changes
  // get roomid
  const roomid = Number(roomNumTable.innerHTML)-1;
  // get roomavailability
  const availability = await roomAvailability(roomid);
  console.log(availability);
  if(availability=="Error"){
    return "Error";
  }
  // make a busy date list
  let occupied = [];
  let i;


  // get ride of the fixed not bookable date //
  const weekInfo = availability["nights"]// '1111100'
  let NotBookableDate = [];
  for(i=0; i<weekInfo.length; i++){// 0=monday,6=sunday
    if(weekInfo[i] === '0'){
      NotBookableDate.push(i);
    }
  }
  // [5,6] means sat&sun
  // in database 0=monday,6=sunday / in javaScript 0=sunday,6=sat

  for(i=0; i<NotBookableDate.length;i++){
    NotBookableDate[i] = (NotBookableDate[i]+1)%7;
  }//convert to [0,6]
  for(i=0; i<NotBookableDate.length;i++){// for each date in the list
    for(let j=new Date(startDate.getTime()); j<=endDate;j.setDate(j.getDate() + 1)){// for each day between 2 dates.
      if(j.getDay() === Number(NotBookableDate[i])){
        occupied.push(new Date(j));// have to push a new date object, not the reference.
      };
      // means j++
      //aug32 automatically becomes sep1
    }
  }
  



  // get ride of reserved date //
  const bookings=availability["busy"];
  console.log(bookings)
  let startlist=[];
  let endlist=[];


  for(i=0;i<bookings.length;i++){// each day from the list
    const start=bookings[i].startDate; // "2020-02-23T00:00:00.000Z"
    const end=bookings[i].endDate; // "2020-03-17T00:00:00.000Z"
    startlist.push(start.substring(0,10));// 2020-02-23
    endlist.push(end.substring(0,10));//2020-03-17
  }

  for(i=0;i<startlist.length;i++) { // for each pair of date
    let id1=startlist[i];
    let ida=id1.split('-'); // [ '2020', '02', '23' ]2020 2
    let id2=endlist[i];
    let idb=id2.split('-'); // [ '2020', '03', '17' ]

    let year1 = Number(ida[0]);
    let month1 = Number(ida[1])-1;
    let day1 = Number(ida[2]);
    let date1 = new Date(year1,month1,day1);//booked start date

    let year2 = Number(idb[0]);
    let month2 = Number(idb[1])-1;
    let day2 = Number(idb[2]);
    let date2 = new Date(year2,month2,day2);//booked end date

    if(startDate<date1 && date2<endDate){//dates are in between
      //var copiedDate = new Date(date.getTime())
      for(let j=new Date(date1.getTime());j<=date2;){// push each date
        //console.log(j)
        occupied.push(new Date(j));// have to push a new date object, not the reference.
        // means i++
        j.setDate(j.getDate() + 1);//aug32 automatically becomes sep1
      }
    }
  }

  // get ride of repetations in occupie list
  // here could have use the Array.from(new Set(a)),but the date object must have the same reference
  // It can't remove duplicate Date objects that share the same values but not the same references
  let occupiedNew = occupied
  .map(function (date) { return date.getTime() })
  .filter(function (date, i, array) {
      return array.indexOf(date) === i;
   })
  .map(function (time) { return new Date(time); });

  let duration = Difference_In_Days-occupiedNew.length+1;
  return duration
};

// check and calculate the total price
const checkPrice =()=>{
  if ( pricePerNight.innerHTML!='--'&&numOfPeople.innerHTML!='--'&&durationTable.innerHTML!='--'){
    let total =  Number(pricePerNight.innerHTML)*Number(numOfPeople.innerHTML)*Number(durationTable.innerHTML);
    totalPrice.innerHTML = total;
    submitButton.hidden=false;
  }else{
    totalPrice.innerHTML = '--';
    submitButton.hidden=true;
  }
};

/// load the page functions ///
// erase the whole form 
const eraseFields = () =>{
  // error message place clean up
  responseField.innerHTML="";
  // number of people: value & limit
  maxPeople.value=0;
  maxPeople.max=0;
  // calander change to default
  const defaultCalender="<div id='cldBody'><table><thead><tr><td colspan='7'><div id='top'><span id='left'>&lt;</span><span id='topDate'>waitforjs</span><span id='right'>&gt;</span></div></td></tr><tr id='week'><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td></tr></thead><tbody id='tbody'></tbody></table></div>";
  wholeCalender.innerHTML = defaultCalender;
  // start date & end date fields= --
  startDateCalender.innerHTML ="--";
  endDateCalender.innerHTML="--";
  // all table intems = --
  roomNum.innerHTML="--";
  pricePerNight.innerHTML="--";
  numOfPeople.innerHTML="--";
  startDateTable.innerHTML="--";
  endDateTable.innerHTML="--";
  durationTable.innerHTML="--";
  totalPrice.innerHTML="--.";
  // disable submittion button
  submitButton.hidden=true;
}

// update the whole form, room number now uses the actual id value, so must add one upon recieving it.
const updateFields = async(roomNumber) =>{
    roomNumber += 1;
    const rooms = await getHostel();
    if(rooms == "Error"){
      responseField.innerHTML = "<p>Error fetching hostel rooms</P>";
    }else{
      // erase the page
      eraseFields();
      
      //1. Number of people:
      //  change the max in the number of people label
      maxPeople.max = rooms[roomNumber-1]['noOfPeople'];
      //  when changed, update the table
      maxPeople.addEventListener('change', ()=>{
        numOfPeople.innerHTML=maxPeople.value;
        if(maxPeople.value==0){
          numOfPeople.innerHTML='--';
        }
        /////////A CHECK/////////////
        checkPrice();
      });

      //2. calander:
      let weekInfo = rooms[roomNumber-1]['nights'];
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth();
      let firstDay=getWeekday(year,month+1);
      var days= new Date(year, month+1, 0).getDate();
      showCld(year, month, firstDay, days, roomNumber,weekInfo);

      // enable the calendar left and right button function
      document.getElementById('left').onclick=function(){
        preMonth(roomNumber-1);
      }
      document.getElementById('right').onclick = function(){
        nextMonth(roomNumber-1);
      }

      // when click, update the time
      document.getElementById('tbody').addEventListener('click', infor);

      // 3. table:
      // update payment table:Room number & Price
      roomNumTable.innerHTML = rooms[roomNumber-1]['roomNumber'];
      pricePerNight.innerHTML = rooms[roomNumber-1]['pricePerNight'];
      
    }

};

// when open the page, fetch hostel infor from the database
getHostel = async() => {
    const url ='/rooms';
    const queryParams ='?types=hostel';
    const endpoint = `${url}${queryParams}`;
    try{
      const response = await fetch( endpoint, {
        method:"GET",
        headers:{
          "Content-Type": "application/json"
        }
      })
      if(response.ok){// receive and get ok
          const jsonResponse = await response.json();
          if(jsonResponse.error){// cannot change it to json format
            //responseField.innerHTML = "<p>Sorry, error occurs.</p><p> Try later.</p>";
            return "Error"
          } else {
            // return all the hostel
            return jsonResponse["hostel"];
          }
        }
      // receive but not ok
      //responseField.innerHTML = "<p>Sorry, hostel room Not available. </p><p>Response code =  "+ response.code +"</p>";
      return "Error"
      //throw new Error('Error getting hostel.' + response.code);
    }catch(error){// did not receive anything 
      //alert ('Error: ' + error + ' Possible solution: check your internet connection');
      return "Error"
    }
}

// get room availability
async function roomAvailability(roomid){
  let i;
  let response = await fetch('http://' + hostAddr + ":" + hostPort + '/roomavailability?type=hostel&id=' + roomid, {
    method: "GET",
    headers: {
        "Content-Type": "application/json"
    }
  });
  let availability = await response.json();
  /* what inside json
  {"nights":"1111100",
  "id":"0",
  "busy":[{"startDate":"2020-02-23T00:00:00.000Z","endDate":"2020-03-17T00:00:00.000Z"},
          {"startDate":"2020-02-23T00:00:00.000Z","endDate":"2020-03-17T00:00:00.000Z"},
          {"startDate":"2020-02-23T00:00:00.000Z","endDate":"2020-03-17T00:00:00.000Z"}]}
  */
  return availability;
}

// submittion functions
/*/staffhostelbooking
      body:{
        customerid:0, // fake for now
        roomid: roomid,//0-4
        start: start,//format:"2020-02-23T00:00:00.000Z"
        end: end// format:"2020-03-17T00:00:00.000Z"
      }*/
submitBooking = async(customerid,roomid,start,end)=>{
  //create new hostel booking
  let response = await fetch('http://' + hostAddr + ":" + hostPort + '/staffhostelbooking',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'customerid=' + customerid + '&roomid=' + roomid + '&start=' + start + '&end=' + end
  });
  //if response isn't fine
  if(!response.ok){
    //error message
    throw new Error('problem adding new event ' + response.code);
  }else{
    //success message
    responseField.innerHTML='Booking successful.';

    //reset forms
    eraseFields();
  }

};

////// Action /////
// load the page
//  update
updateFields(1);

window.onload = function() {
  // paging buttons
/*  room1.addEventListener("click",function(){
    updateFields(1);
  });
  room2.addEventListener("click",function(){
    updateFields(2);
  });

  room3.addEventListener("click",function(){
    updateFields(3);
  });

  room4.addEventListener("click",function(){
    updateFields(4);
  })

  room5.addEventListener("click",function(){
    updateFields(5);
  })*/

  // submitbutton event listener.
  submitButton.addEventListener("click", function(event){
    event.preventDefault()
    // get all info needed
    const customerid = 0;//fake for now
    const roomid = Number(roomNumTable.innerHTML);
    let start = startDateTable.innerHTML;
    start=start.split('-');
    let end = endDateTable.innerHTML;
    end = end.split('-');

    let year1 = Number(start[0]);
    let month1 = Number(start[1])-1;
    let day1 = Number(start[2]);
    let date1 = new Date(year1,month1,day1);//start date

    let year2 = Number(end[0]);
    let month2 = Number(end[1])-1;
    let day2 = Number(end[2]);
    let date2 = new Date(year2,month2,day2);//end date
    // send
    submitBooking(customerid,roomid,date1,date2);
  });
};
