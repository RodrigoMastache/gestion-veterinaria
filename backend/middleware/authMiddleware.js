import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

// "next": detiene ejecución del código y lo pasa hacia el siguiente middleware
const checkAuth = async (req, res, next) => {
  let token;
  // Verificar que el token este en el header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Comprobar el token
    // - Descifrando el token
    try {
      // Separar "Bearer xxxxx", para obtener solo el token
      token = req.headers.authorization.split(" ")[1];

      // Verificar: verify(token, palabra secreta)
      // - Va a regresar el id del usuario; entonces ya tenemos la info del usuario que esta autenticado.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener datos del usuario autenticado
      // - Solo traer los datos que interesen (no el password); para limitar los datos se usa "select"
      // - Con "-password", trae todos los datos menos el password.
      // - Al usar req.veterinario, va a crear una sesión con la información del veterinario
      req.veterinario = await Veterinario.findById(decoded.id).select(
        "-password -token -confirmado"
      );
      // Ir al siguiente middleware y ya no ir a las siguientes lineas.
      return next();
    } catch (error) {
      // No hubo un token
      const e = new Error("Token no válido");
      return res.status(403).json({ msg: e.message });
    }
  }

  // Si la variable token se queda vacia, si nunca se le asigna un valor
  // significa que no hubo un token valido o tampoco llego un token
  if (!token) {
    const error = new Error("Token inválido o inexistente");
    res.status(403).json({ msg: error.message });
  }

  next();
};

export default checkAuth;
