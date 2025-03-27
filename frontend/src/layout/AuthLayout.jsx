// Este es como el "master page" es decir el layout principal
// Outlet sirve para servir contenido dinámico
import { Outlet } from "react-router-dom";
const AuthLayout = () => {
  return (
    <>
      <main className="container mx-auto md:grid md:grid-cols-2 mt-12 gap-10 p-5 items-center">
        {/* // - Si cuando se llama este layout, hay conenido extra, "outlet" lo cargará, es como un placeholder */}
        {/* // - es decir: usara este laoyut y rellenará con lo que se le pase */}
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
