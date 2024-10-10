import express from "express";
import { engine } from "express-handlebars";
import morgan from "morgan";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import categoriaRouter from "./routes/categorias.routes.js";
import platoRouter from "./routes/platos.routes.js";

//Inicializacion
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

//Configuracion
app.set("port", process.env.PORT || 4000);

//Configamiento carptea para vistas
app.set("views", join(__dirname, "views"));

//Configurar motor de platillas
app.engine(
  "hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);

app.set("view engine", ".hbs");

//Middlewars
app.use(morgan("dev"));
//Utilizar express para trabajar con formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Routes
/*app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});*/
//Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use(categoriaRouter);
app.use(platoRouter);

app.use(express.static(join(__dirname, "public")));

//Run server
app.listen(app.get("port"), () => {
  console.log("cargando en el puerto ", app.get("port"));
});
