import axios from "axios";

/**
 * Instancia personalizada de Axios configurada para la API del backend
 * Incluye la URL base y un interceptor para agregar automáticamente el token de autenticación
 * Todas las peticiones HTTP de la aplicación usan esta instancia para mantener consistencia
 */

// Crea una instancia de Axios con configuración personalizada
const api = axios.create({
  // URL base de la API obtenida de las variables de entorno
  // Ejemplo: http://localhost:4000/api o https://api.ejemplo.com/api
  // Todas las rutas relativas se concatenarán con esta URL base
  baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Interceptor de request que se ejecuta antes de cada petición HTTP
 * Añade automáticamente el token de autenticación en el header Authorization
 * Esto permite que todas las peticiones incluyan el token sin tener que agregarlo manualmente
 *
 * Flujo:
 * 1. Se obtiene el token del localStorage
 * 2. Si el token existe, se agrega al header Authorization con formato Bearer
 * 3. La petición continúa con el token incluido
 * 4. El backend valida el token y permite/deniega el acceso
 */
api.interceptors.request.use((config) => {
  // Obtiene el token de autenticación del almacenamiento local del navegador
  const token = localStorage.getItem("AUTH_TOKEN");

  // Si existe un token, lo agrega al header de la petición
  if (token) {
    // Formato Bearer token estándar para autenticación JWT
    // El servidor espera recibir: Authorization: Bearer <token>
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Retorna la configuración modificada para que la petición continúe
  return config;
});

// Exporta la instancia configurada para ser usada en toda la aplicación
export default api;
