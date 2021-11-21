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

router.post("/addItem", async (req, res) => {
  const { name, origin, description, intensity, price, presentation } =
    req.body;
  const data = {
    name,
    origin,
    description,
    intensity,
    price,
    presentation,
    image: `https://picsum.photos/id/${req.body.image}/250`,
  };
  await productsModel.addProduct(data);
  res.redirect("/listado");
});

router.get("/handleEdit/:id", async (req, res) => {
  const row = await productsModel.getProduct(req.params.id);
  const product = {
    id: row[0].id,
    name: row[0].name,
    origin: row[0].origin,
    description: row[0].description,
    intensity: row[0].intensity,
    price: row[0].price,
    presentation: row[0].presentation,
    image: row[0].image,
  };
  res.render("editItem", { product });
});
router.get("/deleteItem/:id", async (req, res) => {
  console.log(req.params.id);
  await productsModel.deleteItem(req.params.id);
  res.redirect("/listado");
});
module.exports = router;
