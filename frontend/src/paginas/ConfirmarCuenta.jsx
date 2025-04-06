// Importar useEffect para ejecute un codigo una vez que el componente este listo
import { useEffect, useState } from "react";
// Importando hook "useParams" para extraer datos de la url
import { useParams, Link } from "react-router-dom";
// Importar el cliente axios (viene la base de la url)
import clienteAxios from "./../config/axios";

import Alerta from "./../components/Alerta";
const ConfirmarCuenta = () => {
  // Por default la cuenta no va a estar confirmada "false"
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
  // Estado de espera en lo que arroja el resultado
  const [cargando, setCargando] = useState(true);
  // Estado para la alerta
  const [alerta, setAlerta] = useState({});
  // Leer el token de la url
  const params = useParams();
  const { id } = params;

  // Una vez el componente este listo, ejecutar:
  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/veterinarios/confirmar/${id}`;

        // Respuesta de axios. (por default es "get", por lo que se puede omitir)
        // Se usa el cliente axios, que ya contiene la url base para hacer la petición.
        const { data } = await clienteAxios(url);
        // Se confirmo la cuenta
        setCuentaConfirmada(true);
        // Establecer alerta de cuenta confirmada
        setAlerta({
          msg: data.msg,
        });
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
      // ya sea que haya un error o se haya cambiado correctamente, cambia a false
      setCargando(false);
    };
    confirmarCuenta();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-6xl">
          Confirma tu cuenta y comienza a administrar {""}
          <span className="text-black">tus pacientes</span>
        </h1>
      </div>

      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-x bg-white">
        {/* Cuando ya no este cargando, es decir, ya no este en true, entonces muestra la alerta */}
        {!cargando && <Alerta alerta={alerta} />}
        {/* Condicion: si esta confirmada la cuenta  mostrar ligas de iniciar sesión */}
        {cuentaConfirmada && (
          <Link className="block text-center my-5 text-gray-500" to="/">
            Iniciar sesión
          </Link>
        )}
      </div>
    </>
  );
};

export default ConfirmarCuenta;
