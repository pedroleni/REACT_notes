import { useDroppable } from "@dnd-kit/core";

// Props del componente
type DropTaskProps = {
  status: string; // Estado de la tarea (ej: 'pending', 'onHold', 'inProgress', 'underReview', 'completed')
};

/**
 * Componente de zona droppable para el sistema de drag and drop de tareas
 * Permite soltar tareas arrastrables para cambiar su estado
 * Usa @dnd-kit/core para detectar cuando una tarea se arrastra sobre esta zona
 * Cambia visualmente (opacidad) cuando una tarea está sobre ella
 * @param status - Estado al que cambiará la tarea cuando se suelte aquí
 */
export default function DropTask({ status }: DropTaskProps) {
  // Hook de @dnd-kit para hacer este componente una zona droppable
  // isOver: boolean que indica si hay un elemento siendo arrastrado sobre esta zona
  // setNodeRef: ref que se debe asignar al elemento DOM para que sea droppable
  const { isOver, setNodeRef } = useDroppable({
    // ID único de la zona droppable, corresponde al estado de la tarea
    // Este ID se usa para identificar donde se soltó la tarea
    id: status,
  });

  // Estilo dinámico que cambia la opacidad cuando una tarea está sobre la zona
  // Si isOver es true, la opacidad es 0.4 (más transparente)
  // Si isOver es false, la opacidad es undefined (valor por defecto)
  const style = {
    opacity: isOver ? 0.4 : undefined,
  };

  return (
    <div
      style={style} // Aplica el estilo dinámico de opacidad
      ref={setNodeRef} // Ref necesaria para que @dnd-kit detecte esta zona
      className="text-xs font-semibold uppercase p-2 border border-dashed border-slate-500 mt-5 grid place-content-center text-slate-500"
    >
      Soltar tarea aquí
    </div>
  );
}
