async function onSignIn(googleUser) {
    const token = googleUser.getAuthResponse().id_token;

    let response = await fetch('/newstaffmember',
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

        alert('Something went wrong! Please try again.');

    } else {
        const body = JSON.parse(await response.text());

        alert(body);
    }
}
