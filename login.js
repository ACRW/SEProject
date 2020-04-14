// initialise client (for authentication)
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('250191709665-ms18vru39atn7pkfb64g9eqg1iliv2ni.apps.googleusercontent.com');

// sign user in
async function login(token) {
    try {
        // verify ID token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: '250191709665-ms18vru39atn7pkfb64g9eqg1iliv2ni.apps.googleusercontent.com'
        });

        // get payload of user's details
        const payload = ticket.getPayload();
        return payload;

    // if unable to verify token
    } catch (error) {
        // return false
        return false;
    }
}

module.exports = login;
