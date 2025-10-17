import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { authenticateUser } from "@/api/AuthAPI";
import { toast } from "react-toastify";

/**
 * Vista de inicio de sesión de la aplicación
 * Permite a usuarios registrados autenticarse con email y contraseña
 * Al iniciar sesión exitosamente, se guarda el token JWT en localStorage
 * y el usuario es redirigido al dashboard de proyectos
 *
 * Flujo de autenticación:
 * 1. Usuario ingresa email y contraseña
 * 2. Credenciales se envían al servidor
 * 3. Si son correctas, servidor retorna token JWT
 * 4. Token se guarda en localStorage (ver AuthAPI.ts)
 * 5. Usuario es redirigido a "/" (dashboard)
 * 6. AppLayout verifica el token y permite acceso
 */
export default function LoginView() {
  // Valores iniciales del formulario (campos vacíos)
  const initialValues: UserLoginForm = {
    email: "",
    password: "",
  };

  // Hook de React Hook Form para manejar el formulario
  // register: registra los campos de email y password
  // handleSubmit: maneja el envío del formulario
  // formState.errors: contiene los errores de validación
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  // Hook para navegar al dashboard después de login exitoso
  const navigate = useNavigate();

  // Mutación para autenticar al usuario
  const { mutate } = useMutation({
    mutationFn: authenticateUser,
    // Se ejecuta si las credenciales son incorrectas o hay error
    onError: (error) => {
      toast.error(error.message); // Muestra error: "Credenciales incorrectas"
    },
    // Se ejecuta cuando el login es exitoso
    onSuccess: () => {
      // El token ya fue guardado en localStorage por authenticateUser
      // Redirige al dashboard de proyectos
      navigate("/");
      // AppLayout detectará el token y mostrará la aplicación
    },
  });

  /**
   * Maneja el envío del formulario de login
   * @param formData - Objeto con email y password del usuario
   */
  const handleLogin = (formData: UserLoginForm) => mutate(formData);

  return (
    <>
      {/* Título principal de la vista */}
      <h1 className="text-5xl text-center font-black text-white">
        Iniciar Sesión
      </h1>

      {/* Descripción y bienvenida */}
      <p className="text-2xl font-light text-white mt-5 text-center">
        Comienza a planear tus proyectos {""}
        <span className=" text-fuchsia-500 font-bold text-center">
          {" "}
          iniciando sesión en este formulario
        </span>
      </p>

      {/* Formulario de login */}
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="space-y-8 p-10 mt-10 bg-white"
        noValidate
      >
        {/* Campo de email */}
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
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
            })}
          />

          {/* Muestra mensaje de error si la contraseña está vacía */}
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        {/* Botón de envío */}
        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>

      {/* Links de navegación a otras vistas de autenticación */}
      <nav className="mt-10 flex flex-col space-y-4">
        {/* Link para crear una nueva cuenta */}
        <Link
          to={"/auth/register"}
          className="text-center text-gray-300 font-normal"
        >
          ¿No tienes cuenta? Crear Una
        </Link>

        {/* Link para recuperar contraseña olvidada */}
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
