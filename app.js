const express = require("express");
const path = require("path");
const app = express();
const Pet = require("./src/models/pet");
const port = 3000;
const pet = new Pet("Fluffy");

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Set the MIME type for JavaScript files
app.use((req, res, next) => {
  if (req.path.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript");
  }
  next();
});

// set views
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/views/index.html");
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

  // feed endpoint
  const { feed } = req.query;
  if (feed === "true") {
    pet.feed();
    console.log(pet);
  }

  // give water endpoint
  const { water } = req.query;
  if (water === "true") {
    pet.giveWater();
    console.log(pet);
  }

  // give attention endpoint
  const { attention } = req.query;
  if (attention === "true") {
    pet.giveAttention();
    console.log(pet);
  }

  // give medicine endpoint
  const { medicine } = req.query;
  if (medicine === "true") {
    pet.giveMedicine();
    console.log(pet);
  }

  // give bath endpoint
  const { bath } = req.query;
  if (bath === "true") {
    pet.giveBath();
    console.log(pet);
  }

  // give treat endpoint
  const { treat } = req.query;
  if (treat === "true") {
    pet.giveTreat();
    console.log(pet);
  }

  // give toy endpoint
  const { toy } = req.query;
  if (toy === "true") {
    pet.giveToy();
    console.log(pet);
  }

  // put to bed endpoint
  const { sleep } = req.query;
  if (sleep === "true") {
    pet.sleep();
    console.log(pet);
  }
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
