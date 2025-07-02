import { planetsApi } from "../api/planetsApi";
import type { Planet } from "../interfaces/planet.interface";

export const getPlanets = async (): Promise<Planet[]> => {
  /**
   * Función para obtener todos los planetas.
   * Realiza una petición GET a la API de planetas.
   * @returns Una promesa que resuelve con la lista de planetas.
   */

  console.log("Realizando petición http");
  const res = await planetsApi.get<Planet[]>("/");
  return res.data;
};
