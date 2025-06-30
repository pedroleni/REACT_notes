import { render, screen } from "@testing-library/react";
import { FirstApp } from "../src/FirstApp";

describe("Pruebas en <FirstApp />", () => {
  const title = "Hola, Soy Goku";
  const subTitle = "Soy un subtitulo";

  test("debe de hacer match con el snapshot", () => {
    const { container } = render(<FirstApp title={title} />);
    /**
     * El método render de @testing-library/react renderiza el componente
     * y devuelve un objeto que contiene el contenedor donde se ha renderizado.
     * El contenedor es un elemento DOM que contiene el HTML generado por el componente.
     */
    expect(container).toMatchSnapshot();
    /**
     * toMatchSnapshot() compara el contenedor renderizado con un snapshot guardado.
     * Si no hay un snapshot previo, lo crea y lo guarda.
     * Si hay un snapshot previo, verifica que el contenedor renderizado coincida con él.
     */
  });

  test('debe de mostrar el mensaje "Hola, Soy Goku"', () => {
    render(<FirstApp title={title} />);
    /**
     * screen.debug() nos permite ver el DOM renderizado
     * y verificar que el texto "Hola, Soy Goku" se encuentre en el documento
     * y que no haya errores de renderizado.
     */
    expect(screen.getByText(title)).toBeTruthy();
    /**
         * getByText busca un elemento que contenga el texto especificado
         * y lanza un error si no lo encuentra.
         * Si el texto se encuentra, la prueba pasa.
         * Si no se encuentra, la prueba falla.
         
        */
    // screen.debug();
  });

  test("debe de mostrar el titulo en un h1", () => {
    render(<FirstApp title={title} />);
    /**
     * screen.getByRole("heading", { level: 1 }) busca un elemento
     * que sea un encabezado (heading) de nivel 1 (h1).
     * Luego, verificamos que el contenido de ese encabezado contenga el título.
     * Esto asegura que el título se renderice correctamente en un h1.
     */
    expect(screen.getByRole("heading", { level: 1 }).innerHTML).toContain(
      title
    );
  });

  test("debe de mostrar el subtitulo enviado por props", () => {
    render(<FirstApp title={title} subTitle={subTitle} />);
    /**
     * screen.getAllByText(subTitle) busca todos los elementos que contengan
     * el texto del subtítulo. En este caso, esperamos que haya dos elementos
     * que contengan el subtítulo, ya que FirstApp renderiza el subtítulo dos veces.
     */
    expect(screen.getAllByText(subTitle).length).toBe(2);
  });
});
