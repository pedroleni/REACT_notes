import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import AddMemberForm from "./AddMemberForm";

/**
 * Modal para agregar nuevos miembros al equipo del proyecto
 * Se muestra cuando existe el query param '?addMember' en la URL
 * Contiene el formulario de búsqueda de usuario por email
 * Permite buscar usuarios y agregarlos al equipo del proyecto
 */
export default function AddMemberModal() {
  // Hook para obtener la ubicación actual y leer query params
  const location = useLocation();

  // Hook para navegar y cerrar el modal
  const navigate = useNavigate();

  // Extrae los query params de la URL
  const queryParams = new URLSearchParams(location.search);

  // Verifica si existe el query param 'addMember' para mostrar el modal
  const addMember = queryParams.get("addMember");

  // El modal se muestra si existe el query param addMember
  const show = addMember ? true : false;

  return (
    <>
      {/* Transition de Headless UI para animaciones suaves */}
      <Transition appear show={show} as={Fragment}>
        {/* Dialog modal que se cierra al hacer clic en el overlay */}
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
                    Agregar Integrante al equipo
                  </Dialog.Title>

                  {/* Descripción del proceso de agregar miembro */}
                  <p className="text-xl font-bold">
                    Busca el nuevo integrante por email {""}
                    <span className="text-fuchsia-600">
                      para agregarlo al proyecto
                    </span>
                  </p>

                  {/* 
                                        Componente de formulario para buscar y agregar miembros
                                        Incluye campo de email con validación y resultados de búsqueda
                                    */}
                  <AddMemberForm />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
