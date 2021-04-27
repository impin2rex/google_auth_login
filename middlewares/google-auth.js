// Google Auth
const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID =
  "491454092755-45or6sdmbrbh42q8cqlh7oaihd9julae.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

async function checkAuthenticated(req, res, next) {
  try {
    const token = req.cookies["session-token"];

    let user = {};
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    user.name = payload.name;
    user.email = payload.email;
    user.picture = payload.picture;
    req.user = user;
    next();
  } catch (err) {
    res.redirect("/login");
  }
}

module.exports = checkAuthenticated;
