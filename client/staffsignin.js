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

// on Google sign in
async function onSignIn(googleUser) {
    // hide Google button
    document.getElementById('googleButton').setAttribute('hidden', '');
    // show spinner
    document.getElementById('spinner').removeAttribute('hidden');

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

    // reset sign in card
    document.getElementById('googleButton').removeAttribute('hidden');
    document.getElementById('spinner').setAttribute('hidden', '');

    // if successfully signed in
    if (response.ok) {
        // hide sign in card
        document.getElementById('signInCard').setAttribute('hidden', '');

        // parse JSON
        body = JSON.parse(body);

        // set staff member's name on page
        document.getElementById('userName').innerHTML = body['fname'] + ' ' + body['sname'];

        // listen for sign out
        document.getElementById('signOut').addEventListener('click', signOut);

        // show user dropdown menu
        document.getElementById('userMenu').removeAttribute('hidden');
        // show placeholder content
        document.getElementById('contentCard').removeAttribute('hidden');

    } else {
        // sign out of Google account
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();

        // if denied permission
        if (body == '0permission') {
            // hide sign in card
            document.getElementById('signInCard').setAttribute('hidden', '');

            // show permission card
            document.getElementById('permissionCard').removeAttribute('hidden');

        } else {
            // inform user of error
            alert('Something went wrong! We were unable to sign you in. Please refresh the page and try again.');
        }
    }
}
