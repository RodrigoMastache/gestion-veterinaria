import express from "express";
import {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
} from "../controllers/pacienteController.js";
import checkAuth from "../middleware/authMiddleware.js";
// Instanciar el router de express
const router = express.Router();

// Definiendo las rutas:
// - Proteger endpoint con el middleware checkauth
// - Es decir: para poder agregar un paciente, es necesario tener una cuenta
// - y si tiene el usuario una cuenta, se va a guardar request.veterinario en la variable
// - interna de express, y en "agregarPaciente" la podemos volver a capturar
router
  .route("/")
  .post(checkAuth, agregarPaciente) // Requerimos tener al usuario autenticado
  .get(checkAuth, obtenerPacientes); // Requerimos tener al usuario autenticado

// Obtener un paciente en específico
// - le vamos a pasar en la url el id ":id" de cada paciente para encontrarlos
// - Cuando haya un "get" me va a traer al paciente
// - se agregar "checkAuth" porque ya todos esos requests son autenticados
// - se agrega un "put" para actualizar (tambien es un request autenticado)
// - se agrega un "delete" para borrar (también es un request autenticado)
router
  .route("/:id")
  .get(checkAuth, obtenerPaciente)
  .put(checkAuth, actualizarPaciente)
  .delete(checkAuth, eliminarPaciente);

export default router;
