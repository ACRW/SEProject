const hostAddr = "localhost";
const hostPort = "8090";


/*
/currentuser
{"type":"customer","userID":8}

/currentusername
[{"fName":"D","lName":"Rory"}]
*/



async function getOrderInfo () {
    // get current user name 
    let response = await fetch('http://' + hostAddr + ":" + hostPort + '/currentusername', {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

    let tempRooms = await response.json();
    /*
    [{"fName":"D","lName":"Rory"}]
    */
}