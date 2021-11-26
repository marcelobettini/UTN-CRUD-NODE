const express = require("express");
const router = express.Router();
const usersModel = require("../models/usersModel");

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.render("login");
});

router.post("/", async (req, res, next) => {
  try {
    const user = req.body.user;
    const pass = req.body.pass;
    const data = await usersModel.getUserByUserAndPass(user, pass);

    if (data != undefined) {
      req.session.user = user;
      res.redirect("/listado");
    } else {
      res.render("login", { error: true });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
