const express = require("express");
const router = express.Router();
const productsModel = require("../models/productsModel");
router.get("/", async (req, res) => {
  const products = await productsModel.getProducts();
  res.render("listado", { user: req.session.user, products });
});

router.get("/addItem", (req, res) => {
  res.render("addItem");
});
module.exports = router;
