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


