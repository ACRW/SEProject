async function test() {
    let response = await fetch('/staffhostelbooking',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'customerid=0&roomid=0&start=1579723476&end=1579783476'
    });

    let body = await response.text();

    if (!response.ok) {
        throw new Error(body);
    }

    console.log(body);
}

test()
