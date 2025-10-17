import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddMemberModal from "@/components/team/AddMemberModal";
import { getProjectTeam, removeUserFromProject } from "@/api/TeamAPI";
import { toast } from "react-toastify";

/**
 * Vista para gestionar el equipo de colaboradores de un proyecto
 * Permite al manager del proyecto agregar y remover miembros del equipo
 * Solo el manager del proyecto tiene acceso a esta vista
 *
 * Ruta: /projects/:projectId/team
 *
 * Funcionalidades principales:
 * - Visualizar lista de todos los miembros del equipo
 * - Agregar nuevos colaboradores buscándolos por email
 * - Remover colaboradores del proyecto
 * - Volver al proyecto principal
 *
 * Flujo de agregar miembro:
 * 1. Manager hace clic en "Agregar Colaborador"
 * 2. Se abre modal con formulario de búsqueda por email
 * 3. Sistema busca el usuario en la base de datos
 * 4. Se muestra resultado con opción de confirmar
 * 5. Usuario agregado al equipo del proyecto
 * 6. Lista se actualiza automáticamente
 *
 * Permisos:
 * - Solo el manager puede acceder a esta vista
 * - Solo el manager puede agregar/remover miembros
 * - Los miembros del equipo pueden ver tareas pero no gestionar el equipo
 */
export default function ProjectTeamView() {
  // Hook para navegar y abrir el modal de agregar miembro
  const navigate = useNavigate();

  // Obtiene el projectId desde los parámetros de la URL
  const params = useParams();
  const projectId = params.projectId!;

  // Query para obtener la lista de miembros del equipo del proyecto
  const { data, isLoading, isError } = useQuery({
    // Key única para identificar esta query en la cache
    // Se invalida cuando se agregan o remueven miembros
    queryKey: ["projectTeam", projectId],

    // Función que obtiene el array de miembros del equipo
    queryFn: () => getProjectTeam(projectId),

    // No reintenta si falla (para manejar permisos y 404 rápidamente)
    retry: false,
  });

  // Cliente de React Query para invalidar la cache después de remover un miembro
  const queryClient = useQueryClient();

  // Mutación para remover un usuario del equipo del proyecto
  const { mutate } = useMutation({
    mutationFn: removeUserFromProject,
    // Se ejecuta si hay error al remover (sin permisos, miembro no existe, etc.)
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando el miembro se remueve exitosamente
    onSuccess: (data) => {
      toast.success(data); // Mensaje: "Usuario removido del proyecto"
      // Invalida la query del equipo para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    },
  });

  // Mientras se cargan los miembros del equipo, muestra mensaje
  if (isLoading) return "Cargando...";

  // Si hay error (proyecto no existe, sin permisos, etc.)
  // Redirige automáticamente a la página 404
  if (isError) return <Navigate to={"/404"} />;

  // Si se cargó exitosamente la lista de miembros
  if (data)
    return (
      <>
        {/* Título de la vista */}
        <h1 className="text-5xl font-black">Administrar Equipo</h1>

        {/* Descripción de la funcionalidad */}
        <p className="text-2xl font-light text-gray-500 mt-5">
          Administra el equipo de trabajo para este proyecto
        </p>

        {/* Botones de acción */}
        <nav className="my-5 flex gap-3">
          {/* Botón para abrir modal de agregar colaborador */}
          <button
            type="button"
            className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            // Agrega query param ?addMember=true para abrir el modal
            onClick={() => navigate(location.pathname + "?addMember=true")}
          >
            Agregar Colaborador
          </button>

          {/* Link para volver a la vista principal del proyecto */}
          <Link
            to={`/projects/${projectId}`}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
          >
            Volver a Proyecto
          </Link>
        </nav>

        {/* Título de la sección de miembros */}
        <h2 className="text-5xl font-black my-10">Miembros actuales</h2>

        {/* Renderizado condicional: lista de miembros o mensaje vacío */}
        {data.length ? (
          // Lista de miembros del equipo
          <ul
            role="list"
            className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {/* Itera sobre cada miembro del equipo */}
            {data?.map((member) => (
              <li
                key={member._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                {/* Información del miembro */}
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    {/* Nombre del miembro */}
                    <p className="text-2xl font-black text-gray-600">
                      {member.name}
                    </p>
                    {/* Email del miembro */}
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                </div>

                {/* Menú de opciones para el miembro */}
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
                        <Menu.Item>
                          {/* 
                                                    Botón para eliminar el miembro del proyecto
                                                    Solo disponible para el manager
                                                    Texto en rojo para indicar acción destructiva
                                                */}
                          <button
                            type="button"
                            className="block px-3 py-1 text-sm leading-6 text-red-500"
                            onClick={() =>
                              mutate({ projectId, userId: member._id })
                            }
                          >
                            Eliminar del Proyecto
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          // Mensaje cuando no hay miembros en el equipo
          <p className="text-center py-20">No hay miembros en este equipo</p>
        )}

        {/* 
                Modal para agregar nuevos miembros al equipo
                Se muestra cuando hay query param ?addMember=true
                Incluye formulario de búsqueda por email
            */}
        <AddMemberModal />
      </>
    );
}
