const express = require("express");
const app = express();
const Pet = require("./src/models/pet");
const port = 3000;
const pet = new Pet("Fluffy");

// set up static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));

// set views
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/views/login.html");
});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/src/views/register.html");
});

app.get("/dashboard", (req, res) => {
  res.sendFile(__dirname + "/src/views/dashboard.html");
});

app.get("/adopt", (req, res) => {
  res.sendFile(__dirname + "/src/views/adopt.html");
});

app.get("/play", (req, res) => {
  res.sendFile(__dirname + "/src/views/play.html");
});

// redirect user to base url if they try to access a route that doesn't exist
app.get("*", (req, res) => {
  res.redirect("/");
});

// set routes
const router = require("./src/routes/index");

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
