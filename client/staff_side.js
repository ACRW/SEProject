document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchForUser").addEventListener("click", searchForUser);
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
        method: 'GET'
      });
    if(response.ok){
      var body = await response.text();
      console.log(body);
      var customers = JSON.parse(body);
      console.log(customers);
      document.getElementById('byUser').hidden = true;
      for(var i=0; i<customers.length; i++){
        document.getElementById('searchResults').innerHTML += '<p> Name : ' + customers[i].fName + ' ' +  customers[i].lName + ' Email: ' + customers[i].email + ' Phone Number: ' + customers[i].phone;
      }
    } else {
      throw new Error('Error getting customers' + response.code);
    }
    } catch (error) {
      alert ('Problem: ' + error);
    }
}
