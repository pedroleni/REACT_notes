import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";

/**
 * Vista para restablecer contraseña olvidada (segundo paso del proceso)
 * Maneja el flujo de dos pasos para cambiar la contraseña:
 *
 * Paso 1: Validar token de 6 dígitos
 * - Usuario ingresa el código recibido por email
 * - Se valida el token con el servidor
 * - Si es válido, se muestra el formulario de nueva contraseña
 *
 * Paso 2: Ingresar nueva contraseña
 * - Usuario ingresa su nueva contraseña
 * - Se confirma la contraseña
 * - Se actualiza en el servidor con el token validado
 *
 * Flujo completo de recuperación:
 * 1. Usuario va a /auth/forgot-password e ingresa su email
 * 2. Recibe email con token de 6 dígitos
 * 3. Usuario llega a esta vista (/auth/new-password)
 * 4. Ingresa el token de 6 dígitos (NewPasswordToken)
 * 5. Si el token es válido, se muestra el formulario (NewPasswordForm)
 * 6. Ingresa y confirma su nueva contraseña
 * 7. Contraseña actualizada, puede ir a /auth/login
 */
export default function NewPasswordView() {
  // Estado local para almacenar el token de 6 dígitos mientras se escribe y valida
  const [token, setToken] = useState<ConfirmToken["token"]>("");

  // Estado local para controlar si el token ha sido validado exitosamente
  // false: Muestra el componente para ingresar y validar el token
  // true: Muestra el formulario para ingresar la nueva contraseña
  const [isValidToken, setIsValidToken] = useState(false);

  return (
    <>
      {/* Título principal de la vista */}
      <h1 className="text-5xl font-black text-white text-center">
        Reestablecer Password
      </h1>

      {/* Instrucciones para el usuario */}
      <p className="text-2xl font-light text-white mt-5 text-center">
        Ingresa el código que recibiste {""}
        <span className=" text-fuchsia-500 font-bold">por email</span>
      </p>

      {/* 
        Renderizado condicional basado en si el token ya fue validado
        
        Si isValidToken es false (token no validado aún):
        - Muestra NewPasswordToken: componente con PinInput de 6 dígitos
        - Usuario ingresa el código recibido por email
        - Al completar, se valida automáticamente con el servidor
        - Si es válido, setIsValidToken(true) y cambia al siguiente paso
        
        Si isValidToken es true (token validado exitosamente):
        - Muestra NewPasswordForm: formulario para ingresar nueva contraseña
        - Usuario ingresa y confirma su nueva contraseña
        - Al enviar, se actualiza la contraseña usando el token validado
        - Usuario es redirigido a /auth/login para iniciar sesión
      */}
      {!isValidToken ? (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </>
  );
}
