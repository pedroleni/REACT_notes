import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import { TeamMemberForm } from "@/types/index";
import { findUserByEmail } from "@/api/TeamAPI";
import SearchResult from "./SearchResult";

/**
 * Componente de formulario para buscar y agregar miembros al equipo del proyecto
 * Permite buscar usuarios por email antes de agregarlos al equipo
 * Muestra diferentes estados: cargando, error o resultado de búsqueda
 * El resultado incluye información del usuario encontrado y opción para agregarlo
 */
export default function AddMemberForm() {
  // Valores iniciales del formulario (solo email)
  const initialValues: TeamMemberForm = {
    email: "",
  };

  // Obtiene el projectId desde los parámetros de la ruta
  const params = useParams();
  const projectId = params.projectId!;

  // Hook de React Hook Form para manejar el formulario
  // register: registra el campo de email
  // handleSubmit: maneja el envío del formulario
  // reset: limpia el formulario después de la búsqueda
  // formState.errors: contiene los errores de validación
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // Mutación para buscar un usuario por email
  // No tiene onSuccess/onError porque se maneja el estado directamente con mutation.data/error
  const mutation = useMutation({
    mutationFn: findUserByEmail,
  });

  /**
   * Maneja la búsqueda de usuario por email
   * Ejecuta la mutación para buscar si el email existe en el sistema
   * @param formData - Datos del formulario con el email a buscar
   */
  const handleSearchUser = async (formData: TeamMemberForm) => {
    // Prepara los datos combinando projectId y formData
    const data = { projectId, formData };
    // Ejecuta la mutación para buscar el usuario
    mutation.mutate(data);
  };

  /**
   * Reinicia tanto el formulario como el estado de la mutación
   * Se llama después de agregar exitosamente un usuario al equipo
   * Limpia el campo de email y oculta los resultados de búsqueda
   */
  const resetData = () => {
    reset(); // Limpia el formulario
    mutation.reset(); // Limpia el estado de la mutación (data, error, isPending)
  };

  return (
    <>
      {/* Formulario de búsqueda de usuario */}
      <form
        className="mt-10 space-y-5"
        onSubmit={handleSubmit(handleSearchUser)}
        noValidate
      >
        {/* Campo de email */}
        <div className="flex flex-col gap-3">
          <label className="font-normal text-2xl" htmlFor="name">
            E-mail de Usuario
          </label>
          <input
            id="name"
            type="text"
            placeholder="E-mail del usuario a Agregar"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              // Validación: campo obligatorio
              required: "El Email es obligatorio",
              // Validación: formato de email válido usando regex
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />

          {/* Muestra mensaje de error si el email está vacío o tiene formato inválido */}
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        {/* Botón de búsqueda */}
        <input
          type="submit"
          className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
          value="Buscar Usuario"
        />
      </form>

      {/* Contenedor de resultados con renderizado condicional según el estado de la mutación */}
      <div className="mt-10">
        {/* Estado de carga: mientras busca el usuario */}
        {mutation.isPending && <p className="text-center">Cargando...</p>}

        {/* Estado de error: si el email no existe o hay un error en la búsqueda */}
        {mutation.error && (
          <p className="text-center">{mutation.error.message}</p>
        )}

        {/* Estado de éxito: muestra el componente SearchResult con los datos del usuario encontrado */}
        {/* SearchResult incluye información del usuario y botón para agregarlo al equipo */}
        {mutation.data && (
          <SearchResult user={mutation.data} reset={resetData} />
        )}
      </div>
    </>
  );
}
