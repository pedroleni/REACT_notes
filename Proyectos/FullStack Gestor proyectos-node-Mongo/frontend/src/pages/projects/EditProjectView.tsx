import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectAPI";
import EditProjectForm from "@/components/projects/EditProjectForm";

/**
 * Vista para editar un proyecto existente
 * Carga los datos actuales del proyecto y los muestra en un formulario prellenado
 * Permite modificar nombre del proyecto, nombre del cliente y descripción
 *
 * Ruta: /projects/:projectId/edit
 *
 * Estados manejados:
 * - Loading: Muestra mensaje mientras carga los datos del proyecto
 * - Error: Redirige a /404 si el proyecto no existe o no hay permisos
 * - Success: Renderiza el formulario con los datos del proyecto
 *
 * Diferencias con CreateProjectView:
 * - Esta vista carga datos existentes del servidor
 * - Formulario viene prellenado con datos actuales
 * - Usa EditProjectForm que maneja la actualización
 * - CreateProjectView usa campos vacíos y crea un nuevo proyecto
 *
 * Componentes relacionados:
 * - EditProjectForm: Formulario que maneja la actualización
 * - ProjectForm: Componente reutilizable con los campos del formulario
 */
export default function EditProjectView() {
  // Obtiene el projectId desde los parámetros de la URL (/projects/:projectId/edit)
  const params = useParams();
  const projectId = params.projectId!;

  // Query de React Query para obtener los datos del proyecto a editar
  const { data, isLoading, isError } = useQuery({
    // Key única para identificar esta query en la cache
    // Incluye 'editProject' y el projectId específico
    queryKey: ["editProject", projectId],

    // Función que obtiene los datos del proyecto desde la API
    queryFn: () => getProjectById(projectId),

    // No reintenta si falla (para manejar 404 directamente)
    // Si el proyecto no existe, redirige inmediatamente a /404
    retry: false,
  });

  // Mientras se cargan los datos del proyecto, muestra mensaje de carga
  // Evita renderizar el formulario sin datos
  if (isLoading) return "Cargando...";

  // Si hay error al obtener el proyecto (no existe, sin permisos, etc.)
  // Redirige automáticamente a la página 404
  if (isError) return <Navigate to="/404" />;

  // Si los datos del proyecto están disponibles, renderiza el formulario de edición
  // Pasa los datos actuales y el projectId al componente EditProjectForm
  // EditProjectForm prellenará los campos con los datos actuales
  if (data) return <EditProjectForm data={data} projectId={projectId} />;
}
