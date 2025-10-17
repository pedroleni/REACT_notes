import mongoose from "mongoose";
import colors from "colors";
import { exit } from "node:process";

/**
 * Establece la conexión a la base de datos MongoDB
 * Utiliza Mongoose como ODM (Object Document Mapper) para interactuar con MongoDB
 * La URL de conexión se obtiene de las variables de entorno para mayor seguridad
 *
 * Variables de entorno requeridas:
 * - DATABASE_URL: String de conexión a MongoDB
 *   Ejemplo local: mongodb://localhost:27017/uptask
 *   Ejemplo MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/uptask
 *
 * Comportamiento:
 * - Éxito: Muestra mensaje en consola con host:puerto y continúa la ejecución
 * - Error: Muestra mensaje de error y termina el proceso con código 1
 *
 * El código de salida 1 indica error, lo que permite:
 * - Detectar fallos en scripts de deploy
 * - Reiniciar automáticamente el servidor con PM2 u otros gestores
 * - Logs de errores en servicios cloud (Heroku, Railway, etc.)
 */
export const connectDB = async () => {
  try {
    /**
     * Intenta conectar a MongoDB usando la URL de las variables de entorno
     * mongoose.connect retorna una promesa que resuelve con un objeto que contiene:
     * - connection: Objeto con información de la conexión (host, puerto, nombre DB, etc.)
     * - connections: Array de todas las conexiones activas
     */
    const { connection } = await mongoose.connect(process.env.DATABASE_URL);

    /**
     * Construye string con la ubicación de la base de datos
     * Ejemplo: "localhost:27017" o "cluster0.mongodb.net:27017"
     * Útil para debugging y confirmar a qué instancia está conectado
     */
    const url = `${connection.host}:${connection.port}`;

    /**
     * Muestra mensaje de éxito en la consola con color magenta
     * colors.magenta.bold aplica formato para mejor visibilidad en terminal
     * Ayuda a identificar rápidamente el estado de conexión al iniciar el servidor
     */
    console.log(colors.magenta.bold(`MongoDB Conectado en: ${url}`));
  } catch (error) {
    /**
     * Manejo de errores de conexión
     * Los errores más comunes incluyen:
     * - DATABASE_URL no definida o incorrecta
     * - MongoDB no está ejecutándose (desarrollo local)
     * - Credenciales inválidas (MongoDB Atlas)
     * - Problemas de red o firewall
     * - IP no autorizada en whitelist (MongoDB Atlas)
     */

    // console.log(error.message) - Comentado para no exponer detalles del error en producción

    /**
     * Muestra mensaje de error genérico en rojo
     * Evita exponer información sensible sobre la configuración de la BD
     * En desarrollo, puedes descomentar error.message para más detalles
     */
    console.log(colors.red.bold("Error al conectar a MongoDB"));

    /**
     * Termina el proceso con código de salida 1
     * exit(1) indica que el proceso terminó con error
     * Esto es importante porque:
     * - Previene que el servidor se ejecute sin base de datos
     * - Permite que gestores de procesos detecten el fallo y reinicien
     * - Facilita debugging al fallar rápido (fail fast)
     *
     * Sin conexión a BD, la aplicación no puede funcionar correctamente,
     * por lo que es mejor terminar el proceso que continuar con errores
     */
    exit(1);
  }
};
