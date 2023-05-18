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
app.use("/animationModels", express.static(__dirname + "public/animationModels"));
app.use("/textures", express.static(__dirname + "public/textures"));
app.use("/fonts", express.static(__dirname + "public/fonts"));



// set views
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/views/index.html");
});

// set routes
const router = require("./src/routes/index");

app.use("/", router);

// handle different requests
app.get("/feed", (req, res) => {
  res.status(200).send(pet.feed());
  console.log("Feed");
  console.log(pet);
});

app.get("/play", (req, res) => {
  res.status(200).send(pet.play());
  console.log("Play");
  console.log(pet);
});

// redirect user to base url if they try to access a route that doesn't exist
app.get("*", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


