import jwt from "jsonwebtoken";

const generarJWT = (id) => {
  // Crear un nuevo JSON Web Token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    //Cuando expira (30 días: 30d)
    expiresIn: "30d",
  });
};

export default generarJWT;
