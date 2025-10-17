import type { Request, Response } from "express";
import User from "../models/User";
import Token from "../models/Token";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";
import Types from "mongoose";

/**
 * Controlador de autenticación y gestión de usuarios
 * Maneja todas las operaciones relacionadas con:
 * - Registro de usuarios
 * - Confirmación de cuentas
 * - Login y generación de JWT
 * - Recuperación de contraseña
 * - Actualización de perfil y contraseña
 *
 * Todos los métodos son estáticos para usarse como middlewares de Express
 */
export class AuthController {
  /**
   * Crea una nueva cuenta de usuario
   *
   * Flujo:
   * 1. Valida que el email no esté registrado
   * 2. Crea el usuario con password hasheado
   * 3. Genera token de confirmación de 6 dígitos
   * 4. Envía email con el token
   * 5. Guarda usuario y token en la BD
   *
   * @route POST /api/auth/create-account
   * @body { name, email, password, password_confirmation }
   * @returns 200 - Mensaje de éxito
   * @returns 409 - Email ya registrado
   * @returns 500 - Error del servidor
   */
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      // Prevenir duplicados - Verifica si el email ya está registrado
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error("El Usuario ya esta registrado");
        return res.status(409).json({ error: error.message });
      }

      // Crea un usuario con los datos del body
      const user = new User(req.body);

      // Hash del password usando bcrypt (ver utils/auth.ts)
      // Nunca almacenar passwords en texto plano
      user.password = await hashPassword(password);

      // Generar token de confirmación de 6 dígitos
      const token = new Token();
      token.token = generateToken(); // Genera código aleatorio de 6 dígitos
      token.user = user.id; // Asocia el token al usuario

      // Enviar email de confirmación con el token
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      // Guarda usuario y token en paralelo usando Promise.allSettled
      // allSettled espera a que ambos terminen, aunque uno falle
      await Promise.allSettled([user.save(), token.save()]);

      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Confirma una cuenta de usuario con el token recibido por email
   *
   * Flujo:
   * 1. Valida que el token exista en la BD
   * 2. Busca el usuario asociado al token
   * 3. Marca la cuenta como confirmada
   * 4. Elimina el token (ya no es necesario)
   *
   * @route POST /api/auth/confirm-account
   * @body { token: string } - Token de 6 dígitos
   * @returns 200 - Cuenta confirmada
   * @returns 404 - Token no válido
   * @returns 500 - Error del servidor
   */
  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      // Busca el token en la base de datos
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      // Busca el usuario asociado al token y lo marca como confirmado
      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      // Guarda usuario y elimina token en paralelo
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Inicia sesión y genera un JWT
   *
   * Flujo:
   * 1. Valida que el usuario exista
   * 2. Verifica que la cuenta esté confirmada (si no, envía nuevo token)
   * 3. Valida la contraseña
   * 4. Genera y retorna JWT
   *
   * @route POST /api/auth/login
   * @body { email, password }
   * @returns 200 - JWT token
   * @returns 404 - Usuario no encontrado
   * @returns 401 - Cuenta no confirmada o password incorrecto
   * @returns 500 - Error del servidor
   */
  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Busca el usuario por email
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }

      // Verifica si la cuenta está confirmada
      if (!user.confirmed) {
        // Si no está confirmada, genera y envía nuevo token
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        // Envía email de confirmación
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un e-mail de confirmación"
        );
        return res.status(401).json({ error: error.message });
      }

      // Valida la contraseña comparando con el hash almacenado
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Password Incorrecto");
        return res.status(401).json({ error: error.message });
      }

      // Genera JWT con el ID del usuario
      // Este token se usa para autenticar peticiones subsecuentes
      const token = generateJWT({ id: user._id as Types.ObjectId });

      res.send(token);
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Solicita un nuevo código de confirmación
   * Útil cuando el código original expiró o no llegó
   *
   * Flujo:
   * 1. Valida que el usuario exista
   * 2. Valida que la cuenta NO esté confirmada
   * 3. Genera nuevo token
   * 4. Envía email con el nuevo token
   *
   * @route POST /api/auth/request-code
   * @body { email }
   * @returns 200 - Nuevo token enviado
   * @returns 404 - Usuario no registrado
   * @returns 403 - Usuario ya confirmado
   * @returns 500 - Error del servidor
   */
  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Valida que el usuario exista
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El Usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      // Valida que la cuenta NO esté confirmada
      // No tiene sentido enviar código a cuenta ya confirmada
      if (user.confirmed) {
        const error = new Error("El Usuario ya esta confirmado");
        return res.status(403).json({ error: error.message });
      }

      // Genera nuevo token de confirmación
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Envía email con el nuevo token
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      await Promise.allSettled([user.save(), token.save()]);

      res.send("Se envió un nuevo token a tu e-mail");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Inicia el proceso de recuperación de contraseña
   * Genera token y envía email con instrucciones
   *
   * Flujo:
   * 1. Valida que el usuario exista
   * 2. Genera token de recuperación
   * 3. Envía email con el token
   *
   * @route POST /api/auth/forgot-password
   * @body { email }
   * @returns 200 - Email enviado
   * @returns 404 - Usuario no registrado
   * @returns 500 - Error del servidor
   */
  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Valida que el usuario exista
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El Usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      // Genera token de recuperación de 6 dígitos
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;
      await token.save();

      // Envía email con token para restablecer contraseña
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("Revisa tu email para instrucciones");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Valida que un token de recuperación sea válido
   * Paso intermedio antes de permitir cambiar contraseña
   *
   * @route POST /api/auth/validate-token
   * @body { token }
   * @returns 200 - Token válido
   * @returns 404 - Token no válido
   * @returns 500 - Error del servidor
   */
  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      // Busca el token en la base de datos
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      res.send("Token válido, Define tu nuevo password");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Actualiza la contraseña usando un token de recuperación
   * Último paso del proceso de recuperación de contraseña
   *
   * Flujo:
   * 1. Valida que el token exista
   * 2. Busca el usuario asociado
   * 3. Actualiza la contraseña con nuevo hash
   * 4. Elimina el token (ya no es necesario)
   *
   * @route POST /api/auth/update-password/:token
   * @params token - Token de recuperación
   * @body { password, password_confirmation }
   * @returns 200 - Contraseña actualizada
   * @returns 404 - Token no válido
   * @returns 500 - Error del servidor
   */
  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      // Valida que el token exista
      const tokenExists = await Token.findOne({ token });
      if (!tokenExists) {
        const error = new Error("Token no válido");
        return res.status(404).json({ error: error.message });
      }

      // Actualiza la contraseña del usuario con nuevo hash
      const user = await User.findById(tokenExists.user);
      user.password = await hashPassword(password);

      // Guarda usuario y elimina token en paralelo
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.send("El password se modificó correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  /**
   * Retorna los datos del usuario autenticado
   * req.user es inyectado por el middleware de autenticación
   *
   * @route GET /api/auth/user
   * @requires JWT en header Authorization
   * @returns 200 - Datos del usuario
   */
  static user = async (req: Request, res: Response) => {
    return res.json(req.user);
  };

  /**
   * Actualiza el perfil del usuario autenticado
   * Permite cambiar nombre y email
   *
   * Flujo:
   * 1. Valida que el nuevo email no esté en uso por otro usuario
   * 2. Actualiza nombre y email
   * 3. Guarda cambios
   *
   * @route PUT /api/auth/profile
   * @requires JWT en header Authorization
   * @body { name, email }
   * @returns 200 - Perfil actualizado
   * @returns 409 - Email ya registrado por otro usuario
   * @returns 500 - Error del servidor
   */
  static updateProfile = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    // Verifica si el email ya está en uso por otro usuario
    const userExists = await User.findOne({ email });
    if (userExists && userExists.id.toString() !== req.user.id.toString()) {
      const error = new Error("Ese email ya esta registrado");
      return res.status(409).json({ error: error.message });
    }

    // Actualiza nombre y email del usuario
    req.user.name = name;
    req.user.email = email;

    try {
      await req.user.save();
      res.send("Perfil actualizado correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  };

  /**
   * Cambia la contraseña del usuario autenticado
   * Requiere la contraseña actual como medida de seguridad
   *
   * Flujo:
   * 1. Valida que la contraseña actual sea correcta
   * 2. Hashea la nueva contraseña
   * 3. Guarda el cambio
   *
   * @route POST /api/auth/update-password
   * @requires JWT en header Authorization
   * @body { current_password, password, password_confirmation }
   * @returns 200 - Contraseña actualizada
   * @returns 401 - Contraseña actual incorrecta
   * @returns 500 - Error del servidor
   */
  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { current_password, password } = req.body;

    const user = await User.findById(req.user.id);

    // Valida que la contraseña actual sea correcta
    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("El Password actual es incorrecto");
      return res.status(401).json({ error: error.message });
    }

    try {
      // Hashea y guarda la nueva contraseña
      user.password = await hashPassword(password);
      await user.save();
      res.send("El Password se modificó correctamente");
    } catch (error) {
      res.status(500).send("Hubo un error");
    }
  };

  /**
   * Verifica que la contraseña proporcionada sea correcta
   * Usado antes de acciones críticas como eliminar proyecto
   *
   * @route POST /api/auth/check-password
   * @requires JWT en header Authorization
   * @body { password }
   * @returns 200 - Password correcto
   * @returns 401 - Password incorrecto
   * @returns 500 - Error del servidor
   */
  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;

    const user = await User.findById(req.user.id);

    // Valida la contraseña
    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("El Password es incorrecto");
      return res.status(401).json({ error: error.message });
    }

    res.send("Password Correcto");
  };
}
