// Definiendo el cliente de AXIOS
import axios from "axios";

// Crear una URL de base
const clienteAxios = axios.create({
  // dominio principal donde se haran las peticiones
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

export default clienteAxios;
