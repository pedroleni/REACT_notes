import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { forgotPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";

/**
 * Vista para recuperar contraseña olvidada
 * El usuario ingresa su email y recibe instrucciones por correo para restablecer su contraseña
 *
 * Flujo de recuperación de contraseña:
 * 1. Usuario ingresa su email registrado en esta vista
 * 2. Sistema envía email con token de recuperación
 * 3. Usuario hace clic en el link del email
 * 4. Es redirigido a /auth/new-password?token=xxx
 * 5. Ingresa nueva contraseña
 * 6. Puede iniciar sesión con la nueva contraseña
 */
export default function ForgotPasswordView() {
  // Valores iniciales del formulario (solo campo email)
  const initialValues: ForgotPasswordForm = {
    email: "",
  };

  // Hook de React Hook Form para manejar el formulario
  // register: registra el campo de email
  // handleSubmit: maneja el envío del formulario
  // reset: limpia el formulario después de enviar exitosamente
  // formState.errors: contiene los errores de validación
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  // Mutación para solicitar el restablecimiento de contraseña
  const { mutate } = useMutation({
    mutationFn: forgotPassword,
    // Se ejecuta si el email no existe o hay error en la petición
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta si el email existe y se envían las instrucciones exitosamente
    onSuccess: (data) => {
      toast.success(data); // Mensaje: "Revisa tu email para instrucciones"
      reset(); // Limpia el campo de email
    },
  });

  /**
   * Maneja el envío del formulario para solicitar recuperación de contraseña
   * @param formData - Objeto con el email del usuario
   */
  const handleForgotPassword = (formData: ForgotPasswordForm) =>
    mutate(formData);

  return (
    <>
      {/* Título principal de la vista */}
      <h1 className="text-5xl font-black text-white text-center">
        Reestablecer Password
      </h1>

      {/* Instrucciones para el usuario */}
      <p className="text-2xl font-light text-white mt-5 text-center">
        ¿Olvidaste tu password? coloca tu email {""}
        <span className=" text-fuchsia-500 font-bold">
          {" "}
          y reestable tu password
        </span>
      </p>

      {/* Formulario de recuperación de contraseña */}
      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className="space-y-8 p-10 mt-10 bg-white"
        noValidate
      >
        {/* Campo de email */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              // Validación: campo obligatorio
              required: "El Email de registro es obligatorio",
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

        {/* Botón de envío */}
        <input
          type="submit"
          value="Enviar Instrucciones"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      {/* Links de navegación a otras vistas de autenticación */}
      <nav className="mt-10 flex flex-col space-y-4">
        {/* Link para volver al login si el usuario recuerda su contraseña */}
        <Link
          to="/auth/login"
          className="text-center text-gray-300 font-normal"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>

        {/* Link para crear una cuenta si el usuario no está registrado */}
        <Link
          to="/auth/register"
          className="text-center text-gray-300 font-normal"
        >
          ¿No tienes cuenta? Crea una
        </Link>
      </nav>
    </>
  );
}
