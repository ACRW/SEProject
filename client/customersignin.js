// customer ID
let customerID;

// sign customer out
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

        // remove customer's name from page
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

// validate number phone
function validatePhoneInput() {
    // phone number field
    const input = document.getElementById('phoneInput');
    // continue button
    const continueButton = document.getElementById('phoneContinue');

    // if phone number valid
    if (input.validity.valid && input.value != '') {
        // enabled continue button
        continueButton.removeAttribute('disabled');

    } else {
        // disable continue button
        continueButton.setAttribute('disabled', '');
    }
}

// submit phone number
async function phoneInput() {
    // stop listening for phone number input
    document.getElementById('phoneInput').removeEventListener('input', validatePhoneInput);
    // stop listening for form submission
    document.getElementById('phoneContinue').removeEventListener('click', phoneInput);

    // hide continue button
    document.getElementById('phoneContinue').setAttribute('hidden', '');
    // show spinner
    document.getElementById('phoneSpinner').removeAttribute('hidden');

    // request body
    let body = 'customerid=' + customerID + '&phone=' + document.getElementById('phoneInput').value.replace(' ', '%20');

    // make call to API
    let response = await fetch('/newcustomer',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
    });

    // hide new customer card
    document.getElementById('newCustomerCard').setAttribute('hidden', '');

    // reset new customer card
    document.getElementById('phoneInput').value = '';
    document.getElementById('phoneContinue').setAttribute('disabled', '');
    document.getElementById('phoneContinue').removeAttribute('hidden');
    document.getElementById('phoneSpinner').setAttribute('hidden', '');

    // if unable to store phone number
    if (!response.ok) {
        // sign out of Google account
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();

        // show sign in card
        document.getElementById('signInCard').removeAttribute('hidden');

        // inform user of error
        alert('Something went wrong! We were unable to store your phone number. Please try again.');

    // if successfully stored phone number
    } else {
        // get customer's name
        const responseBody = JSON.parse(await response.text());

        // set customer's name on page
        document.getElementById('userName').innerHTML = responseBody['fname'] + ' ' + responseBody['sname'];

        // listen for sign out
        document.getElementById('signOut').addEventListener('click', signOut);

        // show user dropdown menu
        document.getElementById('userMenu').removeAttribute('hidden');
        // show placeholder content
        document.getElementById('contentCard').removeAttribute('hidden');
    }
}

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
        let response = await fetch('/customersignin',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: 'token=' + token
        });

        // if unable to sign customer in
        if (!response.ok) {
            // handle sign in error
            signInError();

        } else {
            // hide & reset sign in card
            resetSignInCard();

            // if existing customer
            if (response.status == 200) {
                // get customer's name
                const body = JSON.parse(await response.text());

                // set customer's name on page
                document.getElementById('userName').innerHTML = body['fname'] + ' ' + body['sname'];

                // display welcome message
                showWelcomeMessage();

            } else if (response.status == 201) {
                // set customer ID
                customerID = parseInt(JSON.parse(await response.text()));

                // listen for phone number input
                document.getElementById('phoneInput').addEventListener('input', validatePhoneInput);
                // listen for form submission
                document.getElementById('phoneContinue').addEventListener('click', phoneInput);

                // show new customer card
                document.getElementById('newCustomerCard').removeAttribute('hidden');
            }
        }

    } else {
        // extract session details
        const sessionDetails = JSON.parse(await sessionResponse.text());

        // make call to API
        let customerResponse = await fetch('/currentusername',
        {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        // if successfully fetched customer's name
        if (customerResponse.status == 200) {
            // extract customer's name
            const customerDetails = JSON.parse(await customerResponse.text());

            // set customer's name on page
            document.getElementById('userName').innerHTML = customerDetails[0]['fName'] + ' ' + customerDetails[0]['lName'];

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

// when page content loaded
window.addEventListener('DOMContentLoaded', function() {
    // when phone number invalid
    document.getElementById('phoneInput').oninvalid = function() {
        // prevent warning message
        event.preventDefault();
    }

    // when enter key pressed
    document.getElementById('phoneNumberForm').addEventListener('submit', function() {
        // prevent form submission
        event.preventDefault();
    });
});
