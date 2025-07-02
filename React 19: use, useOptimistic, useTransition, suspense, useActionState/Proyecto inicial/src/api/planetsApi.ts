import axios from "axios";
/**
 * API para interactuar con los planetas.
 * Utiliza Axios para realizar peticiones HTTP.
 * Configurada para apuntar a un servidor local en el puerto 3100.
 * Incluye un interceptor que simula una espera de 2 segundos antes de procesar la petición.
 */
export const planetsApi = axios.create({
  baseURL: "http://localhost:3100/planets",
});

//! Interceptor para simular una espera de 2 segundos
planetsApi.interceptors.request.use((config) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(config);
      // reject(new Error('Error de prueba desde interceptor'));
    }, 2000);
  });
});

/**
 * Función para obtener todos los planetas.
 * Realiza una petición GET a la API de planetas.
 * @returns Una promesa que resuelve con la lista de planetas.
 */
