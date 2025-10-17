import { Task } from "@/types/index";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";

// Props del componente
type NotesPanelProps = {
  notes: Task["notes"]; // Array de notas asociadas a una tarea específica
};

/**
 * Componente panel que muestra todas las notas de una tarea
 * Incluye un formulario para agregar nuevas notas y la lista de notas existentes
 * Si no hay notas, muestra un mensaje indicando que la lista está vacía
 * @param notes - Array de notas de la tarea a mostrar
 */
export default function NotesPanel({ notes }: NotesPanelProps) {
  return (
    <>
      {/* Formulario para crear nuevas notas */}
      <AddNoteForm />

      {/* Contenedor de la lista de notas con divisores entre cada nota */}
      <div className="divide-y divide-gray-100 mt-10">
        {/* Renderizado condicional: muestra notas si existen, sino muestra mensaje vacío */}
        {notes.length ? (
          <>
            {/* Título de la sección de notas */}
            <p className="font-bold text-2xl text-slate-600 my-5">Notas:</p>

            {/* Itera sobre el array de notas y renderiza cada una */}
            {notes.map((note) => (
              <NoteDetail key={note._id} note={note} />
            ))}
          </>
        ) : (
          /* Mensaje cuando no hay notas en la tarea */
          <p className="text-gray-500 text-center pt-3">No hay notas</p>
        )}
      </div>
    </>
  );
}
