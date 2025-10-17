import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { User, UserProfileForm } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/ProfileAPI";
import { toast } from "react-toastify";

// Props del componente
type ProfileFormProps = {
  data: User; // Datos actuales del usuario para prellenar el formulario
};

/**
 * Componente de formulario para editar el perfil del usuario
 * Permite actualizar el nombre y email del usuario autenticado
 * Los campos se prellenan con los datos actuales del usuario
 * @param data - Objeto con la información actual del usuario (nombre, email, etc.)
 */
export default function ProfileForm({ data }: ProfileFormProps) {
  // Hook de React Hook Form para manejar el formulario
  // register: registra los inputs del formulario
  // handleSubmit: maneja el envío del formulario
  // formState.errors: contiene los errores de validación
  // defaultValues: prellenar el formulario con los datos actuales del usuario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileForm>({ defaultValues: data });

  // Cliente de React Query para invalidar la cache y refrescar los datos del usuario
  const queryClient = useQueryClient();

  // Mutación para actualizar el perfil del usuario
  const { mutate } = useMutation({
    mutationFn: updateProfile,
    // Se ejecuta cuando hay un error al actualizar el perfil
    onError: (error) => toast.error(error.message),
    // Se ejecuta cuando el perfil se actualiza exitosamente
    onSuccess: (data) => {
      toast.success(data); // Muestra mensaje de éxito
      // Invalida la query del usuario para refrescar sus datos en toda la aplicación
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  /**
   * Maneja el envío del formulario para actualizar el perfil
   * @param formData - Datos del formulario con el nombre y email actualizados
   */
  const handleEditProfile = (formData: UserProfileForm) => mutate(formData);

  return (
    <>
      <div className="mx-auto max-w-3xl g">
        {/* Encabezado de la sección */}
        <h1 className="text-5xl font-black ">Mi Perfil</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Aquí puedes actualizar tu información
        </p>

        {/* Formulario de edición de perfil */}
        <form
          onSubmit={handleSubmit(handleEditProfile)}
          className=" mt-14 space-y-5  bg-white shadow-lg p-10 rounded-l"
          noValidate
        >
          {/* Campo de nombre */}
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              placeholder="Tu Nombre"
              className="w-full p-3  border border-gray-200"
              {...register("name", {
                required: "Nombre de usuario es obligatoro",
              })}
            />

            {/* Muestra error si el nombre está vacío */}
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>

          {/* Campo de email */}
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="password">
              E-mail
            </label>
            <input
              id="text"
              type="email"
              placeholder="Tu Email"
              className="w-full p-3  border border-gray-200"
              {...register("email", {
                required: "EL e-mail es obligatorio",
                // Validación de formato de email con expresión regular
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "E-mail no válido",
                },
              })}
            />

            {/* Muestra error si el email está vacío o tiene formato inválido */}
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>

          {/* Botón de envío */}
          <input
            type="submit"
            value="Guardar Cambios"
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
