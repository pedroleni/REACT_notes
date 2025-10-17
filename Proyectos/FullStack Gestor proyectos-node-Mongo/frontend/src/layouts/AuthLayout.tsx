import Logo from "@/components/Logo";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

/**
 * Layout para las páginas de autenticación (login, registro, recuperar contraseña, etc.)
 * Diseño simplificado con fondo oscuro y contenedor centrado
 * No requiere verificación de autenticación ya que son rutas públicas
 *
 * Rutas que usan este layout:
 * - /auth/login - Inicio de sesión
 * - /auth/register - Registro de usuario
 * - /auth/forgot-password - Recuperar contraseña
 * - /auth/confirm-account - Confirmar cuenta
 * - /auth/new-password - Establecer nueva contraseña
 *
 * Diferencias con AppLayout:
 * - Sin header/footer completo
 * - Sin menú de navegación
 * - Sin protección de autenticación
 * - Diseño minimalista centrado en el formulario
 */
export default function AuthLayout() {
  return (
    <>
      {/* Contenedor principal con fondo oscuro y altura mínima de pantalla completa */}
      <div className="bg-gray-800 min-h-screen">
        {/* Contenedor centrado con ancho fijo para los formularios de autenticación */}
        <div className="py-10 lg:py-20 mx-auto w-[450px]">
          {/* Logo de la aplicación */}
          <Logo />

          {/* 
                        Contenedor del contenido de las rutas hijas
                        Outlet es el punto de inserción donde se renderizan:
                        - LoginView
                        - RegisterView
                        - ForgotPasswordView
                        - ConfirmAccountView
                        - NewPasswordView
                    */}
          <div className="mt-10">
            <Outlet />
          </div>
        </div>
      </div>

      {/* 
                Contenedor global de notificaciones toast
                Configuración idéntica a AppLayout para consistencia
                pauseOnHover={false}: Los toasts no se pausan al pasar el mouse
                pauseOnFocusLoss={false}: Los toasts no se pausan al cambiar de pestaña
            */}
      <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false} />
    </>
  );
}
