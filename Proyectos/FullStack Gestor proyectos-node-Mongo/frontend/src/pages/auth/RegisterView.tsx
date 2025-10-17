import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { createAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

/**
 * Vista de registro de nuevos usuarios
 * Permite crear una cuenta proporcionando nombre, email y contraseña
 * Después del registro, el usuario debe confirmar su cuenta con el código enviado por email
 *
 * Flujo de registro completo:
 * 1. Usuario llena el formulario (nombre, email, contraseña)
 * 2. Se valida que todos los campos sean correctos
 * 3. Se crea la cuenta en el servidor
 * 4. Usuario recibe email con código de confirmación de 6 dígitos
 * 5. Usuario va a /auth/confirm-account e ingresa el código
 * 6. Cuenta confirmada, puede ir a /auth/login para iniciar sesión
 */
export default function RegisterView() {
  // Valores iniciales del formulario (todos los campos vacíos)
  const initialValues: UserRegistrationForm = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  // Hook de React Hook Form para manejar el formulario
  // register: registra los campos del formulario
  // handleSubmit: maneja el envío del formulario
  // watch: observa cambios en el campo password para validar coincidencia
  // reset: limpia el formulario después de registro exitoso
  // formState.errors: contiene los errores de validación
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  // Mutación para crear la cuenta de usuario
  const { mutate } = useMutation({
    mutationFn: createAccount,
    // Se ejecuta si el email ya existe o hay error en la petición
    onError: (error) => {
      toast.error(error.message); // Ej: "El email ya está registrado"
    },
    // Se ejecuta cuando la cuenta se crea exitosamente
    onSuccess: (data) => {
      toast.success(data); // Mensaje: "Cuenta creada, revisa tu email para confirmar"
      reset(); // Limpia el formulario
      // Usuario debe ir a /auth/confirm-account para ingresar el código del email
    },
  });

  // Observa el campo password para validar que password_confirmation coincida
  const password = watch("password");

  /**
   * Maneja el envío del formulario de registro
   * @param formData - Objeto con nombre, email, password y password_confirmation
   */
  const handleRegister = (formData: UserRegistrationForm) => mutate(formData);

  return (
    <>
      {/* Título principal de la vista */}
      <h1 className="text-5xl font-black text-white text-center">
        Crear Cuenta
      </h1>

      {/* Instrucciones para el usuario */}
      <p className="text-2xl font-light text-white mt-5 text-center">
        Llena el formulario para {""}
        <span className=" text-fuchsia-500 font-bold"> crear tu cuenta</span>
      </p>

      {/* Formulario de registro */}
      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-8 p-10  bg-white mt-10"
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

        {/* Campo de nombre */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Nombre</label>
          <input
            type="name"
            placeholder="Nombre de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("name", {
              // Validación: campo obligatorio
              required: "El Nombre de usuario es obligatorio",
            })}
          />
          {/* Muestra mensaje de error si el nombre está vacío */}
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        {/* Campo de contraseña */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              // Validación: campo obligatorio
              required: "El Password es obligatorio",
              // Validación: longitud mínima de 8 caracteres
              minLength: {
                value: 8,
                message: "El Password debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {/* Muestra mensaje de error si el password está vacío o es muy corto */}
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
            className="w-full p-3  border-gray-300 border"
            {...register("password_confirmation", {
              // Validación: campo obligatorio
              required: "Repetir Password es obligatorio",
              // Validación personalizada: debe coincidir con el campo password
              // Usa watch("password") para comparar en tiempo real
              validate: (value) =>
                value === password || "Los Passwords no son iguales",
            })}
          />

          {/* Muestra mensaje de error si está vacío o no coincide con password */}
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        {/* Botón de envío */}
        <input
          type="submit"
          value="Registrarme"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      {/* Links de navegación a otras vistas de autenticación */}
      <nav className="mt-10 flex flex-col space-y-4">
        {/* Link para iniciar sesión si el usuario ya tiene cuenta */}
        <Link
          to={"/auth/login"}
          className="text-center text-gray-300 font-normal"
        >
          ¿Ya tienes cuenta? Iniciar Sesión
        </Link>

        {/* Link para recuperar contraseña si el usuario la olvidó */}
        <Link
          to={"/auth/forgot-password"}
          className="text-center text-gray-300 font-normal"
        >
          ¿Olvidaste tu contraseña? Reestablecer
        </Link>
      </nav>
    </>
  );
}
