async function test() {
    let response = await fetch('/staffcommunitybooking',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'customerid=0&roomid=0&start=1579723476&end=1579783476&price=15&paid=10'
    });

    let body = await response.text();

    if (!response.ok) {
        throw new Error(body);
    }

    console.log(body);
}

test()
