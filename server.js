const express = require("express");
const path = require("path");
const Pet = require("./src/models/pet");
const Auth = require("./src/models/auth");
const Navigator = require("./src/controller/navigator");
const { Pages, validLogin, validRegistration } = require("./src/utils/utils");

const app = express();
const port = 3000;
const auth = new Auth();
const navigator = new Navigator();

// TODO: just temporary. Implement to use selected pet later.
const pet = new Pet("Fluffy");

// TODO: get this from db later
const users = [
  {
    username: "test",
    password: "test",
  },
  {
    username: "user1",
    password: "$2b$10$xxIQtfWunC4JoF/tqebCaOnWO4Xlur.pH4NSQhHKvKt2GuGVd.gZC",
  },
];

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// setup access to req var
app.use(express.urlencoded({ extended: false }));

// Set the MIME type for JavaScript files
app.use((req, res, next) => {
  if (req.path.endsWith(".js")) {
    res.setHeader("Content-Type", "application/javascript");
  }
  next();
});

// set views
app.get(Pages.LOGIN.url, (req, res) => {
  if (auth.isAuthenticated()) {
    logout();
  }
  navigator.navigate(res, "LOGIN");
  res.sendFile(__dirname + navigator.destination.dir);
});

app.post(Pages.LOGIN.url, async (req, res) => {
  try {
    const username = await req.body.username;
    const password = await req.body.password;

    if (validLogin(username, password, users).valid) {
      auth.login(username);
      navigator.setAuth(auth);
    }

    navigator.navigate(res, "DASHBOARD");
    res.redirect(navigator.destination.url);
  } catch {
    console.log("Error logging in!");
  }
});

app.get(Pages.REGISTER.url, (req, res) => {
  if (auth.isAuthenticated()) {
    logout();
  }
  navigator.navigate(res, "REGISTER");
  res.sendFile(__dirname + navigator.destination.dir);
});

app.post(Pages.REGISTER.url, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // TODO: store this in db later
    users.push({
      username: req.body.username,
      password: hashedPassword,
    });
    res.redirect(Pages.LOGIN.url);
  } catch {
    res.redirect(Pages.REGISTER.url);
  }
});

app.get(Pages.DASHBOARD.url, (req, res) => {
  navigator.navigate(res, "DASHBOARD");
  res.sendFile(__dirname + navigator.destination.dir);
});

app.get(Pages.ADOPT.url, (req, res) => {
  navigator.navigate(res, "ADOPT");
  res.sendFile(__dirname + navigator.destination.dir);
});

app.get(Pages.PLAY.url, (req, res) => {
  navigator.navigate(res, "PLAY");
  res.sendFile(__dirname + navigator.destination.dir);

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

app.get("/logout", () => {
  logout();
});

// redirect user to base url if they try to access a route that doesn't exist
app.get("*", (req, res) => {
  res.redirect(Pages.LOGIN.url);
});

// set routes
const router = require("./src/routes/index");

app.use(Pages.LOGIN.url, router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const logout = () => {
  auth.logout();
  navigator.setAuth(auth);
};
