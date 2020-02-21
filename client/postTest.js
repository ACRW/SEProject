window.addEventListener('DOMContentLoaded', async function() {
    let response = await fetch('/customercommunitybooking',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'roomid=2&start=1582203600&end=1582223600&price=10&paid=10'
    });

    const body = await response.text();

    console.log(body);
});
