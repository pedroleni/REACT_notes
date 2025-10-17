/**
 * Componente reutilizable para mostrar mensajes de error
 * Se utiliza en formularios para mostrar errores de validación
 * Aplica estilos consistentes: fondo rojo claro, texto rojo, texto en mayúsculas
 * @param children - Contenido del mensaje de error (texto del error a mostrar)
 *
 * @example
 * // Uso en formularios con React Hook Form
 * {errors.email && (
 *   <ErrorMessage>{errors.email.message}</ErrorMessage>
 * )}
 */
export default function ErrorMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="text-center my-4 bg-red-100 text-red-600 font-bold p-3 uppercase text-sm">
      {/* Renderiza el mensaje de error pasado como children */}
      {children}
    </div>
  );
}
