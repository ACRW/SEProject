// Information to reach API
const url = 'https://localhost:8090';
const queryParams ='/events';

// Selecting page elements
const eventPic = document.getElementsByName("eventPic");
const responseField = document.getElementById("responseField");
const paymentTable = document.getElementById("paymentTable");
const paymentButton = document.getElementById("fat-btn");

// AJAX function
// when open the page, fetch infor from the database
getEvents = async() => {
  const endpoint = `${url}${queryParams}`
  try{
    const response = await fetch( endpoint, {
      method:"GET",
      headers:{
        "Content-Type": "application/json"
      }
    })
    if(response.ok){
      if(response.body === '0matches' || response.body === '0database'){
        // get element do the replacement 
        responseField.innerHTML = "<p>Sorry, No events available.</p><p>Please wait for release.</p>";
        paymentButton.disable = true;
        paymentTable.style.display = "none";
      } else{
        const jsonResponse = await response.json();
        // render json response
        renderResponse(jsonResponse);
      }
    }
    throw new Error('Error getting events.' + response.code);
  }catch(error){
    console.log(error)
  }
}
// call the function
getEvents();


const renderResponse = (res) => {
  // Displays either message depending on results
  if(res.error){
    responseField.innerHTML = "<p>Sorry, error occurs.</p><p> Try later.</p>";
    paymentButton.disable = true;
    paymentTable.style.display = "none";
  } else {
    // Code to display the json file content code
    /*
    let structuredRes = JSON.stringify(res).replace(/,/g, ", \n");
    structuredRes = `<pre>${structuredRes}</pre>`;
    responseField.innerHTML = `${structuredRes}`;
    */

    // get the number of events and display the right picture in right place
    const eventNumber = res.id.length;
    // get description and display on screen
    let description = res.description;
    // update the payment table 

  }
}



// Clear previous results and display results to webpage
/*
const displaySuggestions = (event) => {
  event.preventDefault();
  while(responseField.firstChild){
    responseField.removeChild(responseField.firstChild)
  }
  getSuggestions();
}

submit.addEventListener('click', displaySuggestions);
*/



window.onload = function(){
  // get all displaced pictures
  //let eventPic = document.getElementsByName("eventPic");
  this.console.log(eventPic.length)
  for(let i = 0; i< eventPic.length; i++){
    // when click show info:
    eventPic[i].onclick = function(){
      //let eventNumber = int(this.id);
      showBookInfo();
    }
  }
}

// when click the pic, show the book info
function showBookInfo() {
  let bookInfo = document.getElementById("bookInfo");
  //console.log(bookInfo.hidden)
  if (bookInfo.hidden === true) {
    bookInfo.hidden = false;
  } else {
    bookInfo.hidden = true;
  }
}

