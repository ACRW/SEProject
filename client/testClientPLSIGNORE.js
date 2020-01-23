async function test() {
    let response = await fetch('/cancelbooking',
    {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: 'id=3'
    });

    let body = await response.text();

    if (!response.ok) {
        throw new Error(body);
    }

    console.log(body);
}

test()
