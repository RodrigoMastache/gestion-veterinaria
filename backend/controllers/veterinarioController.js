// Importando el modelo
import Veterinario from "../models/Veterinario.js";
// Importando el que genera JSON Web Token
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";

// Asociando funciones a las rutas
const registrar = async (req, res) => {
  // Leyendo datos recibidos a este endpoint (request.body)
  // const { nombre, email, password } = req.body;
  const { email } = req.body;
  try {
    // Prevenir usuarios duplicados (por email)
    // - Consultar BD para ver si existe el email:
    const existeUsuario = await Veterinario.findOne({ email });
    if (existeUsuario) {
      const error = new Error("Usuario ya registrado");
      // - Detener ejecución del código
      return res.status(400).json({ msg: error.message });
    }

    // Guardar un nuevo veterinario:
    // Crear nueva instancia de "Veterinario"
    const veterinario = new Veterinario(req.body);
    // Bloqueamos la linea con await hasta que finalice al guardar el registro.
    const veterinarioGuardado = await veterinario.save();
    res.json(veterinarioGuardado);
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  // console.log(req.veterinario);
  // req tiene: en la sesión del servidor, la información del usuario.
  const { veterinario } = req;

  res.json({ perfil: veterinario });
};

const confirmar = async (req, res) => {
  // Leer parámetros de la url:
  // console.log(req.params);
  // Obteniendo el parámetro llamado "token"
  const { token } = req.params;
  // Buscar al usuario
  const usuarioConfirmar = await Veterinario.findOne({ token });
  if (!usuarioConfirmar) {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  }
  // Confirmar la cuenta
  try {
    // Actualizar la base de datos:
    // - confirmado a true
    usuarioConfirmar.confirmado = true;
    // - eliminar el token (por seguridad tiene que desaparecer porque el navegador ya tiene el token registrado en el historial)
    usuarioConfirmar.token = null;
    // - guardar los cambios
    await usuarioConfirmar.save();

    res.json({ msg: "Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

// Función para autenticar a los usuarios:
// Revisar que el usuario existe
const autenticar = async (req, res) => {
  const { email, password } = req.body;
  // Comprobar si el usuario existe
  const usuario = await Veterinario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si el usuario esta confirmado
  if (!usuario.confirmado) {
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({ msg: error.message });
  }

  // Revisar si el  password es correcto
  if (await usuario.comprobarPassword(password)) {
    // Autenticar (Una vez autenticado se genera un JWT json web token)
    // - Genearlo solo con el id del usuario, nunca generar el token con data sensible
    res.json({ token: generarJWT(usuario._id) });
  } else {
    const error = new Error("El password es incorrecto");
    return res.status(403).json({ msg: error.message });
  }
};

// Reseteo de password
const olvidePassword = async (req, res) => {
  // Obtener el correo del que se requiere resetear password.
  const { email } = req.body;
  // Buscar el email en la base de datos
  const existeVeterninario = await Veterinario.findOne({ email });
  // Si no existe el usuario
  if (!existeVeterninario) {
    const error = new Error("El Usuario no existe");
    return res.status(400).json({ msg: error.message });
  }
  // El usuario si existe, entonces generar token y enviarselo por email
  try {
    // Generar id con el helper y asignarlo al usuario
    existeVeterninario.token = generarId();
    // Guardar el token en la base de datos
    await existeVeterninario.save();
    res.json({ msg: "Hemos enviado un email con las instrucciones" });
  } catch (error) {
    console.log(error);
  }
};

// Cuando usuario da click en el correo electrónico para reestablecer password:
const comprobarToken = async (req, res) => {
  // - Recuperando el token de la url
  const { token } = req.params;
  // - Buscando en la base a quien corresponde el token
  const tokenValido = await Veterinario.findOne({ token });
  // - No se usa try-catch porque no se va a cambiar nada en la base de datos.
  // - solamente se esta validando
  if (tokenValido) {
    // - El token es válido, el usuario existe.
    res.json({ msg: "Token válido y el usuario existe" });
  } else {
    const error = new Error("Token no válido");
    return res.status(400).json({ msg: error.message });
  }
};

// Ya confirmado que el token y el usuario existe
const nuevoPassword = async (req, res) => {
  // Leer el token para identificar usuario
  const { token } = req.params;
  const { password } = req.body;

  // Buscando el token en la B.D.
  const veterinario = await Veterinario.findOne({ token });
  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  // En caso de que si exista el token y sea válido
  try {
    // Vaciar token, por seguridad.
    veterinario.token = null;
    // Asignamos el nuevo password al objeto de usuario
    veterinario.password = password;
    // Almacenar los cambios
    await veterinario.save();
    res.json({ msg: "Password modificado correctamente" });
  } catch (error) {
    console.log(error);
  }
};

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
};
