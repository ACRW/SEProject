// on Google sign in
async function onSignIn(googleUser) {
    // show spinner
    document.getElementById('spinner').removeAttribute('hidden');
    // hide Google button
    document.getElementById('googleButton').setAttribute('hidden', '');

    // get ID token
    const token = googleUser.getAuthResponse().id_token;

    // make call to API
    let newStaffResponse = await fetch('/newstaffmember',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'token=' + token
    });

    // make call to API
    let signOutResponse = await fetch('/signout',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    // hide new staff card
    document.getElementById('newStaffCard').setAttribute('hidden', '');

    // sign out of Google account
    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();

    // if something went wrong
    if (!newStaffResponse.ok || !signOutResponse.ok) {
        // show failure card
        document.getElementById('failureCard').removeAttribute('hidden');

    } else {
        // get new staff member's name
        const body = JSON.parse(await newStaffResponse.text());

        // set name on page
        document.getElementById('newName').innerHTML = body['fname'] + ' ' + body['sname'] + ' has been registered as a staff member, and is now able to sign in.';

        // show success card
        document.getElementById('successCard').removeAttribute('hidden');
    }
}
