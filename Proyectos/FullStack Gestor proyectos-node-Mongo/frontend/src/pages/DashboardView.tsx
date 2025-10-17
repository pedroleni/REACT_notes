import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/api/ProjectAPI";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";

/**
 * Vista principal del dashboard de proyectos
 * Muestra todos los proyectos donde el usuario es manager o colaborador
 * Es la página de inicio después del login y punto central de la aplicación
 *
 * Ruta: / (raíz de la aplicación)
 *
 * Funcionalidades principales:
 * - Lista todos los proyectos del usuario (como manager o colaborador)
 * - Indica el rol del usuario en cada proyecto (Manager/Colaborador)
 * - Permite crear nuevos proyectos
 * - Permite acceder a cada proyecto para verlo/editarlo
 * - Permite editar proyectos (solo manager)
 * - Permite eliminar proyectos (solo manager)
 *
 * Diferencias de permisos:
 * - Manager: Puede ver, editar y eliminar el proyecto
 * - Colaborador: Solo puede ver el proyecto y sus tareas
 *
 * Estados visuales:
 * - Loading: Muestra mensaje mientras carga proyectos y usuario
 * - Con proyectos: Lista completa con información y opciones
 * - Sin proyectos: Mensaje con link para crear primer proyecto
 */
export default function DashboardView() {
  // Hook para obtener la ubicación actual (usado para query params del modal)
  const location = useLocation();

  // Hook para navegar y abrir el modal de eliminar proyecto
  const navigate = useNavigate();

  // Hook para obtener los datos del usuario autenticado
  const { data: user, isLoading: authLoading } = useAuth();

  // Query para obtener todos los proyectos del usuario
  // Incluye proyectos donde es manager y donde es colaborador
  const { data, isLoading } = useQuery({
    // Key única para identificar esta query en la cache
    // Se invalida cuando se crean, actualizan o eliminan proyectos
    queryKey: ["projects"],

    // Función que obtiene todos los proyectos del usuario autenticado
    queryFn: getProjects,
  });

  // Mientras se cargan tanto los proyectos como la autenticación, muestra mensaje
  if (isLoading && authLoading) return "Cargando...";

  // Si se cargaron correctamente tanto los proyectos como el usuario
  if (data && user)
    return (
      <>
        {/* Título principal del dashboard */}
        <h1 className="text-5xl font-black">Mis Proyectos</h1>

        {/* Descripción del dashboard */}
        <p className="text-2xl font-light text-gray-500 mt-5">
          Maneja y administra tus proyectos
        </p>

        {/* Botón para crear nuevo proyecto */}
        <nav className="my-5 ">
          <Link
            className=" bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            to="/projects/create"
          >
            Nuevo Proyecto
          </Link>
        </nav>

        {/* Renderizado condicional: lista de proyectos o mensaje vacío */}
        {data.length ? (
          // Lista de proyectos del usuario
          <ul
            role="list"
            className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {/* Itera sobre cada proyecto */}
            {data.map((project) => (
              <li
                key={project._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                {/* Información del proyecto */}
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    {/* 
                    Badge que indica el rol del usuario en el proyecto
                    Manager: Badge azul índigo
                    Colaborador: Badge verde
                    isManager es una función helper que verifica si el usuario es el manager
                  */}
                    <div className="mb-2">
                      {isManager(project.manager, user._id) ? (
                        <p className="font-bold text-xs uppercase bg-indigo-50 text-indigo-500 border-2 border-indigo-500 rounded-lg inline-block py-1 px-5">
                          Manager
                        </p>
                      ) : (
                        <p className="font-bold text-xs uppercase bg-green-50 text-green-500 border-2 border-green-500 rounded-lg inline-block py-1 px-5">
                          Colaborador
                        </p>
                      )}
                    </div>

                    {/* Nombre del proyecto como link para acceder a él */}
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                    >
                      {project.projectName}
                    </Link>

                    {/* Nombre del cliente */}
                    <p className="text-sm text-gray-400">
                      Cliente: {project.clientName}
                    </p>

                    {/* Descripción del proyecto */}
                    <p className="text-sm text-gray-400">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Menú de opciones del proyecto */}
                <div className="flex shrink-0 items-center gap-x-6">
                  {/* Menú dropdown de Headless UI */}
                  <Menu as="div" className="relative flex-none">
                    {/* Botón de tres puntos para abrir el menú */}
                    <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon
                        className="h-9 w-9"
                        aria-hidden="true"
                      />
                    </Menu.Button>

                    {/* Animación de transición para el menú */}
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      {/* Panel del menú con opciones */}
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {/* Opción "Ver Proyecto" - Visible para todos (manager y colaboradores) */}
                        <Menu.Item>
                          <Link
                            to={`/projects/${project._id}`}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900"
                          >
                            Ver Proyecto
                          </Link>
                        </Menu.Item>

                        {/* Opciones de editar y eliminar - Solo visibles para el manager */}
                        {isManager(project.manager, user._id) && (
                          <>
                            {/* Opción "Editar Proyecto" - Solo manager */}
                            <Menu.Item>
                              <Link
                                to={`/projects/${project._id}/edit`}
                                className="block px-3 py-1 text-sm leading-6 text-gray-900"
                              >
                                Editar Proyecto
                              </Link>
                            </Menu.Item>

                            {/* 
                            Opción "Eliminar Proyecto" - Solo manager
                            Texto en rojo para indicar acción destructiva
                            Abre modal de confirmación con query param
                          */}
                            <Menu.Item>
                              <button
                                type="button"
                                className="block px-3 py-1 text-sm leading-6 text-red-500"
                                onClick={() =>
                                  navigate(
                                    location.pathname +
                                      `?deleteProject=${project._id}`
                                  )
                                }
                              >
                                Eliminar Proyecto
                              </button>
                            </Menu.Item>
                          </>
                        )}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // Mensaje cuando el usuario no tiene proyectos
          <p className="text-center py-20">
            No hay proyectos aún {""}
            <Link to="/projects/create" className=" text-fuchsia-500 font-bold">
              Crear Proyecto
            </Link>
          </p>
        )}

        {/* 
        Modal para confirmar eliminación de proyecto
        Se muestra cuando hay query param ?deleteProject=projectId
        Requiere contraseña del usuario para confirmar la eliminación
      */}
        <DeleteProjectModal />
      </>
    );
}
