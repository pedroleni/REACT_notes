import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/AuthAPI";

/**
 * Custom hook para obtener y gestionar el estado del usuario autenticado
 * Utiliza React Query para cachear los datos del usuario y manejar estados de carga/error
 * Los datos del usuario se obtienen usando el token de autenticación almacenado en localStorage
 * Si el token es inválido o no existe, isError será true y la app redirigirá al login
 *
 * @returns {Object} Objeto con los datos del usuario y estados de la query
 * @returns {User | undefined} data - Datos del usuario autenticado (nombre, email, id)
 * @returns {boolean} isError - True si hay error al obtener el usuario (token inválido/expirado)
 * @returns {boolean} isLoading - True mientras se están cargando los datos del usuario
 *
 * @example
 * // Uso en componentes
 * const { data, isError, isLoading } = useAuth();
 *
 * if (isLoading) return <p>Cargando...</p>;
 * if (isError) return <Navigate to="/auth/login" />;
 * if (data) return <p>Hola, {data.name}</p>;
 */
export const useAuth = () => {
  // Query de React Query para obtener los datos del usuario autenticado
  const { data, isError, isLoading } = useQuery({
    // Key única para identificar esta query en la cache
    // Se usa en toda la app para acceder a los datos del usuario
    queryKey: ["user"],

    // Función que obtiene los datos del usuario desde la API
    // Usa el token de localStorage para autenticar la petición
    queryFn: getUser,

    // Número de reintentos si la petición falla
    // Solo reintenta 1 vez para fallar rápido si el token es inválido
    retry: 1,

    // Desactiva el refetch automático cuando la ventana recupera el foco
    // Evita peticiones innecesarias al cambiar de pestaña
    refetchOnWindowFocus: false,
  });

  // Retorna los datos del usuario y los estados de la query
  return { data, isError, isLoading };
};
