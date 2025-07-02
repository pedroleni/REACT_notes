import { planetsApi } from "../api/planetsApi";
import type { Planet } from "../interfaces/planet.interface";

export const createPlanetAction = async (planet: Partial<Planet>) => {
  /**
   * los action son funciones que se encargan de realizar una acción
   * en este caso, crear un nuevo planeta.
   * recibe un objeto parcial de tipo Planet, lo que significa que
   * no es necesario enviar todos los campos del planeta, solo los que se desean crear.
   * retorna una promesa que resuelve con el nuevo planeta creado o null en caso de
   * que ocurra un error.
   * se utiliza el método post de la api de planetas para enviar los datos del nuevo
   * planeta al servidor.
   * si ocurre un error, se captura y se imprime en la consola, retornando null
   * como resultado.
   * @param planet - Objeto parcial de tipo Planet que contiene los datos del nuevo planeta
   * @returns Promise<Planet | null> - Promesa que resuelve con el nuevo planeta creado o null en caso de error
   * @throws Error - Si ocurre un error al
   */
  try {
    const response = await planetsApi.post<Planet>("/", planet);

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createPlanetActionForm = async (
  prevState: unknown,
  queryData: FormData
) => {
  /**
   * Función para crear un nuevo planeta utilizando FormData.
   * Esta función toma un objeto FormData que contiene los datos del planeta
   * y los envía a la API de planetas.
   * @param prevState - Estado previo, no utilizado en esta función.
   * @param queryData - FormData que contiene los datos del nuevo planeta.
   * @returns Promise<Planet> - Promesa que resuelve con el nuevo planeta creado
   * @throws Error - Si ocurre un error al crear el planeta.
   */
  const formData = Object.fromEntries(queryData.entries());

  try {
    const response = await planetsApi.post<Planet>("/", formData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("No se pudo agregar o crear el planeta");
    // return null;
  }
};
