//initialise client (for authentication)
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('250191709665-ms18vru39atn7pkfb64g9eqg1iliv2ni.apps.googleusercontent.com');

//
async function login(token) {
    try {
        //
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '250191709665-ms18vru39atn7pkfb64g9eqg1iliv2ni.apps.googleusercontent.com'
        });

        const payload = ticket.getPayload();

        return payload;

    } catch (error) {
        return false;
    }
}

module.exports = login;
