import mongoose from "mongoose";

// Definir el Schema de pacientes (mapeo)
const pacientesSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },

    propietario: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    fecha: {
      type: Date,
      required: true,
      default: Date.now(),
    },

    sintomas: {
      type: String,
      required: true,
    },
    // Referencia de quien es el veterinario porque solo podrán ver a sus pacientes.
    // Almacenaremos el id del veterinario
    veterinario: {
      // Obteniendo el object id del veterinario
      type: mongoose.Schema.Types.ObjectId,
      // Haciendo referencia al modelo de "Veterinario"
      ref: "Veterinario",
    },
  },
  {
    // Crear columnas de creado y editado:
    timestamps: true,
  }
);
// Registramos el modelo (nombre del modelo, forma de los datos)
const Paciente = mongoose.model("Paciente", pacientesSchema);

export default Paciente;
