import ProfileForm from "@/components/profile/ProfileForm";
import { useAuth } from "@/hooks/useAuth";

/**
 * Vista de perfil del usuario autenticado
 * Muestra el formulario para editar información personal (nombre y email)
 * Utiliza el hook useAuth para obtener los datos actuales del usuario
 * Los datos se precargan en el formulario para facilitar la edición
 * Accesible desde el menú de navegación en /profile
 *
 * Estados manejados:
 * - Loading: Muestra mensaje mientras se cargan los datos del usuario
 * - Success: Renderiza el formulario con los datos del usuario precargados
 * - Error: Redirige al login (manejado por AppLayout)
 *
 * Componentes relacionados:
 * - ProfileForm: Formulario de edición con campos de nombre y email
 * - ChangePasswordView: Vista separada para cambiar contraseña (/profile/password)
 * - Tabs: Navegación entre "Mi Cuenta" y "Cambiar Password"
 */
export default function ProfileView() {
  // Hook personalizado para obtener los datos del usuario autenticado
  // data: Información del usuario (nombre, email, id)
  // isLoading: Estado de carga mientras se obtienen los datos
  const { data, isLoading } = useAuth();

  // Mientras se cargan los datos del usuario, muestra mensaje de carga
  // Evita renderizar el formulario sin datos
  if (isLoading) return "Cargando...";

  // Si los datos del usuario están disponibles, renderiza el formulario
  // Los datos se pasan como props para precargar los campos
  // ProfileForm maneja la actualización del perfil
  if (data) return <ProfileForm data={data} />;
}
