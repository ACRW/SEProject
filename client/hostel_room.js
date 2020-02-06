
// Selecting page elements
const responseField = document.getElementsByName("responseField");//error message
const showUser = document.getElementsByName("SubmittionResponse");//submission message
const maxPeople = document.getElementsByName('maxPeople'); // input field 

const paymentTable = document.getElementsByClassName("table"); // table
const pricePerNight = document.getElementsByName('pricePerNight'); // table content 2
const numOfPeople = document.getElementsByName('numOfPeople'); // table content 3

var startday=document.getElementsByName('startday');
var endday=document.getElementsByName('endday');

const totalPrice = document.getElementsByName('totalPrice'); // table content 5
const payButtons = document.getElementsByClassName("row"); // button display
const bookButtons = document.getElementsByName('submit'); // button itself

console.log(maxPeople)

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
    

    // change the max in the number of people label
    const roomNum = document.getElementsByName('roomNum');
    console.log(roomNum)

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




//get which day is firstday in a week
function getWeekday(year,month){
    var d= new Date();
    d.setFullYear(year);
    d.setMonth(month-1);
    d.setDate(1);
    weekday=d.getDay();
    return weekday
}

//add zero before number
function addzero(num, length) {    
        return (Array(length).join("0") + num).slice(-length);
    }

//calendar basic display
function showCld(year, month, firstDay,days){
    var i;
    var tagClass = "";
    var nowDate = new Date();
    var today=nowDate.getDate();

    //add current year and month to the top
    var topdateHtml = year  + '-'+month;
    var topDate = document.getElementById('topDate');
    topDate.innerHTML = topdateHtml;    
    
    //add days
    var tbodyHtml = '<tr>';
    
    //blank before first day
    for(i=0; i<firstDay; i++){
        tbodyHtml += "<td></td>";
    }
   
    var changLine = firstDay;

    for(i=1; i<=days; i++){
      // set class for current day and other days.
        if(year == nowDate.getFullYear() && month == nowDate.getMonth()+1 && i == today) {
            tagClass = "curDate";
        } 
        else{ 
            tagClass = "isDate";
        }  
        //fill in the table, add class and id to each cell
        fixedmonth=addzero(month,2)
        fixedday=addzero(i,2)
        idvalue=year+'-'+fixedmonth+'-'+fixedday
        
        tbodyHtml += "<td class=" + tagClass + " id="+idvalue +">" + i + "</td>";
        
        changLine = (changLine+1)%7;

        //whether change the line
        if(changLine == 0 && i != days){
            tbodyHtml += "</tr><tr>";
        } 
    }

    if(changLine!=0){
        for (i=changLine; i<7; i++) {
            tbodyHtml += "<td></td>";
        }
    }   

    tbodyHtml +="</tr>";
    var tbody = document.getElementById('tbody');
    tbody.innerHTML = tbodyHtml;

    //gray the past days
    for(x=today-1;x>=1;x--){
        fixedx=addzero(x,2)
        idvalue1=year+'-'+fixedmonth+'-'+fixedx
        document.getElementById(idvalue1).bgColor='gray'
    }


    //display bookings
    roomstatus(0)
    
}


function nextMonth(){
    var topStr = document.getElementById("topDate").innerHTML;
    var pattern = /\d+/g;
    var listTemp = topStr.match(pattern);
    var year = Number(listTemp[0]);
    var month = Number(listTemp[1]);
    
    var nextMonth = month+1;
    if(nextMonth > 12){
        nextMonth = 1;
        year++;
    }
    var weekday=getWeekday(year,nextMonth);
    var dayinmonth=new Date(year,nextMonth,0).getDate();

    document.getElementById('topDate').innerHTML = '';
    showCld(year, nextMonth,weekday,dayinmonth);
}

function preMonth(){
    var topStr = document.getElementById("topDate").innerHTML;
    var pattern = /\d+/g;
    var listTemp = topStr.match(pattern);
    var year = Number(listTemp[0]);
    var month = Number(listTemp[1]);

    var preMonth = month-1;

    if(preMonth<curMonth){
        return
    }else{
        if(preMonth < 1){
            preMonth = 12;
            year--;
        }
    }
    var weekday=getWeekday(year,preMonth);
    var dayinmonth=new Date(year,preMonth,0).getDate();

    document.getElementById('topDate').innerHTML = '';
    showCld(year, preMonth, weekday, dayinmonth);
}



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

async function roomstatus(roomid){

    let response = await fetch('/roomavailability?type=hostel&id=' + roomid, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    let availability = await response.json();
    bookings = availability["busy"];
    startlist=[]
    endlist=[]
    for(i=0;i<bookings.length;i++){
        start=bookings[i].startDate
        end=bookings[i].endDate
        startlist.push(start.substring(0,10))
        endlist.push(end.substring(0,10))
        
    }        

    for(i=0;i<startlist.length;i++) {
       
        id1=startlist[i]
        ida=id1.split('-')
        id2=endlist[i]
        idb=id2.split('-')

        if(ida[1]!=idb[1]){
            
            var day1=ida[2]
            var day2=idb[2]
            var totalday= new Date(ida[0], ida[1], 0).getDate();
            
            //i smalledr than the days in month
            for(a=day1;a<=totalday;a++){
                fixeda=addzero(a,2)
                idvalue=ida[0]+'-'+ida[1]+'-'+a
                if(cell=document.getElementById(idvalue)){
                    cell.bgColor='gray';
                    
                }    
            }

            for(b=1;b<=idb[2];b++){
                fixedb=addzero(b,2)        
                idvalue=idb[0]+'-'+idb[1]+'-'+fixedb
                if(cell=document.getElementById(idvalue)){
                    cell.bgColor='gray';   
                }       
            }
        }
    }            
}



flag=0
function infor(e){ 
    if (flag%2==0 || flag==0){
        color=e.target.bgColor
        if (color=='gray'){
            alert('This day can not be book')
        }else{     
            a=e.target.innerHTML       
            date=document.getElementById("topDate").innerHTML
            document.getElementById('startdate1').innerHTML=date+'-'+a
            document.getElementById('startdate11').innerHTML=date+'-'+a
            
        }
    }else if(flag==1 || flag%2!=0){
        color2=e.target.bgColor
        if(color2=='gray'){
            alert('This day can not be book')
        }else{
            b=e.target.innerHTML       
            date=document.getElementById("topDate").innerHTML
            document.getElementById('enddate1').innerHTML=date+'-'+b
            document.getElementById('enddate11').innerHTML=date+'-'+b

        }
    }
    

  flag++;
}  






var curDate = new Date();
var curYear = curDate.getFullYear();
var curMonth = curDate.getMonth() + 1;
var first=getWeekday(curYear,curMonth)
var dayinmonth= new Date(curYear, curMonth, 0).getDate();

window.onload=showCld(curYear,curMonth,first,dayinmonth);

document.getElementById('left').onclick=function(){
    preMonth();
}

document.getElementById('right').onclick = function(){
        nextMonth();
    }


document.getElementById('tbody').addEventListener('click', infor);
roomstatus(0)

for(i=0; i<maxPeople.length; i++){
  
  maxPeople[i].addEventListener('change', ()=>{
    for(i=0; i<maxPeople.length; i++){
      
      numOfPeople[i].innerHTML=maxPeople[i].value;

      a=numOfPeople[i].innerHTML
      b=pricePerNight[i].innerHTML
      
      totalPrice[i].innerHTML=a*b

    }
  })
}



