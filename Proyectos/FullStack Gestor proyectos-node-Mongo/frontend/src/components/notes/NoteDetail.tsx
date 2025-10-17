import { deleteNote } from "@/api/NoteAPI";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Props del componente
type NoteDetailProps = {
  note: Note; // Objeto con la información completa de la nota a mostrar
};

/**
 * Componente que muestra los detalles de una nota individual
 * Incluye el contenido, autor, fecha de creación y opción de eliminar
 * Solo el autor de la nota puede eliminarla
 * @param note - Objeto con los datos de la nota (contenido, autor, fecha)
 */
export default function NoteDetail({ note }: NoteDetailProps) {
  // Hook personalizado para obtener los datos del usuario autenticado
  const { data, isLoading } = useAuth();

  // Memoriza el resultado de comparar si el usuario actual es el creador de la nota
  // useMemo evita recalcular en cada render, solo cuando cambian data o note
  // canDelete será true solo si el usuario autenticado es quien creó la nota
  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);

  // Hook para obtener parámetros de la URL (projectId)
  const params = useParams();

  // Hook para obtener información de la ubicación actual (query params)
  const location = useLocation();

  // Crea un objeto para acceder a los query params
  const queryParams = new URLSearchParams(location.search);

  // Obtiene el ID del proyecto desde los parámetros de la ruta
  const projectId = params.projectId!;

  // Obtiene el ID de la tarea desde los query params
  const taskId = queryParams.get("viewTask")!;

  // Cliente de React Query para invalidar la cache después de eliminar
  const queryClient = useQueryClient();

  // Mutación para eliminar la nota
  const { mutate } = useMutation({
    mutationFn: deleteNote,
    // Se ejecuta cuando hay un error al eliminar
    onError: (error) => toast.error(error.message),
    // Se ejecuta cuando la nota se elimina exitosamente
    onSuccess: (data) => {
      toast.success(data); // Muestra mensaje de éxito
      // Invalida la query de la tarea para refrescar y eliminar la nota de la UI
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  // Muestra mensaje de carga mientras se obtiene la información del usuario
  if (isLoading) return "Cargando...";

  return (
    <div className="p-3 flex justify-between items-center">
      {/* Información de la nota */}
      <div>
        {/* Contenido de la nota y nombre del autor */}
        <p>
          {note.content} por:{" "}
          <span className="font-bold">{note.createdBy.name}</span>
        </p>

        {/* Fecha de creación formateada */}
        <p className="text-xs text-slate-500">{formatDate(note.createdAt)}</p>
      </div>

      {/* Botón de eliminar - solo visible para el creador de la nota */}
      {canDelete && (
        <button
          type="button"
          className="bg-red-400 hover:bg-red-500 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
          onClick={() => mutate({ projectId, taskId, noteId: note._id })}
        >
          Eliminar
        </button>
      )}
    </div>
  );
}
