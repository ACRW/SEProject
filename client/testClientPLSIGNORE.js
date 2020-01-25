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

        alert('pls try again.')

    } else {
        if (response.status == 200) {
            console.log(body)
        } else if (response.status == 201) {
            console.log('more action')
        }
    }
}
