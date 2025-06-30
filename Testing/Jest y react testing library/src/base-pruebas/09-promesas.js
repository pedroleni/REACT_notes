import { getHeroeById } from "./08-imp-exp";

export const getHeroeByIdAsync = (id) => {
  /**
   * getHeroeByIdAsync es una función que devuelve una promesa.
   * Esta promesa se resuelve después de un segundo con el héroe correspondiente al id
   * proporcionado, o se rechaza con un mensaje de error si el héroe no se encuentra.
   */

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const p1 = getHeroeById(id);

      if (p1) {
        resolve(p1);
      } else {
        reject("No se pudo encontrar el héroe " + id);
      }
    }, 1000);
  });
};
