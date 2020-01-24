async function onSignIn(googleUser) {
    const token = googleUser.getAuthResponse().id_token;

    let response = await fetch('/customersignin',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'token=' + token
    });

    const body = await response.text();

    if (!response.ok) {

        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();

        alert('failed to verify token integrity. pls try again.')

    } else {
        console.log(body);
    }
}
