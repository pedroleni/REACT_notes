import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { CheckPasswordForm } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import { deleteProject } from "@/api/ProjectAPI";

/**
 * Modal de confirmación para eliminar un proyecto
 * Requiere que el usuario ingrese su contraseña para confirmar la eliminación
 * Se muestra cuando existe el query param 'deleteProject' en la URL
 * Proceso de dos pasos: 1) Verifica contraseña 2) Elimina proyecto
 */
export default function DeleteProjectModal() {
  // Valores iniciales del formulario (solo contraseña)
  const initialValues: CheckPasswordForm = {
    password: "",
  };

  // Hook para obtener la ubicación actual y query params
  const location = useLocation();

  // Hook para navegar y cerrar el modal
  const navigate = useNavigate();

  // Extrae los query params de la URL
  const queryParams = new URLSearchParams(location.search);

  // Obtiene el ID del proyecto a eliminar desde los query params (?deleteProject=123)
  const deleteProjectId = queryParams.get("deleteProject")!;

  // El modal se muestra si existe el query param deleteProject
  const show = deleteProjectId ? true : false;

  // Hook de React Hook Form para manejar el formulario de contraseña
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialValues,
  });

  // Cliente de React Query para invalidar la cache después de eliminar
  const queryClient = useQueryClient();

  /**
   * Primera mutación: Verifica que la contraseña ingresada sea correcta
   * Si falla, no se procede con la eliminación del proyecto
   */
  const checkUserPasswordMutation = useMutation({
    mutationFn: checkPassword,
    // Solo muestra error, no hace nada en success porque debe continuar al siguiente paso
    onError: (error) => toast.error(error.message),
  });

  /**
   * Segunda mutación: Elimina el proyecto después de verificar la contraseña
   * Solo se ejecuta si la verificación de contraseña fue exitosa
   */
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    // Se ejecuta si hay error al eliminar el proyecto
    onError: (error) => {
      toast.error(error.message);
    },
    // Se ejecuta cuando el proyecto se elimina exitosamente
    onSuccess: (data) => {
      toast.success(data); // Muestra mensaje de éxito
      // Invalida la cache de proyectos para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Cierra el modal navegando a la misma ruta sin query params
      navigate(location.pathname, { replace: true });
    },
  });

  /**
   * Maneja el envío del formulario con un proceso de dos pasos
   * 1. Verifica la contraseña del usuario (seguridad)
   * 2. Si es correcta, procede a eliminar el proyecto
   * @param formData - Objeto con la contraseña ingresada por el usuario
   */
  const handleForm = async (formData: CheckPasswordForm) => {
    // Paso 1: Verifica la contraseña (espera a que termine antes de continuar)
    await checkUserPasswordMutation.mutateAsync(formData);

    // Paso 2: Si llegó aquí, la contraseña es correcta, elimina el proyecto
    await deleteProjectMutation.mutateAsync(deleteProjectId);
  };

  return (
    // Transition de Headless UI para animaciones suaves de entrada/salida
    <Transition appear show={show} as={Fragment}>
      {/* Dialog modal que se cierra al hacer clic en el overlay o botón cerrar */}
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => navigate(location.pathname, { replace: true })}
      >
        {/* Overlay oscuro del fondo con animación de fade */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        {/* Contenedor del modal centrado en la pantalla */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Panel del modal con animación de escala */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                {/* Título del modal */}
                <Dialog.Title as="h3" className="font-black text-4xl  my-5">
                  Eliminar Proyecto
                </Dialog.Title>

                {/* Descripción del proceso de eliminación */}
                <p className="text-xl font-bold">
                  Confirma la eliminación del proyecto {""}
                  <span className="text-fuchsia-600">
                    colocando tu password
                  </span>
                </p>

                {/* Formulario de confirmación con contraseña */}
                <form
                  className="mt-10 space-y-5"
                  onSubmit={handleSubmit(handleForm)}
                  noValidate
                >
                  {/* Campo de contraseña */}
                  <div className="flex flex-col gap-3">
                    <label className="font-normal text-2xl" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Password Inicio de Sesión"
                      className="w-full p-3  border-gray-300 border"
                      {...register("password", {
                        required: "El password es obligatorio",
                      })}
                    />

                    {/* Muestra error si la contraseña está vacía */}
                    {errors.password && (
                      <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                  </div>

                  {/* Botón de confirmación para eliminar */}
                  <input
                    type="submit"
                    className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value="Eliminar Proyecto"
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
