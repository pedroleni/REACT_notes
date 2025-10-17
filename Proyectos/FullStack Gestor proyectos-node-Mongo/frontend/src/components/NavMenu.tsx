import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { User } from "../types";
import { useQueryClient } from "@tanstack/react-query";

// Props del componente
type NavMenuProps = {
  name: User["name"]; // Nombre del usuario autenticado para mostrar en el menú
};

/**
 * Componente de menú de navegación desplegable en el header
 * Muestra un icono de hamburguesa que al hacer clic despliega un popover
 * El popover incluye:
 * - Saludo con el nombre del usuario
 * - Link a "Mi Perfil"
 * - Link a "Mis Proyectos"
 * - Botón para cerrar sesión
 * @param name - Nombre del usuario autenticado
 */
export default function NavMenu({ name }: NavMenuProps) {
  // Cliente de React Query para invalidar la cache del usuario al cerrar sesión
  const queryClient = useQueryClient();

  /**
   * Maneja el cierre de sesión del usuario
   * Elimina el token de autenticación del localStorage
   * Invalida la query del usuario para limpiar los datos en la cache
   * Esto provoca que la aplicación redirija al login automáticamente
   */
  const logout = () => {
    // Elimina el token de autenticación del almacenamiento local
    localStorage.removeItem("AUTH_TOKEN");
    // Invalida la cache del usuario para forzar un nuevo fetch (que fallará sin token)
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  return (
    // Popover de Headless UI para el menú desplegable
    <Popover className="relative">
      {/* Botón que abre/cierra el popover (icono de hamburguesa) */}
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-purple-400">
        <Bars3Icon className="w-8 h-8 text-white " />
      </Popover.Button>

      {/* Animación de transición para mostrar/ocultar el panel del popover */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        {/* Panel del popover con las opciones del menú */}
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
          <div className="w-full lg:w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            {/* Saludo personalizado con el nombre del usuario */}
            <p className="text-center">Hola: {name}</p>

            {/* Link a la página de perfil del usuario */}
            <Link to="/profile" className="block p-2 hover:text-purple-950">
              Mi Perfil
            </Link>

            {/* Link al dashboard de proyectos */}
            <Link to="/" className="block p-2 hover:text-purple-950">
              Mis Proyectos
            </Link>

            {/* Botón para cerrar sesión */}
            <button
              className="block p-2 hover:text-purple-950"
              type="button"
              onClick={logout}
            >
              Cerrar Sesión
            </button>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
