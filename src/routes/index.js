// this file describes the different routes that the user can take
// it is used in app.js to set up the routes

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/viewPet", async (req, res) => {
  res.render("viewPet");
});

router.get("/register", async (req, res) => {
  res.render("register");
});

router.get("/dashboard", async (req, res) => {
  res.render("dashboard");
});

router.get("/adopt", async (req, res) => {
  res.render("adopt");
});

module.exports = router;
