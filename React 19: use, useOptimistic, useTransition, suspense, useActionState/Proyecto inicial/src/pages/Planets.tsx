import { FC, useEffect, useState } from "react";
import { planetsApi } from "../api/planetsApi";
import { Planet } from "../interfaces/planet.interface";
import { EditPlanetForm } from "./ui/EditPlanetForm";
import { PlanetList } from "./ui/PlanetList";

const getPlanets = async () => {
  /**
   * Función para obtener todos los planetas.
   * Realiza una petición GET a la API de planetas.
   * @returns Una promesa que resuelve con la lista de planetas.
   */
  // Simula una espera de 2 segundos antes de procesar la petición
  const res = await planetsApi.get("/");
  return res.data;
};

const Planets: FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planets, setPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    /**
     * Efecto para cargar los planetas al montar el componente.
     * Utiliza la función getPlanets para realizar la petición a la API.
     * Maneja el estado de carga y posibles errores.
     */
    getPlanets()
      .then((res) => {
        setPlanets(res);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleAddPlanet = (planet: Partial<Planet>) => {
    /**
     * Por ahora vamos a hacer un console.log del planeta
     */
    console.log(planet);
  };

  return (
    <>
      <h4 className="text-2xl font-thin mb-4">Agregar y mantener planetas</h4>
      <hr className="border-gray-300 mb-4" />
      {/* Formulario para agregar un planeta */}
      <EditPlanetForm onAddPlanet={handleAddPlanet} />

      {error && (
        <p>
          Error al cargar los planetas -{" "}
          <small className="text-red-500">{error}</small>
        </p>
      )}

      {/* Lista de planetas Grid*/}
      {isLoading ? <p>Cargando...</p> : <PlanetList planets={planets} />}
    </>
  );
};

export default Planets;
