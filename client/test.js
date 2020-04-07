let date1 = new Date();//start date
//2020-04-25 11:00:00
tempMonth = date1.getMonth()+1
startDate = date1.getFullYear()+ '-' + tempMonth + '-' +  date1.getDate() +' '+'00:00:00';
console.log(startDate)
console.log(date1.getTime())
console.log(Math.floor(date1.getTime() / 1000))
