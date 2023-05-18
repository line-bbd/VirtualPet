const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const Pet = require("./src/models/pet");
const Auth = require("./src/models/auth");
const Navigator = require("./src/controller/navigator");
const { Pages, validLogin, validRegistration } = require("./src/utils/utils");

const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'testUser',
  password: 'Password@123',
  database: 'VirtualPetDB'
})

const app = express();
const port = 3000;
const auth = new Auth();
const navigator = new Navigator();

// TODO: just temporary. Implement to use selected pet later.
const pet = new Pet("Fluffy");

// TODO: add db connection

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
  navigator.navigate(res, "LOGIN");
  res.sendFile(__dirname + navigator.destination.dir);
});

app.post(Pages.LOGIN.url, async (req, res) => {
  try {
    const username = await req.body.username;
    const password = await req.body.password;

    const login = validLogin(username, password, users);

    if (login.valid) {
      auth.login(username);
      navigator.setAuth(auth);
      navigator.navigate(res, "DASHBOARD");
      res.redirect(navigator.destination.url);
    } else {
      // response containing error message
      res.json(login);
      console.log(login.message);
    }
  } catch {
    console.log("Error logging in!");
  }
});

app.get(Pages.REGISTER.url, (req, res) => {
  navigator.navigate(res, "REGISTER");
  res.sendFile(__dirname + navigator.destination.dir);
});

app.post(Pages.REGISTER.url, async (req, res) => {
  try {
    const username = await req.body.username;
    const password = await req.body.password;
    const confirmPassword = await req.body.verify;

    const registration = validRegistration(
      username,
      password,
      confirmPassword,
      users
    );

    if (registration.valid) {
      // TODO: store this in db later
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("adding user");
      res.redirect(Pages.LOGIN.url);
    } else {
      // response containing error message
      res.json(registration);
      console.log(registration.message);
    }
  } catch {
    console.log("Error registering!");
    res.redirect(Pages.REGISTER.url);
  }
});

app.get(Pages.DASHBOARD.url, (req, res) => {
  console.log("DASHBOARD");
  console.log(auth);
  navigator.navigate(res, "DASHBOARD");

  if (navigator.destination === Pages.LOGIN) {
    res.redirect(navigator.destination.url);
  } else {
    res.sendFile(__dirname + navigator.destination.dir);
  }
});

app.get(Pages.ADOPT.url, (req, res) => {
  console.log("ADOPT");
  console.log(auth);
  navigator.navigate(res, "ADOPT");
  if (navigator.destination === Pages.LOGIN) {
    res.redirect(navigator.destination.url);
  } else {
    res.sendFile(__dirname + navigator.destination.dir);
  }
});

app.get(Pages.VIEWPET.url, (req, res) => {
  console.log("PLAY");
  console.log(auth);

  navigator.navigate(res, "VIEWPET");
  if (navigator.destination === Pages.LOGIN) {
    res.redirect(navigator.destination.url);
  } else {
    res.sendFile(__dirname + navigator.destination.dir);
  }
});

app.post(Pages.VIEWPET.url, (req, res) => {
  // feed endpoint
  const { feed } = req.query;
  if (feed === "true") {
    pet.feed();
    console.log(pet);
  }
});


app.post(Pages.VIEWPET.url + "/attention", (req, res) => {
  pet.giveAttention();
  console.log(pet);
  res.json(pet);
});

app.post(Pages.VIEWPET.url + "/medicine", (req, res) => {
  pet.giveMedicine();
  console.log(pet);
  res.json(pet);
});

app.post(Pages.VIEWPET.url + "/bath", (req, res) => {
  pet.giveBath();
  console.log(pet);
  res.json(pet);
});

app.post(Pages.VIEWPET.url + "/treat", (req, res) => {
  pet.giveTreat();
  console.log(pet);
  res.json(pet);
});

app.post(Pages.VIEWPET.url + "/toy", (req, res) => {
  pet.giveToy();
  console.log(pet);
  res.json(pet);
});

app.post(Pages.VIEWPET.url + "/sleep", (req, res) => {
  pet.sleep();
  console.log(pet);
  res.json(pet);
});

app.get("/logout", (req, res) => {
  auth.logout();
  navigator.setAuth(auth);
  res.redirect(Pages.LOGIN.url);
});

app.get("/getPetStats/:pet_id", (req, res) => {
  connection.connect();
  let query = 'SELECT * From Pet_stats WHERE pet_id =?';
  query = mysql.format(query,req.params.pet_id);
  console.log(query);

  connection.query(query, (err, rows, fields) => {
    if (err) throw err

    res.json(rows[0]);
    
  })

  connection.end();
  // res.json(pet);
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
