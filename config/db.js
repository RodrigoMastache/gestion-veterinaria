import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      //Objeto de configuración
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`MongoDB conectado en: ${url}`);
  } catch (error) {
    console.log("Error: ", error.message);
    // Finaliza el proceso actual con un código de salida de 1, lo que indica que el proceso terminó con un error.
    process.exit(1);
  }
};

export default conectarDB;
