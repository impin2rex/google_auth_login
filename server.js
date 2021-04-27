const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// Google Auth
const { OAuth2Client } = require("google-auth-library");

const CLIENT_ID = 'YOUR_CLIENT_ID'; // Paste here your client Id
const client = new OAuth2Client(CLIENT_ID);

const checkAuthenticated = require("./middlewares/google-auth");

const PORT = 7000;

// Middleware

app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    res.cookie("session-token", token);
    res.send("success");
  } catch (err) {
    console.error(err);
  }
});

app.get("/profile", checkAuthenticated, (req, res) => {
  const user = req.user;
  res.render("profile", { user });
});

app.get("/protectedRoute", checkAuthenticated, (req, res) => {
  res.send("This route is protected");
});

app.get("/logout", (req, res) => {
  res.clearCookie("session-token");
  res.redirect("/login");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
