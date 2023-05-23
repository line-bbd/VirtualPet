require("dotenv").config();
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const express = require("express");
const Pet = require("./src/models/pet");
const Auth = require("./src/models/auth");
const Navigator = require("./src/controller/navigator");
const extAPI = require('./public/js/petfinderAPI');
const { Pages, validLogin, validRegistration } = require("./src/utils/utils");
const { get } = require("http");

const app = express();
app.use(express.json());
const port = 3000; // TODO: Remove this later
const auth = new Auth();
const navigator = new Navigator();
const petfinderAPI = new extAPI();

//TODO: the logic is as follows:
//When the user enters the play page the pet is initialized
//All the interactions are done on this pet model(feed,walk etc)
//The changes are then persisted when they logout, exit etc

const connectionConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: true,
};

const pet = new Pet();

// section for db query methods
const getUsers = async () => {
  const usersQuery = "SELECT * FROM users;";
  return await executeQuery(usersQuery);
};

const addUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const addUserQuery = `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}');`;
  await executeQuery(addUserQuery);
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
  pet.setPetName(data.name);
  pet.setPetType(data.type);
};

const getPetStats = async (pet_id) => {
  const petQuery = `SELECT * FROM Pet_stats WHERE pet_id = ${pet_id};`;
  const data = JSON.parse(JSON.stringify((await executeQuery(petQuery))[0]));
  return data;
};

// section ends here

const setPetStats = async (data) => {
  pet.setPetStats(
    data.health,
    data.happiness,
    data.fed,
    data.hygiene,
    data.energy
  );

  console.log(pet);
};

const executeQuery = async (query) => {
  const pool = new Pool(connectionConfig);
  let client, release;

  try {
    client = await pool.connect();
    const result = await client.query(query);
    const data = result.rows;
    console.log("d", data.type);
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

const updatePetStats = async (pet) => {
  await executeQuery(
    `UPDATE pet_stats SET health = ${pet.health}, happiness = ${pet.happiness}, energy = ${pet.energy}, fed = ${pet.fed}, hygiene = ${pet.hygiene} WHERE pet_id = ${pet.id}`
  );
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

    if (login.valid) {
      const id = users.find((user) => user.username === username).user_id;
      auth.login(username, id);
      navigator.setAuth(auth);
      navigator.navigate(res, "DASHBOARD");
      res.redirect(navigator.destination.url);
    } else {
      // response containing error message
      res.json(login);
      console.log(login.message);
    }
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

app.get(Pages.DASHBOARD.url + "/petList", async (req, res) => {
  const petList = await getPetList(auth.userID);
  console.log(petList);
  res.json(petList);
});

app.get(Pages.ADOPT.url, (req, res) => {
  console.log("ADOPT",pet);
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

// app.post(Pages.VIEWPET.url, (req, res) => {
//   // feed endpoint
//   const { feed } = req.query;
//   if (feed === "true") {
//     pet.feed();
//     console.log(pet);
//   }
// });

app.post(Pages.VIEWPET.url + "/feed", (req, res) => {
  petInSession.feed();
  console.log(petInSession);
  res.json(petInSession);
  // connection.connect();
  // let query = 'Update pet_stats set hunger = ?, bordem = ?, health = ?, thirst = ?, hygiene = ? where pet_id = ?';
  // query = mysql.format(query,req.params.pet_id);

  // connection.query(query, (err, rows, fields) => {
  //   if (err) throw err
  //   petInSession.feed();

  //   res.json(rows[0]);
    
  // })

  // pet.feed();
  // console.log(pet);
  // res.json(pet);
});

app.post(Pages.VIEWPET.url + "/attention", (req, res) => {
  petInSession.giveAttention();
  updatePetStats(petInSession)
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

// app.post(Pages.VIEWPET.url + "/treat", (req, res) => {
//   pet.giveTreat();
//   console.log(pet);
//   res.json(pet);
// });

// app.post(Pages.VIEWPET.url + "/toy", (req, res) => {
//   pet.giveToy();
//   console.log(pet);
//   res.json(pet);
// });

// app.post(Pages.VIEWPET.url + "/sleep", (req, res) => {
//   pet.sleep();
//   console.log(pet);
//   res.json(pet);
// });

app.get("/logout", (req, res) => {
  auth.logout();
  navigator.setAuth(auth);
  res.redirect(Pages.LOGIN.url);
});

//PET DB QUERIES: Waiting for hosted database
app.post("/addPet", async (req, res) => {
  const petID = req.body.petID;
  const externalID = req.body.externalID;
  const userID = req.body.id;
  const name = req.body.name;
  const dateCreated = req.body.dateCreated;
  const type = req.body.type;
  await executeQuery(
    `INSERT INTO pets (pet_id, pet_external_id, user_id, name, date_created, type) VALUES (${petID}, ${externalID}, ${userID}, '${name}', '${dateCreated}', '${type}')`
  );
});

app.get("/getDog/:seenExtPetId", async (req, res) => {
  let results = await petfinderAPI.getDog(req.params.seenExtPetId,1);
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

app.get("/getPetStats/:pet_id", async (req, res) => {
  const pet_id = req.params.pet_id;
  getPetStats(pet_id);
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

// app.put("/updatePetStats", async (req, res) => {
//   const petID = req.body.petID;
//   const health = req.body.health;
//   const happiness = req.body.happiness;
//   const energy = req.body.happiness;
//   const fed = req.body.fed;
//   const hygiene = req.body.hygiene;

//   await executeQuery(
//     `UPDATE pet_stats SET health = ${health}, happiness = ${happiness}, energy = ${energy}, fed = ${fed}, hygiene = ${hygiene} WHERE pet_id = ${petID}`
//   );
// });


app.get("/getDog/:seenExtPetId", async (req, res) => {
  let results = await petfinderAPI.getDog(req.params.seenExtPetId,1);

  res.json(results);

});
// redirect user to base url if they try to access a route that doesn't exist
app.get("*", (req, res) => {
  res.redirect(Pages.LOGIN.url);
});

// set routes
// const router = require("./src/routes/index");

// app.use(Pages.LOGIN.url, router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
