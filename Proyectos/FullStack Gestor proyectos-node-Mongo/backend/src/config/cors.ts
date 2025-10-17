import { CorsOptions } from "cors";

/**
 * Configuración de CORS (Cross-Origin Resource Sharing) para la API
 * Define qué orígenes (dominios) pueden hacer peticiones al servidor
 * Implementa una lista blanca (whitelist) de URLs permitidas
 *
 * CORS es un mecanismo de seguridad del navegador que:
 * - Previene que sitios maliciosos accedan a la API
 * - Solo permite peticiones desde orígenes autorizados
 * - Protege contra ataques CSRF (Cross-Site Request Forgery)
 *
 * Configuración actual:
 * - Producción: Solo permite peticiones desde FRONTEND_URL (ej: https://miapp.com)
 * - Desarrollo: También permite peticiones sin origin (herramientas como Postman, Thunder Client)
 */
export const corsConfig: CorsOptions = {
  /**
   * Función que valida si un origen está permitido para hacer peticiones
   * Se ejecuta en cada petición HTTP entrante antes de procesarla
   *
   * @param origin - URL del sitio que está haciendo la petición (ej: http://localhost:5173)
   * @param callback - Función que se llama con el resultado de la validación
   *
   * Flujo de validación:
   * 1. Se compara el origin con la whitelist de URLs permitidas
   * 2. Si está en la whitelist → callback(null, true) - Petición permitida
   * 3. Si no está en la whitelist → callback(Error) - Petición bloqueada
   */
  origin: function (origin, callback) {
    /**
     * Lista blanca de orígenes permitidos
     * Incluye la URL del frontend obtenida de las variables de entorno
     * Ejemplo: ['http://localhost:5173', 'https://miapp.com']
     */
    const whitelist = [process.env.FRONTEND_URL];

    /**
     * Modo de desarrollo/testing con herramientas API
     * Si se ejecuta el servidor con el flag --api (ej: npm run dev --api)
     * Se agrega 'undefined' a la whitelist para permitir peticiones sin origin
     *
     * Esto permite usar:
     * - Postman
     * - Thunder Client
     * - cURL
     * - Insomnia
     *
     * IMPORTANTE: Solo usar en desarrollo, nunca en producción
     * Las peticiones desde navegadores siempre tienen origin
     * Las peticiones desde herramientas API no tienen origin (undefined)
     */
    if (process.argv[2] === "--api") {
      whitelist.push(undefined);
    }

    /**
     * Validación del origen de la petición
     * Comprueba si el origin está en la lista de orígenes permitidos
     */
    if (whitelist.includes(origin)) {
      // Origin permitido - La petición puede continuar
      // Primer parámetro null = sin error
      // Segundo parámetro true = permitir la petición
      callback(null, true);
    } else {
      // Origin no permitido - Bloquear la petición
      // Se envía un error que será manejado por Express
      // El navegador bloqueará la petición y mostrará error de CORS
      callback(new Error("Error de CORS"));
    }
  },
};
