async function onSignIn(googleUser) {
    document.getElementById('googleButton').setAttribute('hidden', '');
    document.getElementById('spinner').removeAttribute('hidden');

    const token = googleUser.getAuthResponse().id_token;

    let response = await fetch('/customersignin',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'token=' + token
    });

    if (!response.ok) {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();

        document.getElementById('googleButton').removeAttribute('hidden');
        document.getElementById('spinner').setAttribute('hidden', '');

        alert('Something went wrong! Please try again.');

    } else {
        if (response.status == 200) {
            const body = JSON.parse(await response.text());

            document.getElementById('userName').innerHTML = body['fname'] + ' ' + body['sname'];

            document.getElementById('userMenu').removeAttribute('hidden');
            document.getElementById('signInCard').setAttribute('hidden', '');

        } else if (response.status == 201) {

            document.getElementById('signInCardBody').setAttribute('hidden', '');
            document.getElementById('newCustomer').removeAttribute('hidden');
        }
    }
}

document.getElementById('signOut').addEventListener('click', function() {
    event.preventDefault();

    let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();

    document.getElementById('googleButton').removeAttribute('hidden');
    document.getElementById('spinner').setAttribute('hidden', '');

    document.getElementById('userMenu').setAttribute('hidden', '');
    document.getElementById('signInCard').removeAttribute('hidden');

    // need to destroy session
});
