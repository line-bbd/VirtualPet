require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const express = require("express");
const Pet = require("./src/models/pet");
const Auth = require("./src/models/auth");
const Navigator = require("./src/controller/navigator");
const extAPI = require("./public/js/petfinderAPI");
const { Pages, validLogin, validRegistration } = require("./src/utils/utils");

const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000; // TODO: Remove this later

const auth = new Auth();
const navigator = new Navigator();
const petfinderAPI = new extAPI();

let petInSession = new Pet();
let userIDInSession;
let timeIntevalInMinutes = 1;

const connectionConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: true,
};

const getUsers = async () => {
  const usersQuery = "SELECT * FROM users;";
  return await executeQuery(usersQuery);
};

const addUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const addUserQuery = `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}');`;
  await executeQuery(addUserQuery);
};

const getLastSeen = async () => {
  const getUserQuery = `SELECT last_seen FROM users WHERE user_id = ${auth.userID};`;
  return await executeQuery(getUserQuery);
};

const updateLastSeen = async () => {
  const updateUserQuery = `UPDATE users set last_seen = now() where user_id = ${userIDInSession};`;
  await executeQuery(updateUserQuery);
};

const deletePet = async (pet_id) => {
  const deletePetQuery = `DELETE FROM Pets WHERE pet_id = ${pet_id};`;
  await executeQuery(deletePetQuery);
};

const getPetList = async (user_id) => {
  const petListQuery = `SELECT * FROM Pets WHERE user_id = ${user_id};`;
  return await executeQuery(petListQuery);
};

const selectPet = async (pet_id) => {
  const selectPetQuery = `SELECT * FROM Pets WHERE pet_id = ${pet_id};`;
  const data = JSON.parse(
    JSON.stringify((await executeQuery(selectPetQuery))[0])
  );
  console.log(data);
  petInSession.setPetName(data.name);
  petInSession.setPetType(data.type);
};

const getPetStats = async (pet_id) => {
  const petQuery = `SELECT * FROM Pet_stats WHERE pet_id = ${pet_id};`;
  const data = JSON.parse(JSON.stringify((await executeQuery(petQuery))[0]));
  return data;
};

const getPetInfo = async (pet_id) => {
  const petQuery = `SELECT * FROM pets WHERE pet_id = ${pet_id};`;
  const data = JSON.parse(JSON.stringify((await executeQuery(petQuery))[0]));
  return data;
};

const persistPetStats = async () => {
  const petQuery = `UPDATE pet_stats SET health = ${petInSession.health},
  happiness = ${petInSession.happiness},
  energy = ${petInSession.energy},
  fed = ${petInSession.fed},
  hygiene = ${petInSession.hygiene}
  WHERE pet_id = ${petInSession.pet_id};`;
  executeQuery(petQuery);
};

const setPetStats = async (data) => {
  petInSession.setPetStats(data);

  console.log(petInSession);
};

