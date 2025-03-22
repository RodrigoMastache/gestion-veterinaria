// Este es como el "master page" es decir el layout principal
// Outlet sirve para servir contenido dinámico
import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <>
      <h1>Administrador de Pacientes de Veterinario</h1>
      {/* // - Si cuando se llama este layout, hay conenido extra, "outlet" lo cargarÁ, es como un placeholder */}
      {/* // - es decir: usara este laoyut y rellenará con lo que se le pase */}
      <Outlet />
    </>
  );
};

export default AuthLayout;
