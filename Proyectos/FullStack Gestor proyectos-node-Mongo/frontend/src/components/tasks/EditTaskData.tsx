import { Navigate, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/api/TaskAPI";
import EditTaskModal from "./EditTaskModal";

/**
 * Componente contenedor que obtiene los datos de una tarea para editar
 * Se activa cuando existe el query param '?editTask=taskId' en la URL
 * Obtiene los datos de la tarea desde el servidor y los pasa al modal de edición
 * Si hay error al cargar la tarea, redirige a la página 404
 */
export default function EditTaskData() {
  // Obtiene el projectId desde los parámetros de la ruta (/projects/:projectId)
  const params = useParams();
  const projectId = params.projectId!;

  // Obtiene la ubicación actual para leer query params
  const location = useLocation();

  // Extrae los query params de la URL
  const queryParams = new URLSearchParams(location.search);

  // Obtiene el ID de la tarea a editar desde el query param (?editTask=123)
  const taskId = queryParams.get("editTask")!;

  // Query de React Query para obtener los datos de la tarea específica
  const { data, isError } = useQuery({
    // Key única para identificar esta query en la cache
    queryKey: ["task", taskId],
    // Función que obtiene los datos de la tarea desde la API
    queryFn: () => getTaskById({ projectId, taskId }),
    // Solo ejecuta la query si taskId existe (evita llamadas innecesarias)
    enabled: !!taskId,
  });

  // Si hay error al obtener la tarea (no existe, permisos, etc.), redirige a 404
  if (isError) return <Navigate to={"/404"} />;

  // Si los datos se cargaron exitosamente, renderiza el modal de edición
  // Pasa los datos de la tarea y el taskId al modal
  if (data) return <EditTaskModal data={data} taskId={taskId} />;
}
