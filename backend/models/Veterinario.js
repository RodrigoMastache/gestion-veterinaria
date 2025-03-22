import mongoose from "mongoose";
// Para 'hashear' los passwords.
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

// Definiendo el schema
const veterinarioSchema = mongoose.Schema({
  // Definir toda la estructura (no se requiere el ID, mongo lo asigna automaticamente)
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
  telefono: {
    type: String,
    default: null, // Trae default porque no es obligatorio.
    trim: true,
  },
  web: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: generarId(),
  },
  confirmado: {
    type: Boolean,
    default: false,
  },
});

// Antes de almacenar el registro, se hashea el password.
// - "pre(): middleware de mongoose"
// -  pre('save') ("antes de almacenarlo...")
// - Como va a hashear el password, se requiere bloquear la ejecución del código con async/await
// - No se puede usar arrow function porque se usará palabra reservada "this" (para obtener todo el objeto)
// * Arrow function: hace referencia a la ventana global (marcaria "undefined" el "this")
// * function: hace referencia al objecto actual y el "this" trae toda la data.
// ¿Qué es "next"?: instruccion para irse al siguiente middleware

veterinarioSchema.pre("save", async function (next) {
  // console.log("==* Antes de almacenar *==");
  // console.log(this);

  // Si el usuario ya habia generado su pass y ya se habia hasheado y modifico su pass:
  // .isModified('password') : esto es de Mongoose.
  // Un password que ya esta hasheado no lo vuelva a hashear
  if (!this.isModified("password")) {
    next();
  }

  // El genSalt es una serie de rondas de hasheo, dejaremos en 10 rondas.
  // Se usa await porque hay que detener la ejecución en lo que se genera el salt.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Registrar funciones que se ejecuten únicamente en este schema o modelo.
// - en este caso lo llamaremos "comprobarPassword"
veterinarioSchema.methods.comprobarPassword = async function (
  passwordFormulario
) {
  // Comparar una cadena con el hash para ver si corresponde
  // - en este caso el password normal (ingresado por el usuario) con el hasheado guardado en la BD
  // - retorna "true" o "false"
  return await bcrypt.compare(passwordFormulario, this.password);
};

// Registrarlo en mongoose (nombre, forma de los datos)
const Veterinario = mongoose.model("Veterinario", veterinarioSchema);

export default Veterinario;
