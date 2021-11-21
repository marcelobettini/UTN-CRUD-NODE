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

/* Ruta para agregar un producto nuevo, nótese que armamos el objeto con 
la técnica de destructuring en las líneas 16 y 17. En la ruta para modificar lo haremos
del modo tradicional para que pueda comparar*/
router.post("/addItem", async (req, res) => {
  const { id, name, origin, description, intensity, price, presentation } =
    req.body;
  const data = {
    id,
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

/*Esta ruta muestra el producto para editarlo o borrarlo, así nos ahorramos
la necesidad de hacer dos rutas y dos vistas distintas */
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

/* Aquí modificamos un registro existente. construimos el objeto de la forma tradicional, sin 
desestructurar. Es decir, los datos que se reciben por req.body se van asignando uno a uno
a las propiedades correspondientes del objeto data */
router.post("/editProduct", async (req, res) => {
  const data = {
    id: req.body.id,
    name: req.body.name,
    origin: req.body.origin,
    description: req.body.origin,
    intensity: req.body.intensity,
    price: req.body.price,
    presentation: req.body.presentation,
    image: `https://picsum.photos/id/${req.body.image}/250`,
  };
  await productsModel.modifyProduct(data, data.id);
  res.redirect("/listado");
});

/*Ruta para eliminar, recibe parámetro id*/
router.get("/deleteProduct/:id", async (req, res) => {
  console.log(req.params.id);
  await productsModel.deleteProduct(req.params.id);
  res.redirect("/listado");
});
module.exports = router;
