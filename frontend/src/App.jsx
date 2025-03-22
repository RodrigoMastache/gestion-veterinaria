// Importar react-router-dom:
// - BroswerRouter: abraza todo el contenido
// - Routes: Permite agrupar diferentes rutas
// - Route: Para una ruta en específico
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Importar componentes propios
import AuthLayout from "./layout/AuthLayout";
import Login from "./paginas/Login";
import Registrar from "./paginas/Registrar";
import OlvidePassword from "./paginas/OlvidePassword";
import ConfirmarCuenta from "./paginas/ConfirmarCuenta";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* // Definiendo rutas públicas */}
        {/* // Con el "Route" padre se va a definir el diseño en común para las diferentes paginas */}
        {/* // - Cuando el usuario visite "/" entonces cargara el componente de AuthLayout */}
        {/* // - "element={}" es el componente que compartira con los rutas hijas/ rutas anidadas */}
        <Route path="/" element={<AuthLayout />}>
          {/* // - Aquí ira el listado de páginas; todas estas páginas siguientes, tendrán <AuthLayout /> como su Layout padre */}
          {/* // - e iniciarán con "/" al inicio */}
          {/* // - La prop "index" se usa cuando quieres que una ruta hija actúe como la predeterminada dentro de una ruta padre. */}
          <Route index element={<Login />} />
          {/* // - ya no es necesario poner el "/" ya lo usa en el padre */}
          <Route path="registrar" element={<Registrar />} />
          <Route path="olvide-password" element={<OlvidePassword />} />
          {/* // - Esta es una ruta dinámica por lo que el path lleva :id */}
          <Route path="confirmar/:id" element={<ConfirmarCuenta />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
