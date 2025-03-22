import mongoose from "mongoose";
// Importando modelos
import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
  // Como primero se autentica el usuario, entonces req.veterinario ya tiene todos los datos
  // console.log(req.veterinario);

  // - Obtener solo el id del veterinario
  // console.log(req.veterinario._id);

  // Crear una nueva instancia con los datos y la estructura del modelo.
  // - Se le pasa req.body para que genere ese objeto con la información
  // - El modelo del paciente requere al veterinario
  // - ¿como identificar que veterinario lo esta agregando?
  const paciente = new Paciente(req.body);
  paciente.veterinario = req.veterinario._id;

  // Guardar en la base de datos
  try {
    // - Guardando
    const pacienteAlmacenado = await paciente.save();
    res.json(pacienteAlmacenado);
  } catch (error) {
    console.log(error);
  }
};
const obtenerPacientes = async (req, res) => {
  // - Filtrar los pacientes que esten asociados al veterinario que tiene la sesión activa.
  const pacientes = await Paciente.find()
    .where("veterinario")
    .equals(req.veterinario); // Utilizando la variable de sesion del servidor de express
  res.json(pacientes);
};

// CRUD de los pacientes:
// - se usa async porque se consultara la base de datos
// - obtener paciente en específico:
// -- le vamos a pasar en la url el id de cada paciente para encontrarlos
const obtenerPaciente = async (req, res) => {
  // - Obteniendo el id de la url
  const { id } = req.params;
  // - Consultar
  const paciente = await Paciente.findById(id);

  if (!paciente) {
    return res.status(404).json({ msg: "No Encontrado" });
  }

  // Revisar si ese paciente fue agregado por el veterinario que esta autenticado (solo el puede verlo)
  // ¿El id del paciente-veterinario es diferente del que esta autenticado (req.veterinario._id?
  // -- es necesario usar .toString() ya que aunque son iguales, son de tipo ObjectId, por lo que son evaluados
  // de forma diferente cada vez, al usar .toString() entonces ya solo se obtiene el valor.
  // Esto siempre aplica al comprar los ids de mongoDB
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    // Esta intentando acceder a información que el no creó.
    // Es decir: el que esta autenticado y el que creo ese registro, son diferentes.
    return res.json({ msg: "Accion no válida" });
  }

  res.json(paciente);
};

// Actualizar info de un paciente
const actualizarPaciente = async (req, res) => {
  // - Obteniendo el id de la url
  const { id } = req.params;
  // - Consultar en la base de datos
  const paciente = await Paciente.findById(id);

  if (!paciente) {
    // No encontró al paciente.
    res.status(404).json({ msg: "No encontrado" });
  }

  // - Validando que la persona que va a editar es quien lo creo.
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Accion no válida" });
  }

  // Actualizar paciente
  // - en caso de que los campos no esten en la petición de actualización (form)
  // - asignales los que venian (paciente.[propiedad])
  paciente.nombre = req.body.nombre || paciente.nombre;
  paciente.propietario = req.body.propietario || paciente.propietario;
  paciente.email = req.body.email || paciente.email;
  paciente.fecha = req.body.fecha || paciente.fecha;
  paciente.sintomas = req.body.sintomas || paciente.sintomas;

  try {
    // - guardando en base
    const pacienteActualizado = await paciente.save();
    return res.json(pacienteActualizado);
  } catch (error) {
    console.log(error);
  }
};
const eliminarPaciente = async (req, res) => {
  // Obteniendo el id de la URL
  const { id } = req.params;
  // Buscando el paciente con ese id
  const paciente = await Paciente.findById(id);

  // Si NO existe el paciente:
  if (!paciente) {
    return res.status(404).json({ msg: "Paciente no encontrado" });
  }

  // - Validando que el veterinario que va a eliminar es quien creo al paciente.
  if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
    return res.json({ msg: "Accion no válida" });
  }

  // Eliminar al paciente
  try {
    await paciente.deleteOne();
    res.json({ msg: "Paciente eliminado" });
  } catch (error) {
    console.log(error);
  }
};

export {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
