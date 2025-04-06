import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
//Instanciar
const app = express();

// Habilitar el enviar datos de tipo JSON (para recibir en las peticiones en el controller con req.body)
// La función app.use() en Express.js añade middleware al proceso de peticiones de la aplicación.
// Aplica el middleware especificado a todas las peticiones entrantes o a rutas específicas.
app.use(express.json());

// Buscar archivo .env
dotenv.config();
// Conectar a la DB Mongo
conectarDB();

// Habilitar CORS para que el frontend pueda comunicarse con el backend
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    // Comprobar si el origen está en la lista de dominios permitidos
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      // El origen del request esta permitido.
      // callback(): mensaje de error, acceso
      callback(null, true);
    } else {
      // Bloquear el origen
      callback(new Error("No permitido por CORS"));
    }
  },
};

// Ya creadas las opciones de CORS, se habilitan
app.use(cors(corsOptions));

// Seleccionar puerto (el 3000 es para el frontend)
const port = process.env.PORT || 4000;

// Rutas
// - Endpoint de veterinarios (modelos, controladores y routing)
app.use("/api/veterinarios", veterinarioRoutes);
// - Endpoint de pacientes (modelos, controladores y routing)
app.use("/api/pacientes", pacienteRoutes);

// Definiendo el template engine
app.set("view engine", "pug");

// Inicializando la app
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
