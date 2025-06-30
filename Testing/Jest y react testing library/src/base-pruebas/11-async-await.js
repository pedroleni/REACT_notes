export const getImagen = async () => {
  try {
    const apiKey = "PmekYkrd6S8qGKtkC8IZWqAa81bmvWdD";
    const resp = await fetch(
      `http://api.giphy.com/v1/gifs/random?api_key=${apiKey}`
    );
    const { data } = await resp.json();

    const { url } = data.images.original;
    console.log(url);

    return url;
  } catch (error) {
    // manejo del error
    // console.error(error)
    return "No se encontro la imagen";
  }
};
/**
 * Llamada a la función getImagen para obtener una imagen aleatoria de Giphy.
 * Si no se encuentra una imagen, se devuelve un mensaje de error.
 * Esta función utiliza la API de Giphy para obtener una imagen aleatoria
 */
getImagen();
