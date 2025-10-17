import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { ConfirmToken } from "@/types/index";
import { validateToken } from "@/api/AuthAPI";
import { toast } from "react-toastify";

// Props del componente
type NewPasswordTokenProps = {
  token: ConfirmToken["token"]; // Token actual (código de 6 dígitos)
  setToken: React.Dispatch<React.SetStateAction<string>>; // Función para actualizar el token
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>; // Función para marcar el token como válido
};

/**
 * Componente que muestra un formulario de entrada de PIN para validar el token de 6 dígitos
 * Se utiliza en el flujo de recuperación de contraseña después de solicitar el código
 * @param token - Código actual de 6 dígitos ingresado por el usuario
 * @param setToken - Función para actualizar el estado del token mientras el usuario escribe
 * @param setIsValidToken - Función para cambiar el estado cuando el token es validado correctamente
 */
export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  // Mutación de React Query para validar el token con el servidor
  const { mutate } = useMutation({
    mutationFn: validateToken,
    // Se ejecuta cuando el token es inválido o hay un error
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando el token es válido
    onSuccess: (data) => {
      toast.success(data); // Muestra mensaje de éxito
      setIsValidToken(true); // Marca el token como válido para continuar al siguiente paso
    },
  });

  /**
   * Maneja los cambios mientras el usuario escribe el código
   * Se ejecuta cada vez que se ingresa un dígito
   * @param token - Código parcial o completo ingresado
   */
  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };

  /**
   * Maneja la finalización del código de 6 dígitos
   * Se ejecuta automáticamente cuando se completan los 6 dígitos
   * @param token - Código completo de 6 dígitos para validar
   */
  const handleComplete = (token: ConfirmToken["token"]) => mutate({ token });

  return (
    <>
      <form className="space-y-8 p-10 rounded-lg bg-white mt-10">
        {/* Etiqueta del campo */}
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>

        {/* Input de PIN de 6 dígitos usando Chakra UI */}
        <div className="flex justify-center gap-5">
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            {/* Cada PinInputField representa un dígito individual */}
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="h-10 w-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
          </PinInput>
        </div>
      </form>

      {/* Enlace para solicitar un nuevo código si no llegó o expiró */}
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
