import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamMember } from "@/types/index";
import { addUserToProject } from "@/api/TeamAPI";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

// Props del componente
type SearchResultProps = {
  user: TeamMember; // Datos del usuario encontrado en la búsqueda
  reset: () => void; // Función para limpiar el formulario y resultados después de agregar
};

/**
 * Componente que muestra el resultado de la búsqueda de usuario
 * Muestra el nombre del usuario encontrado y un botón para agregarlo al equipo
 * Al agregar exitosamente, limpia los resultados, cierra el modal y actualiza la lista del equipo
 * @param user - Objeto con los datos del usuario encontrado (nombre, email, id)
 * @param reset - Función callback para limpiar el formulario de búsqueda
 */
export default function SearchResult({ user, reset }: SearchResultProps) {
  // Hook para navegar y cerrar el modal después de agregar
  const navigate = useNavigate();

  // Obtiene el projectId desde los parámetros de la ruta
  const params = useParams();
  const projectId = params.projectId!;

  // Cliente de React Query para invalidar la cache después de agregar
  const queryClient = useQueryClient();

  // Mutación para agregar el usuario al equipo del proyecto
  const { mutate } = useMutation({
    mutationFn: addUserToProject,
    // Se ejecuta cuando hay un error al agregar (usuario ya es miembro, sin permisos, etc.)
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando el usuario se agrega exitosamente al equipo
    onSuccess: (data) => {
      toast.success(data); // Muestra mensaje de éxito
      reset(); // Limpia el formulario de búsqueda y oculta los resultados
      // Cierra el modal navegando a la misma ruta sin query params
      navigate(location.pathname, { replace: true });
      // Invalida la query del equipo del proyecto para refrescar la lista de miembros
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    },
  });

  /**
   * Maneja el click en el botón "Agregar al Proyecto"
   * Prepara los datos necesarios y ejecuta la mutación para agregar el usuario
   */
  const handleAddUserToProject = () => {
    // Prepara los datos combinando projectId y el ID del usuario
    const data = {
      projectId,
      id: user._id,
    };

    // Ejecuta la mutación para agregar el usuario al equipo
    mutate(data);
  };

  return (
    <>
      {/* Título de la sección de resultados */}
      <p className="mt-10 text-center font-bold">Resultado:</p>

      {/* Contenedor del resultado con información del usuario y botón de acción */}
      <div className="flex justify-between items-center">
        {/* Nombre del usuario encontrado */}
        <p>{user.name}</p>

        {/* Botón para agregar el usuario al equipo del proyecto */}
        <button
          className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
          onClick={handleAddUserToProject}
        >
          Agregar al Proyecto
        </button>
      </div>
    </>
  );
}
