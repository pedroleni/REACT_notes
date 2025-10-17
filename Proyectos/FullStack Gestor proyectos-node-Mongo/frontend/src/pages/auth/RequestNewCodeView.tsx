import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { RequestConfirmationCodeForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { requestConfirmationCode } from "@/api/AuthAPI";
import { toast } from "react-toastify";

/**
 * Vista para solicitar un nuevo código de confirmación de cuenta
 * Permite a usuarios que no recibieron o perdieron su código inicial
 * solicitar uno nuevo ingresando su email registrado
 *
 * Casos de uso:
 * - El código inicial nunca llegó al email
 * - El código inicial expiró (generalmente tienen validez limitada)
 * - El usuario borró el email con el código
 * - El usuario se registró pero no confirmó su cuenta a tiempo
 *
 * Flujo:
 * 1. Usuario ingresa su email registrado
 * 2. Sistema verifica que el email existe y la cuenta no está confirmada
 * 3. Se genera y envía un nuevo código de 6 dígitos por email
 * 4. Usuario va a /auth/confirm-account e ingresa el nuevo código
 * 5. Cuenta confirmada, puede iniciar sesión
 */
export default function RegisterView() {
  // Valores iniciales del formulario (solo campo email)
  const initialValues: RequestConfirmationCodeForm = {
    email: "",
  };

  // Hook de React Hook Form para manejar el formulario
  // register: registra el campo de email
  // handleSubmit: maneja el envío del formulario
  // formState.errors: contiene los errores de validación
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // Mutación para solicitar un nuevo código de confirmación
  const { mutate } = useMutation({
    mutationFn: requestConfirmationCode,
    // Se ejecuta si el email no existe o la cuenta ya está confirmada
    onError: (error) => {
      toast.error(error.message); // Ej: "El email no está registrado" o "La cuenta ya está confirmada"
    },
    // Se ejecuta cuando se envía exitosamente el nuevo código
    onSuccess: (data) => {
      toast.success(data); // Mensaje: "Código enviado, revisa tu email"
      // Usuario debe ir a /auth/confirm-account para ingresar el nuevo código
    },
  });

  /**
   * Maneja el envío del formulario para solicitar nuevo código
   * @param formData - Objeto con el email del usuario
   */
  const handleRequestCode = (formData: RequestConfirmationCodeForm) =>
    mutate(formData);

  return (
    <>
      {/* Título principal de la vista */}
      <h1 className="text-5xl font-black text-white">
        Solicitar Código de Confirmación
      </h1>

      {/* Instrucciones para el usuario */}
      <p className="text-2xl font-light text-white mt-5">
        Coloca tu e-mail para recibir {""}
        <span className=" text-fuchsia-500 font-bold"> un nuevo código</span>
      </p>

      {/* Formulario para solicitar nuevo código */}
      <form
        onSubmit={handleSubmit(handleRequestCode)}
        className="space-y-8 p-10 rounded-lg bg-white mt-10"
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
            className="w-full p-3 rounded-lg border-gray-300 border"
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
          value="Enviar Código"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3 rounded-lg text-white font-black  text-xl cursor-pointer"
        />
      </form>

      {/* Links de navegación a otras vistas de autenticación */}
      <nav className="mt-10 flex flex-col space-y-4">
        {/* Link para iniciar sesión si el usuario ya confirmó su cuenta */}
        <Link
          to="/auth/login"
          className="text-center text-gray-300 font-normal"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>

        {/* Link para recuperar contraseña si el usuario la olvidó */}
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-300 font-normal"
        >
          ¿Olvidaste tu contraseña? Reestablecer
        </Link>
      </nav>
    </>
  );
}
