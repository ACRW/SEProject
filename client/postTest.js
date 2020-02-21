window.addEventListener('DOMContentLoaded', async function() {
    let response = await fetch('/staffcommunitybooking',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'customerid=2&roomid=2&start=1582207200&end=1582210800&price=10&paid=10'
    });

    const body = await response.text();

    console.log(body);
});
