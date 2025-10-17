import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { UpdateCurrentUserPasswordForm } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { changePassword } from "@/api/ProfileAPI";

/**
 * Vista para cambiar la contraseña del usuario autenticado
 * Requiere la contraseña actual como medida de seguridad
 * Permite ingresar y confirmar una nueva contraseña
 * Accesible desde el menú de perfil en /profile/password
 *
 * Diferencias con NewPasswordView (recuperar contraseña):
 * - Esta vista requiere estar autenticado
 * - Requiere contraseña actual para mayor seguridad
 * - No requiere token de recuperación
 * - Usuario no ha olvidado su contraseña, solo quiere cambiarla
 *
 * Flujo:
 * 1. Usuario autenticado va a /profile/password
 * 2. Ingresa contraseña actual (validación de seguridad)
 * 3. Ingresa nueva contraseña (mínimo 8 caracteres)
 * 4. Confirma nueva contraseña (deben coincidir)
 * 5. Contraseña actualizada exitosamente
 * 6. Usuario puede seguir usando la aplicación normalmente
 */
export default function ChangePasswordView() {
  // Valores iniciales del formulario (todos los campos vacíos)
  const initialValues: UpdateCurrentUserPasswordForm = {
    current_password: "",
    password: "",
    password_confirmation: "",
  };

  // Hook de React Hook Form para manejar el formulario
  // register: registra los 3 campos del formulario
  // handleSubmit: maneja el envío del formulario
  // watch: observa el campo password para validar que password_confirmation coincida
  // formState.errors: contiene los errores de validación
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // Mutación para cambiar la contraseña del usuario autenticado
  const { mutate } = useMutation({
    mutationFn: changePassword,
    // Se ejecuta si la contraseña actual es incorrecta o hay error
    onError: (error) => toast.error(error.message), // Ej: "Contraseña actual incorrecta"
    // Se ejecuta cuando la contraseña se cambia exitosamente
    onSuccess: (data) => toast.success(data), // Mensaje: "Contraseña actualizada correctamente"
  });

  // Observa el campo password para validar que password_confirmation coincida
  const password = watch("password");

  /**
   * Maneja el envío del formulario para cambiar la contraseña
   * @param formData - Objeto con current_password, password y password_confirmation
   */
  const handleChangePassword = (formData: UpdateCurrentUserPasswordForm) =>
    mutate(formData);

  return (
    <>
      <div className="mx-auto max-w-3xl">
        {/* Título principal de la vista */}
        <h1 className="text-5xl font-black ">Cambiar Password</h1>

        {/* Descripción del propósito del formulario */}
        <p className="text-2xl font-light text-gray-500 mt-5">
          Utiliza este formulario para cambiar tu password
        </p>

        {/* Formulario de cambio de contraseña */}
        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          noValidate
        >
          {/* Campo de contraseña actual (medida de seguridad) */}
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="current_password"
            >
              Password Actual
            </label>
            <input
              id="current_password"
              type="password"
              placeholder="Password Actual"
              className="w-full p-3  border border-gray-200"
              {...register("current_password", {
                // Validación: campo obligatorio
                // Importante: valida que el usuario conoce su contraseña actual
                required: "El password actual es obligatorio",
              })}
            />

            {/* Muestra mensaje de error si el campo está vacío */}
            {errors.current_password && (
              <ErrorMessage>{errors.current_password.message}</ErrorMessage>
            )}
          </div>

          {/* Campo de nueva contraseña */}
          <div className="mb-5 space-y-3">
            <label className="text-sm uppercase font-bold" htmlFor="password">
              Nuevo Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Nuevo Password"
              className="w-full p-3  border border-gray-200"
              {...register("password", {
                // Validación: campo obligatorio
                required: "El Nuevo Password es obligatorio",
                // Validación: longitud mínima de 8 caracteres
                minLength: {
                  value: 8,
                  message: "El Password debe ser mínimo de 8 caracteres",
                },
              })}
            />

            {/* Muestra mensaje de error si el campo está vacío o es muy corto */}
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>

          {/* Campo de confirmación de nueva contraseña */}
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-sm uppercase font-bold"
            >
              Repetir Password
            </label>

            <input
              id="password_confirmation"
              type="password"
              placeholder="Repetir Password"
              className="w-full p-3  border border-gray-200"
              {...register("password_confirmation", {
                // Validación: campo obligatorio
                required: "Este campo es obligatorio",
                // Validación personalizada: debe coincidir con el campo password
                // Usa watch("password") para comparar en tiempo real
                validate: (value) =>
                  value === password || "Los Passwords no son iguales",
              })}
            />

            {/* Muestra mensaje de error si está vacío o no coincide con password */}
            {errors.password_confirmation && (
              <ErrorMessage>
                {errors.password_confirmation.message}
              </ErrorMessage>
            )}
          </div>

          {/* Botón de envío */}
          <input
            type="submit"
            value="Cambiar Password"
            className="bg-fuchsia-600 w-full p-3 text-white uppercase font-bold hover:bg-fuchsia-700 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
