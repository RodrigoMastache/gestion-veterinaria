import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
// import * as veterinarioController from "../controllers/veterinarioController.js";
import {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
} from "../controllers/veterinarioController.js";

const router = express.Router();

// ************************
// ** Rutas para el área pública (no se requiere cuenta) **
// ************************
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/login", autenticar);
// Rutas para recuperar password
// - Para validar el email del usuario.
router.post("/olvide-password", olvidePassword);
// - Enviar al usuario un token y se leera desde la url
// router.get("/olvide-password/:token", comprobarToken);
// - El usuario define el nuevo password y se almacena
// router.post("/olvide-password/:token", nuevoPassword);

// - Simplificando las dos urls anteriores, ya que son la misma solo el verbo diferente: (usando chaining)
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

// ************************
// ** Rutas protegidas (cuando esta autenticado) **
// ************************
// - Cuando se visita "perfil", va a ir a la función "checkAuth"
// - Ejecuta el código del middleware "checkAuth"
// - Como tiene next(), se va al siguiente, que es: "perfil"
// Si pasa el middleware "checkAuth" pasa al siguiente "Perfil"
router.get("/perfil", checkAuth, perfil);

export default router;
