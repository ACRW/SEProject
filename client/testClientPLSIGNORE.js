async function test() {
    let response = await fetch('/staffcommunitybooking',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'customerid=0'
    });

    let body = await response.text();

    if (!response.ok) {
        throw new Error(body);
    }

    console.log(body);
}

test()
