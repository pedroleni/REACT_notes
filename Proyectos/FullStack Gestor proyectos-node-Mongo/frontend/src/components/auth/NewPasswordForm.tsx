import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import type { ConfirmToken, NewPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { updatePasswordWithToken } from "@/api/AuthAPI";
import { toast } from "react-toastify";

// Props del componente
type NewPasswordFormProps = {
  token: ConfirmToken["token"]; // Token de validación para restablecer contraseña
};

/**
 * Componente de formulario para establecer una nueva contraseña
 * Se utiliza en el flujo de recuperación de contraseña después de validar el token
 * @param token - Token de confirmación recibido por email para validar la petición
 */
export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  // Hook de navegación para redirigir después de cambiar la contraseña
  const navigate = useNavigate();

  // Valores iniciales del formulario (campos vacíos)
  const initialValues: NewPasswordForm = {
    password: "",
    password_confirmation: "",
  };

  // Hook de React Hook Form para manejar el formulario
  // register: registra los inputs en el formulario
  // handleSubmit: maneja el envío del formulario
  // watch: observa cambios en los campos (usado para validar que las contraseñas coincidan)
  // reset: reinicia el formulario a sus valores iniciales
  // formState.errors: contiene los errores de validación
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // Mutación de React Query para actualizar la contraseña
  const { mutate } = useMutation({
    mutationFn: updatePasswordWithToken,
    // Se ejecuta cuando hay un error en la petición
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando la petición es exitosa
    onSuccess: (data) => {
      toast.success(data); // Muestra mensaje de éxito
      reset(); // Limpia el formulario
      navigate("/auth/login"); // Redirige al login
    },
  });

  /**
   * Maneja el envío del formulario para establecer nueva contraseña
   * @param formData - Datos del formulario con la nueva contraseña y su confirmación
   */
  const handleNewPassword = (formData: NewPasswordForm) => {
    // Prepara los datos incluyendo el token de validación
    const data = {
      formData,
      token,
    };

    // Ejecuta la mutación para actualizar la contraseña
    mutate(data);
  };

  // Observa el campo password para validar que coincida con password_confirmation
  const password = watch("password");

  return (
    <>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className="space-y-8 p-10 bg-white mt-10"
        noValidate
      >
        {/* Campo de contraseña */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: "El Password debe ser mínimo de 8 caracteres",
              },
            })}
          />

          {/* Muestra error si existe validación fallida */}
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        {/* Campo de confirmación de contraseña */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Repetir Password</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full p-3 border-gray-300 border"
            {...register("password_confirmation", {
              required: "Repetir Password es obligatorio",
              // Valida que ambas contraseñas coincidan
              validate: (value) =>
                value === password || "Los Passwords no son iguales",
            })}
          />

          {/* Muestra error si existe validación fallida */}
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        {/* Botón de envío */}
        <input
          type="submit"
          value="Establecer Password"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 text-white font-black text-xl cursor-pointer"
        />
      </form>
    </>
  );
}
