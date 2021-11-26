var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config(); // cargamos los datos de variables de ambiente
//requerimos express-session para utilizar variables de sesión, las que serán necesarias
//a la hora de chequear si un usuario está autorizado para acceder a la base de datos
const session = require("express-session");
const productsModel = require("./models/productsModel");

////enlazamos el enrutador a los archivos login y listado js
const loginRouter = require("./routes/login");
const listadoRouter = require("./routes/listado");
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//// configuramos express-session copiando la sintaxis de la documentación
app.use(
  session({
    secret: "#0p3n_s3s4m3@1234567890",
    resave: false,
    saveUninitialized: true,
  })
);
//creamos el middleware para verificar los intentos de igreso a la ruta "listado",
//Aunque tratemos de entrar directamente, siempre se correrá antes el middleware
//y solo podremos acceder si req.session.user (que se setea con un valor en caso de login positivo)
//luego, si salimos de "listado", podremos volver si escribimos la ruta, siempre que la sesión
//continúe activa
secured = async (req, res, next) => {
  if (req.session.user) {
    next();
    // const products = await productsModel.getProducts();
    // res.render("listado", { user: req.session.user, products });
  } else {
    res.redirect("/");
  }
};

///// creamos la ruta para el login
app.use("/", loginRouter);
//// aplicamos un middleware a la ruta listadoRouter, y la protegemos
app.use("/listado", secured, listadoRouter);

// catch 404 and forward to error handler
app.use("*", (req, res) => {
  res.send("Not Found 4😮4");
});

module.exports = app;
