import { useOptimistic, useTransition } from "react";
import { updatePlanetAction } from "../../actions/update-planet.action";
import { Planet } from "../../interfaces/planet.interface";

interface Props {
  planets: Planet[];
  setPlanets: (planets: Planet[]) => void;
}

export const PlanetList = ({ planets, setPlanets }: Props) => {
  /**
   * Componente para mostrar una lista de planetas.
   * Permite actualizar el nombre de un planeta a mayúsculas de forma optimista.
   */
  const [isPending, startTransition] = useTransition();

  /**
   * el hook useTransition permite manejar transiciones optimistas
   * y mejorar la experiencia del usuario al actualizar el estado de los planetas.
   */

  /**
   * useOptimistic permite manejar el estado optimista de los planetas.
   * Cuando se actualiza un planeta, se muestra inmediatamente el cambio en la UI,
   * y si la actualización falla, se revierte al estado original.
   */
  const [optimisticPlanets, setOptimisticNewPlanets] = useOptimistic(
    planets,
    (current, newPlanet: Planet) => {
      console.log("Planetas optimistas", current, newPlanet);
      const updatedPlanets = current.map((planet) =>
        planet.id === newPlanet.id ? newPlanet : planet
      );

      return updatedPlanets;
    }
  );

  const handleUpdatePlanet = async (planet: Planet) => {
    /**
     * Maneja la actualización de un planeta.
     * Utiliza una transición para optimizar la experiencia del usuario.
     * Si la actualización falla, se revertirá al estado original del planeta.
     *
     * @param planet - El planeta a actualizar.
     */
    startTransition(async () => {
      const data = {
        ...planet,
        name: planet.name.toUpperCase(),
      };

      try {
        console.log("xxxxxxxx", data);
        setOptimisticNewPlanets(data);
        const updatedPlanet = await updatePlanetAction(data);
        console.log("Planeta actualizado", updatedPlanet);
        setPlanets([
          ...optimisticPlanets.map((p) =>
            p.id === updatedPlanet.id ? updatedPlanet : p
          ),
        ]);
      } catch (error) {
        console.log("entrooooooo");
        setOptimisticNewPlanets(planet);
      }
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fadeIn">
      {optimisticPlanets.map((planet) => (
        <div key={planet.id} className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold">{planet.name}</h2>
          <p className="text-gray-700">{planet.type}</p>
          <p className="text-gray-700">{planet.distanceFromSun}</p>

          <br />
          <button
            className="bg-blue-500 disabled:bg-gray-500 text-white p-2 rounded w-full"
            onClick={() => handleUpdatePlanet(planet)}
            disabled={isPending}
          >
            Actualizar
          </button>
        </div>
      ))}
    </div>
  );
};
