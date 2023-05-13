const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/viewPet", (req, res) => {
  res.render("animation");
});



module.exports = router;
