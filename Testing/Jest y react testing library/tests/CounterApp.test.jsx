import { fireEvent, render, screen } from "@testing-library/react";
import { CounterApp } from "../src/CounterApp";

describe("Pruebas en el <CounterApp />", () => {
  const initialValue = 10;

  test("debe de hacer match con el snapshot", () => {
    const { container } = render(<CounterApp value={initialValue} />);
    expect(container).toMatchSnapshot();
    /**
     * El método `render` de `@testing-library/react` renderiza el componente
     * y devuelve un objeto que contiene el contenedor donde se ha renderizado.
     * El contenedor es un elemento DOM que contiene el HTML generado por el componente.
     * `toMatchSnapshot()` compara el contenedor renderizado con un snapshot guardado.
     * Si no hay un snapshot previo, lo crea y lo guarda.
     * Si hay un snapshot previo, verifica que el contenedor renderizado coincida con él
     */
  });

  test("debe de mostrar el valor inicial de 100 <CounterApp value={100}>", () => {
    render(<CounterApp value={100} />);
    /**
     * `screen.getByText(100)` busca un elemento que contenga el texto "100"
     * y lanza un error si no lo encuentra.
     * Si el texto se encuentra, la prueba pasa.
     * Si no se encuentra, la prueba falla.
     */
    expect(screen.getByText(100)).toBeTruthy();
    // expect( screen.getByRole('heading',{ level: 2}).innerHTML ).toContain('100')
  });

  test("debe de incrementar con el botón +1", () => {
    render(<CounterApp value={initialValue} />);
    fireEvent.click(screen.getByText("+1"));
    expect(screen.getByText("11")).toBeTruthy();

    /**
     * `fireEvent.click(screen.getByText('+1'))` simula un clic en el botón con el texto "+1".
     * Esto activa el evento de clic en el botón, lo que debería incrementar el contador en 1.
     * Luego, verificamos que el texto del contador se haya actualizado a "11"
     * usando `expect(screen.getByText('11')).toBeTruthy()`.
     * `toBeTruthy()` verifica que el elemento con el texto "11" exista en el DOM.
     * Si el texto "11" se encuentra, la prueba pasa.
     * Si no se encuentra, la prueba falla.
     * Esto asegura que el botón de incremento funcione correctamente.
     */
  });

  test("debe de decrementar con el botón -1", () => {
    render(<CounterApp value={initialValue} />);
    fireEvent.click(screen.getByText("-1"));
    expect(screen.getByText("9")).toBeTruthy();
  });

  test("debe de funcionar el botón de reset", () => {
    render(<CounterApp value={355} />);
    fireEvent.click(screen.getByText("+1"));
    fireEvent.click(screen.getByText("+1"));
    fireEvent.click(screen.getByText("+1"));
    // fireEvent.click( screen.getByText('Reset') );
    fireEvent.click(screen.getByRole("button", { name: "btn-reset" }));

    expect(screen.getByText(355)).toBeTruthy();
    /**
     * `fireEvent.click(screen.getByRole("button", { name: "btn-reset" }))`
     * simula un clic en el botón de reset, que tiene el atributo `name`
     * "btn-reset". Esto activa el evento de clic en el botón de reset,
     * lo que debería restablecer el contador al valor inicial de 355.
     * Luego, verificamos que el texto del contador se haya actualizado a "355"
     * usando `expect(screen.getByText(355)).toBeTruthy()`.
     * `toBeTruthy()` verifica que el elemento con el texto "355" exista en
     * el DOM. Si el texto "355" se encuentra, la prueba pasa.
     * Si no se encuentra, la prueba falla.
     * Esto asegura que el botón de reset funcione correctamente.
     * Además, el botón de reset se identifica por su atributo `name`
     * "btn-reset", lo que permite una selección más precisa del botón en el DOM.
     * Esto es útil para evitar confusiones con otros botones que puedan tener
     * un texto similar, como "+1" o "-1".
     * En resumen, esta prueba verifica que el botón de reset funcione correctamente
     * y que el contador se restablezca al valor inicial cuando se hace clic en él.
     * También asegura que el botón de reset se identifique correctamente
     * por su atributo `name`, lo que mejora la legibilidad y mantenibilidad del código
     * de prueba.
     * Además, el uso de `getByRole` con el atributo `name` es
     * una práctica recomendada en las pruebas de accesibilidad,
     * ya que permite identificar elementos de manera más semántica y accesible.
     * Esto es especialmente útil para usuarios que utilizan tecnologías de asistencia,
     * como lectores de pantalla, ya que pueden identificar los botones por su nombre
     * en lugar de depender únicamente del texto visible.
     * En resumen, esta prueba asegura que el botón de reset funcione correctamente,
     * que el contador se restablezca al valor inicial y que el botón de reset
     * se identifique de manera semántica y accesible mediante su atributo `name`.
     * Esto mejora la legibilidad y mantenibilidad del código de prueba,
     * y garantiza una mejor experiencia de usuario para todos los usuarios,
     * incluyendo aquellos que utilizan tecnologías de asistencia.
     */
  });
});
