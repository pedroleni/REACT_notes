import { Planet } from "../../interfaces/planet.interface";

interface Props {
  planets: Planet[];
}

export const PlanetList = ({ planets }: Props) => {
  /*
   * Componente para mostrar una lista de planetas.
   * Recibe un array de planetas como prop.
   * Muestra cada planeta con su nombre, tipo y distancia al sol.
   * Utiliza Tailwind CSS para el estilo y animaciones.
   */
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fadeIn">
      {planets.map((planet) => (
        <div key={planet.id} className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold">{planet.name}</h2>
          <p className="text-gray-700">{planet.type}</p>
          <p className="text-gray-700">{planet.distanceFromSun}</p>
        </div>
      ))}
    </div>
  );
};
