import { useState } from "react";
import { Link } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useMutation } from "@tanstack/react-query";
import { ConfirmToken } from "@/types/index";
import { confirmAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

/**
 * Vista para confirmar la cuenta de un nuevo usuario
 * El usuario debe ingresar un código de 6 dígitos que recibió por email
 * Al completar el código, se valida automáticamente con el servidor
 * Si es válido, la cuenta queda confirmada y el usuario puede iniciar sesión
 *
 * Flujo de confirmación:
 * 1. Usuario se registra en /auth/register
 * 2. Recibe email con código de 6 dígitos
 * 3. Ingresa el código en esta vista
 * 4. Al completar, se valida automáticamente
 * 5. Si es correcto → cuenta confirmada, puede hacer login
 * 6. Si es incorrecto → mensaje de error, puede solicitar nuevo código
 */
export default function ConfirmAccountView() {
  // Estado local para almacenar el código de confirmación mientras el usuario lo escribe
  const [token, setToken] = useState<ConfirmToken["token"]>("");

  // Mutación para confirmar la cuenta enviando el código al servidor
  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    // Se ejecuta si el código es inválido o hay error en la petición
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta si el código es válido y la cuenta se confirma exitosamente
    onSuccess: (data) => {
      toast.success(data);
      // El usuario puede ahora ir a /auth/login para iniciar sesión
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
   * Se ejecuta automáticamente cuando el usuario completa los 6 dígitos
   * Envía el código al servidor para validación inmediata
   * @param token - Código completo de 6 dígitos para confirmar la cuenta
   */
  const handleComplete = (token: ConfirmToken["token"]) => mutate({ token });

  return (
    <>
      {/* Título principal de la vista */}
      <h1 className="text-5xl font-black text-white text-center">
        Confirma tu Cuenta
      </h1>

      {/* Instrucciones para el usuario */}
      <p className="text-2xl font-light text-white mt-5 text-center">
        Ingresa el código que recibiste {""}
        <span className=" text-fuchsia-500 font-bold"> por e-mail</span>
      </p>

      {/* Formulario con el input de código de 6 dígitos */}
      <form className="space-y-8 p-10  bg-white mt-10">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>

        {/* 
          PinInput de Chakra UI para entrada de código
          Cada dígito se ingresa en un campo separado
          Al completar los 6 dígitos, handleComplete se ejecuta automáticamente
        */}
        <div className="flex justify-center gap-5">
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            {/* Cada PinInputField representa un dígito del código */}
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
          </PinInput>
        </div>
      </form>

      {/* Link para solicitar un nuevo código si el actual expiró o no llegó */}
      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/request-code"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
