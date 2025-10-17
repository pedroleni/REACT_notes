import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFullProject } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useMemo } from "react";

/**
 * Vista principal de detalles y gestión de un proyecto
 * Muestra toda la información del proyecto y permite gestionar tareas
 * Es la vista central donde se realiza la mayor parte del trabajo del proyecto
 *
 * Ruta: /projects/:projectId
 *
 * Funcionalidades principales:
 * - Visualiza información del proyecto (nombre, descripción)
 * - Muestra tablero kanban con todas las tareas organizadas por estado
 * - Permite agregar, editar, eliminar y cambiar estado de tareas (si es manager)
 * - Acceso a gestión de colaboradores del equipo (solo manager)
 * - Sistema de drag and drop para cambiar estado de tareas
 * - Modales para crear, editar y ver detalles de tareas
 *
 * Control de permisos:
 * - Manager del proyecto: Acceso completo (CRUD tareas, gestionar equipo)
 * - Miembros del equipo: Solo visualización y cambio de estado de tareas
 * - Usuarios sin acceso: Redirigidos a 404
 */
export default function ProjectDetailsView() {
  // Hook para obtener los datos del usuario autenticado
  const { data: user, isLoading: authLoading } = useAuth();

  // Hook para navegar y abrir modales mediante query params
  const navigate = useNavigate();

  // Obtiene el projectId desde los parámetros de la URL (/projects/:projectId)
  const params = useParams();
  const projectId = params.projectId!;

  // Query para obtener los datos completos del proyecto
  // Incluye: información básica, todas las tareas y lista de miembros del equipo
  const { data, isLoading, isError } = useQuery({
    // Key única para identificar esta query en la cache
    // Se invalida cuando se crean, actualizan o eliminan tareas
    queryKey: ["project", projectId],

    // Función que obtiene el proyecto completo con todas sus relaciones
    queryFn: () => getFullProject(projectId),

    // No reintenta si falla (para manejar 404 y permisos rápidamente)
    retry: false,
  });

  /**
   * Memoriza si el usuario actual es el manager del proyecto
   * Solo se recalcula cuando cambian los datos del proyecto o del usuario
   * canEdit determina si el usuario puede realizar acciones de edición/eliminación
   */
  const canEdit = useMemo(() => data?.manager === user?._id, [data, user]);

  // Mientras se cargan tanto el proyecto como la autenticación, muestra mensaje
  if (isLoading && authLoading) return "Cargando...";

  // Si hay error al obtener el proyecto (no existe, sin permisos, etc.)
  // Redirige automáticamente a la página 404
  if (isError) return <Navigate to="/404" />;

  // Si se cargaron correctamente tanto el proyecto como el usuario
  if (data && user)
    return (
      <>
        {/* Información del proyecto */}
        {/* Título del proyecto */}
        <h1 className="text-5xl font-black">{data.projectName}</h1>

        {/* Descripción del proyecto */}
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.description}
        </p>

        {/* 
                Botones de acción - Solo visibles para el manager del proyecto
                isManager es una función helper que verifica permisos
            */}
        {isManager(data.manager, user._id) && (
          <nav className="my-5 flex gap-3">
            {/* Botón para abrir modal de crear nueva tarea */}
            <button
              type="button"
              className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
              // Agrega query param ?newTask=true para abrir el modal
              onClick={() => navigate(location.pathname + "?newTask=true")}
            >
              Agregar Tarea
            </button>

            {/* Link para ir a la gestión del equipo del proyecto */}
            <Link
              to={"team"}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            >
              Colaboradores
            </Link>
          </nav>
        )}

        {/* 
                Tablero kanban con todas las tareas del proyecto
                Muestra 5 columnas por estado: pending, onHold, inProgress, underReview, completed
                Implementa drag and drop para cambiar estado de tareas
                canEdit determina si se muestran opciones de editar/eliminar en cada tarea
            */}
        <TaskList tasks={data.tasks} canEdit={canEdit} />

        {/* 
                Modales que se renderizan condicionalmente según query params
                Estos componentes están siempre en el DOM pero solo se muestran cuando:
            */}

        {/* Modal para crear nueva tarea - Se muestra con ?newTask=true */}
        <AddTaskModal />

        {/* Modal para editar tarea existente - Se muestra con ?editTask=taskId */}
        <EditTaskData />

        {/* Modal para ver detalles de una tarea - Se muestra con ?viewTask=taskId */}
        <TaskModalDetails />
      </>
    );
}
