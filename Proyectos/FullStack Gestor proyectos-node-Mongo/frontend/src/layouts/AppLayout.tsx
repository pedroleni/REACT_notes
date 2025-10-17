import { Link, Outlet, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "@/components/Logo";
import NavMenu from "@/components/NavMenu";
import { useAuth } from "@/hooks/useAuth";

/**
 * Layout principal de la aplicación para rutas protegidas
 * Verifica la autenticación del usuario antes de renderizar el contenido
 * Incluye header con logo y menú de navegación, área de contenido y footer
 * Todas las rutas que usen este layout requieren autenticación
 *
 * Estados manejados:
 * - Loading: Muestra mensaje mientras verifica autenticación
 * - Error: Redirige al login si no hay token válido
 * - Success: Renderiza el layout completo con el contenido de las rutas hijas
 */
export default function AppLayout() {
  // Hook personalizado para obtener el estado de autenticación del usuario
  const { data, isError, isLoading } = useAuth();

  // Mientras se verifica la autenticación, muestra mensaje de carga
  // Evita mostrar contenido protegido antes de validar el token
  if (isLoading) return "Cargando...";

  // Si hay error (token inválido, expirado o no existe)
  // Redirige automáticamente a la página de login
  if (isError) {
    return <Navigate to="/auth/login" />;
  }

  // Si el usuario está autenticado correctamente, renderiza el layout
  if (data)
    return (
      <>
        {/* Header de la aplicación con fondo oscuro */}
        <header className="bg-gray-800 py-5">
          <div className=" max-w-screen-2xl mx-auto flex flex-col lg:flex-row justify-between items-center">
            {/* Logo de la aplicación que funciona como link al home */}
            <div className="w-64">
              <Link to={"/"}>
                <Logo />
              </Link>
            </div>

            {/* Menú de navegación desplegable con el nombre del usuario */}
            <NavMenu name={data.name} />
          </div>
        </header>

        {/* Área principal de contenido donde se renderizan las rutas hijas */}
        {/* Outlet es el punto de inserción para los componentes de las rutas anidadas */}
        <section className="max-w-screen-2xl mx-auto mt-10 p-5">
          <Outlet />
        </section>

        {/* Footer con copyright dinámico según el año actual */}
        <footer className="py-5">
          <p className="text-center">
            Todos los derechos reservados {new Date().getFullYear()}
          </p>
        </footer>

        {/* 
                Contenedor global de notificaciones toast
                pauseOnHover={false}: Los toasts no se pausan al pasar el mouse
                pauseOnFocusLoss={false}: Los toasts no se pausan al cambiar de pestaña
                Esto asegura que las notificaciones se cierren automáticamente
            */}
        <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
      </>
    );
}
