let customerID;

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
            document.getElementById('contentCard').removeAttribute('hidden');
            document.getElementById('signInCard').setAttribute('hidden', '');

            document.getElementById('googleButton').removeAttribute('hidden');
            document.getElementById('spinner').setAttribute('hidden', '');

        } else if (response.status == 201) {
            customerID = parseInt(JSON.parse(await response.text()));

            document.getElementById('signInCard').setAttribute('hidden', '');

            document.getElementById('googleButton').removeAttribute('hidden');
            document.getElementById('spinner').setAttribute('hidden', '');

            document.getElementById('newCustomerCard').removeAttribute('hidden');
        }
    }
}

window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('signOut').addEventListener('click', async function() {
        event.preventDefault();

        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut();

        document.getElementById('userMenu').setAttribute('hidden', '');
        document.getElementById('contentCard').setAttribute('hidden', '');
        document.getElementById('signOutCard').removeAttribute('hidden');

        let response = await fetch('/signout',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const responseBody = await response.text();

        console.log(responseBody);

        // need to destroy session
    });

    document.getElementById('phoneNumberForm').addEventListener('submit', async function() {
        event.preventDefault();

        let body = 'customerid=' + customerID + '&phone=' + document.getElementById('phoneInput').value;

        let response = await fetch('/newcustomer',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: body
        });

        if (!response.ok) {
            let auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut();

            document.getElementById('newCustomerCard').setAttribute('hidden', '');
            document.getElementById('signInCard').removeAttribute('hidden');

            document.getElementById('phoneInput').value = '';
            document.getElementById('phoneContinue').setAttribute('disabled', '');

            alert('Something went wrong! Please try again.');

        } else {
            const responseBody = JSON.parse(await response.text());

            document.getElementById('userName').innerHTML = responseBody['fname'] + ' ' + responseBody['sname'];

            document.getElementById('userMenu').removeAttribute('hidden');
            document.getElementById('contentCard').removeAttribute('hidden');
            document.getElementById('newCustomerCard').setAttribute('hidden', '');
        }
    });

    document.getElementById('phoneInput').addEventListener('input', function() {
        const phone = document.getElementById('phoneInput').value;

        if (!isNaN(Number(phone)) && phone.trim().length > 0) {
            document.getElementById('phoneContinue').removeAttribute('disabled');
        } else {
            document.getElementById('phoneContinue').setAttribute('disabled', '');
        }
    });
});
