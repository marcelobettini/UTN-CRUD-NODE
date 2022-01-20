const express = require("express");
const router = express.Router();
const productsModel = require("../models/productsModel");

//importamos dependencias para manejar el envío de archivos
const util = require("util"); //con util "promisificaremos" el método de subida de archivos
const cloudinary = require("cloudinary").v2;
const uploader = util.promisify(cloudinary.uploader.upload); //incorporamos la funcionalidad asincrónica al método upload
const destroy = util.promisify(cloudinary.uploader.destroy); //incorporamos la funcionalidad asincrónica al método destroy

router.get("/", async (req, res) => {
  const data = await productsModel.getProducts();
  const products = data.map((row) => {
    const imageURL = cloudinary.url(row.image, {
      width: 100,
      height: 100,
      crop: "fill",
    });
    return { ...row, imageURL };
  });
  res.render("listado", { user: req.session.user, products });
});

router.get("/addItem", (req, res) => {
  res.render("addItem");
});

/* Ruta para agregar un producto nuevo, nótese que armamos el objeto con 
la técnica de destructuring en las líneas 16 y 17. En la ruta para modificar lo haremos
del modo tradicional para que pueda comparar*/
router.post("/addItem", async (req, res) => {
  let imageFile = req.files.imageFile;
  const img_id = (await uploader(imageFile.tempFilePath)).public_id;

  //VAMOS A REFACTORIZAR!!!
  // const { id, name, origin, description, intensity, price, presentation } =
  //   req.body;
  // const data = {
  //   id,
  //   name,
  //   origin,
  //   description,
  //   intensity,
  //   price,
  //   presentation,
  //   image: img_id,
  // };
  await productsModel.addProduct({ ...req.body, image: img_id }); //spread operator ... envía todo el contenido de req.body
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
  let newImg = null;
  if (req.files) {
    //traemos el registro porque necesitamos el campo image, que contiene el id a través del cual
    // identificamos las imágenes en Cloudinary
    row = await productsModel.getProduct(req.body.id);
    await destroy(row[0].image); // y utilizamos el método destroy
    newImg = (await uploader(req.files.imageFile.tempFilePath)).public_id;
  }
  const data = {
    id: req.body.id,
    name: req.body.name,
    origin: req.body.origin,
    description: req.body.origin,
    intensity: req.body.intensity || req.body.prevIntensity,
    price: req.body.price,
    presentation: req.body.presentation,
    image: newImg || req.body.prevImage,
  };
  await productsModel.modifyProduct(data, data.id);
  res.redirect("/listado");
});

/*Ruta para eliminar, recibe parámetro id*/
router.get("/deleteProduct/:id", async (req, res) => {
  //traemos el registro porque necesitamos el campo image, que contiene el id a través del cual
  // identificamos las imágenes en Cloudinary
  row = await productsModel.getProduct(req.params.id);
  await destroy(row[0].image); // y utilizamos el método destroy
  await productsModel.deleteProduct(req.params.id);
  res.redirect("/listado");
});
module.exports = router;
