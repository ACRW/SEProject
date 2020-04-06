// hide & reset sign in card
function resetSignInCard() {
    // hide sign in card
    document.getElementById('signInCard').setAttribute('hidden', '');

    // reset sign in card
    document.getElementById('googleButton').removeAttribute('hidden');
    document.getElementById('spinner').setAttribute('hidden', '');
}

// display welcome message
function showWelcomeMessage() {
    // listen for sign out
    document.getElementById('signOut').addEventListener('click', signOut);

    // listen for new staff link
    document.getElementById('newStaffLink').addEventListener('click', newStaff);

    // show user dropdown menu
    document.getElementById('userMenu').removeAttribute('hidden');
    // show placeholder content
    document.getElementById('contentCard').removeAttribute('hidden');
}

// handle sign in error
function signInError() {
    // sign out of Google account
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();

    // show Google button
    document.getElementById('googleButton').removeAttribute('hidden');
    // hide spinner
    document.getElementById('spinner').setAttribute('hidden', '');

    // inform user of error
    alert('Something went wrong! We were unable to sign you in. Please refresh the page and try again.');
}

// sign staff member out
async function signOut() {
    // prevent default click event
    event.preventDefault();

    // make call to API
    let response = await fetch('/signout',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    // if unable to destroy session
    if (response.status == 500) {
        // inform user of error
        alert('Something went wrong! We were unable to sign you out. Please refresh the page and try again.');

    } else {
        // sign out of Google account
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();

        // remove staff member's name from page
        document.getElementById('userName').innerHTML = '';

        // stop listening for sign out
        document.getElementById('signOut').removeEventListener('click', signOut);

        // hide user dropdown menu
        document.getElementById('userMenu').setAttribute('hidden', '');
        // hide placeholder content
        document.getElementById('contentCard').setAttribute('hidden', '');

        // show sign out card
        document.getElementById('signOutCard').removeAttribute('hidden');
    }
}

// when new staff link clicked
async function newStaff() {
    // prevent default event
    event.preventDefault();

    // sign out of Google account
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();

    // go to new staff page
    window.location = 'newstaff.html';
}

// on Google sign in
async function onSignIn(googleUser) {
    // hide Google button
    document.getElementById('googleButton').setAttribute('hidden', '');
    // show spinner
    document.getElementById('spinner').removeAttribute('hidden');

    // make call to API
    let sessionResponse = await fetch('/currentuser',
    {
        method: "GET",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    // if session not currently active
    if (sessionResponse.status == 403) {
        // get ID token
        const token = googleUser.getAuthResponse().id_token;

        // make call to API
        let response = await fetch('/staffsignin',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'token=' + token
        });

        // response body
        let body = await response.text();

        // if successfully signed in
        if (response.ok) {
            // hide & reset sign in card
            resetSignInCard();

            // parse JSON
            body = JSON.parse(body);

            // set staff member's name on page
            document.getElementById('userName').innerHTML = body['fname'] + ' ' + body['sname'];

            // display welcome message
            showWelcomeMessage();

        // if denied permission
        } else if (body == '0permission') {
            // sign out of Google account
            let auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut();

            // hide & reset sign in card
            resetSignInCard();

            // show permission card
            document.getElementById('permissionCard').removeAttribute('hidden');

        } else {
            // handle sign in error
            signInError();
        }

    } else {
        // extract session details
        const sessionDetails = JSON.parse(await sessionResponse.text());

        // if customer session
        if (sessionDetails.type == 'customer') {
            // handle sign in error
            signInError();

        } else {
            // make call to API
            let staffResponse = await fetch('/currentusername',
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            // if successfully fetched staff member's name
            if (staffResponse.status == 200) {
                // extract staff member's name
                const staffMemberDetails = JSON.parse(await staffResponse.text());

                // set customer's name on page
                document.getElementById('userName').innerHTML = staffMemberDetails[0]['fName'] + ' ' + staffMemberDetails[0]['lName'];

                // hide & reset sign in card
                resetSignInCard();

                // display welcome message
                showWelcomeMessage();

            } else {
                // handle sign in error
                signInError();
            }
        }
    }
}