const executeQuery = async (query) => {
  const pool = new Pool(connectionConfig);
  let client, release;

  try {
    client = await pool.connect();
    const result = await client.query(query);
    const data = result.rows;
    return data;
  } catch (err) {
    console.error("Error retrieving data:", err);
    throw err;
  } finally {
    if (client) {
      release = client.release();
    }
    if (release) {
      release;
    }
  }
};

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
    const username = req.body.username;
    const password = req.body.password;

    const users = await getUsers();

    const login = validLogin(username, password, users);
    console.log(login);

    if (login.valid) {
      const id = users.find((user) => user.username === username).user_id;
      auth.login(username, id);
      navigator.setAuth(auth);
    }
    res.json(login);
  } catch (err) {
    console.log("Error logging in:", err);
    res.status(500).send("Internal Server Error");
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

    const users = await getUsers();

    const registration = validRegistration(
      username,
      password,
      confirmPassword,
      users
    );
    if (registration.valid) {
      await addUser(username, password);
    }
    res.json(registration);
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

app.get(Pages.DASHBOARD.url + "/petList", async (req, res) => {
  const petList = await getPetList(auth.userID);
  console.log(petList);
  res.json(petList);
});

app.get(Pages.ADOPT.url, (req, res) => {
  navigator.navigate(res, "ADOPT");
  if (navigator.destination === Pages.LOGIN) {
    res.redirect(navigator.destination.url);
  } else {
    res.sendFile(__dirname + navigator.destination.dir);
  }
});

app.get(Pages.VIEWPET.url, async (req, res) => {
  navigator.navigate(res, "VIEWPET");
  if (navigator.destination === Pages.LOGIN) {
    res.redirect(navigator.destination.url);
  } else {
    res.sendFile(__dirname + navigator.destination.dir);
  }
});

app.post(Pages.VIEWPET.url + "/setPetID/:pet_id", async (req, res) => {
  petInSession.pet_id = req.params.pet_id;
  userIDInSession = auth.userID;
});

app.post(Pages.VIEWPET.url + "/feed", (req, res) => {
  petInSession.feed();
  console.log(petInSession);
  res.json(petInSession);
});

app.post(Pages.VIEWPET.url + "/attention", (req, res) => {
  petInSession.giveAttention();
  console.log(petInSession);
  res.json(petInSession);
});

app.post(Pages.VIEWPET.url + "/medicine", (req, res) => {
  petInSession.giveMedicine();
  console.log(petInSession);
  res.json(petInSession);
});

app.post(Pages.VIEWPET.url + "/bath", (req, res) => {
  petInSession.giveBath();
  console.log(petInSession);
  res.json(petInSession);
});

app.get("/logout", (req, res) => {
  auth.logout();
  navigator.setAuth(auth);
  res.redirect(Pages.LOGIN.url);
});

app.get(Pages.VIEWPET.url + "/getPetStats", async (req, res) => {
  const petInfo = await getPetInfo(petInSession.pet_id);
  petInSession.name = petInfo.name;

  let currTime = new Date();
  let lastSeen = await getLastSeen();
  let lastSeenTime = new Date(lastSeen[0].last_seen);
  let timeDiffMinutes = (currTime.getTime() - lastSeenTime.getTime()) / 60000;

  let timeIntervalsPassed = Math.floor(timeDiffMinutes / timeIntevalInMinutes);

  const petStats = await getPetStats(petInSession.pet_id);
  petInSession.health = petStats.health;
  petInSession.happiness = petStats.happiness;
  petInSession.fed = petStats.fed;
  petInSession.hygiene = petStats.hygiene;
  petInSession.energy = petStats.energy;

  for (let index = 0; index < timeIntervalsPassed; index++) {
    petInSession.updatePetStatsRandomly();
  }

  console.log(petInSession);

  res.json(petInSession);
});

app.get(Pages.VIEWPET.url + "/updatePetStatsRandomly", async (req, res) => {
  petInSession.updatePetStatsRandomly();
  res.json(petInSession);
});

app.post(Pages.VIEWPET.url + "/endSession", async (req, res) => {
  console.log("Saving session");
  persistPetStats();
  updateLastSeen();
});

app.post("/addPet", async (req, res) => {
  const externalID = req.body.externalID;
  const userID = auth.userID;
  const name = req.body.name;
  const dateCreated = req.body.dateCreated;
  const type = req.body.type;

  const insertStatement = `INSERT INTO pets (pet_external_id, user_id, name, date_created, type) VALUES (${externalID}, ${userID}, '${name}', '${dateCreated}', '${type}')`;
  await executeQuery(insertStatement);
});

app.get("/getDog/:seenExtPetId", async (req, res) => {
  let results = await petfinderAPI.getDog(req.params.seenExtPetId, 1,);
  res.json(results);
});

app.get("/getPet/:petID", async (req, res) => {
  const petID = req.params.petID;

  const data = JSON.parse(
    JSON.stringify(
      await executeQuery(`SELECT * FROM Pets WHERE pet_id = ${petID}`)
    )
  );
  res.json(data);
});

app.get("/getUserPets/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = JSON.parse(
    JSON.stringify(
      await executeQuery(`SELECT * FROM Pets WHERE user_id= ${userId}`)
    )
  );
  res.json(data);
});

app.get("/getExternalIDs", async (req, res) => {
  const selectStatement = "SELECT pet_external_id From pets";
  const data = JSON.parse(JSON.stringify(await executeQuery(selectStatement)));
  res.json(data);
});
// api query to 'select' one of the existing user's pets
app.post("/selectPet/:pet_id", async (req, res) => {
  const pet_id = req.params.pet_id;
  selectPet(pet_id);
  const petStats = await getPetStats(pet_id);
  await setPetStats(petStats);
});

app.get("/getDog/:seenExtPetId", async (req, res) => {
  let results = await petfinderAPI.getDog(req.params.seenExtPetId, 1);
  res.json(results);
});

// redirect user to base url if they try to access a route that doesn't exist
app.get("*", (req, res) => {
  res.redirect(Pages.LOGIN.url);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
