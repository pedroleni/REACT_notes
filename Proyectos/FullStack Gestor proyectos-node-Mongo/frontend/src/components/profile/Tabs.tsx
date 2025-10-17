import { FingerPrintIcon, UserIcon } from "@heroicons/react/20/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Configuración de las pestañas disponibles con sus rutas e iconos
const tabs = [
  { name: "Mi Cuenta", href: "/profile", icon: UserIcon },
  {
    name: "Cambiar Password",
    href: "/profile/password",
    icon: FingerPrintIcon,
  },
];

/**
 * Función helper para concatenar clases CSS condicionales
 * Filtra valores falsy y une las clases con espacios
 * @param classes - Array de strings con nombres de clases CSS (pueden incluir valores undefined/null)
 * @returns String con todas las clases válidas concatenadas
 */
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Componente de navegación por pestañas para la sección de perfil
 * Muestra un select en móvil y tabs horizontales en desktop
 * Resalta visualmente la pestaña activa según la ruta actual
 * Incluye dos secciones: "Mi Cuenta" y "Cambiar Password"
 */
export default function Tabs() {
  // Hook para navegar programáticamente (usado en el select de móvil)
  const navigate = useNavigate();

  // Hook para obtener la ubicación/ruta actual
  const location = useLocation();

  // Determina qué tab está actualmente seleccionado basándose en la ruta
  // Filtra el array de tabs y obtiene el href del tab que coincide con la ruta actual
  const currentTab = tabs.filter((tab) => tab.href === location.pathname)[0]
    .href;

  return (
    <div className="mb-10">
      {/* Versión móvil: Select dropdown */}
      {/* Solo visible en pantallas pequeñas (oculto en sm y superiores) */}
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>

        {/* Select para cambiar entre tabs en móvil */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-purple-800 focus:ring-purple-800"
          // Al cambiar la opción, navega a la nueva ruta
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            navigate(e.target.value)
          }
          value={currentTab}
        >
          {/* Genera una option por cada tab disponible */}
          {tabs.map((tab) => {
            return (
              <option value={tab.href} key={tab.name}>
                {tab.name}
              </option>
            );
          })}
        </select>
      </div>

      {/* Versión desktop: Tabs horizontales con iconos */}
      {/* Solo visible en pantallas sm y superiores */}
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {/* Genera un Link por cada tab disponible */}
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                to={tab.href}
                // Aplica estilos diferentes si el tab está activo o inactivo
                className={classNames(
                  location.pathname === tab.href
                    ? "border-purple-800 text-purple-800" // Tab activo
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700", // Tab inactivo
                  "group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium"
                )}
              >
                {/* Icono del tab */}
                <tab.icon
                  className={classNames(
                    location.pathname === tab.href
                      ? "text-purple-800" // Icono púrpura si está activo
                      : "text-gray-400 group-hover:text-gray-500", // Icono gris si está inactivo
                    "-ml-0.5 mr-2 h-5 w-5"
                  )}
                  aria-hidden="true"
                />

                {/* Nombre del tab */}
                <span>{tab.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
