import {
  getHeroeById,
  getHeroesByOwner,
} from "../../src/base-pruebas/08-imp-exp";
import heroes from "../../src/data/heroes";

describe("Pruebas en 08-imp-exp", () => {
  test("getHeroeById debe de retornar un héroe por ID", () => {
    const id = 1;
    const hero = getHeroeById(id);

    expect(hero).toEqual({ id: 1, name: "Batman", owner: "DC" });
    /**
     * getHeroeById debe de retornar un héroe por ID
     * Si el ID no existe, debe de retornar undefined
     */
  });

  test("getHeroeById debe de retornar undefined si no existe", () => {
    const id = 100;
    const hero = getHeroeById(id);
    expect(hero).toBeFalsy();
    /**
     * getHeroeById debe de retornar undefined si no existe
     */
  });

  // Tarea:
  test("getHeroesByOwner debe de regresar heroes de DC", () => {
    const owner = "DC";
    const heroes = getHeroesByOwner(owner);

    expect(heroes.length).toBe(3);
    expect(heroes).toEqual([
      { id: 1, name: "Batman", owner: "DC" },
      { id: 3, name: "Superman", owner: "DC" },
      { id: 4, name: "Flash", owner: "DC" },
    ]);
    expect(heroes).toEqual(heroes.filter((heroe) => heroe.owner === owner));
    /**
     * getHeroesByOwner debe de regresar heroes de DC
     * Si el owner no existe, debe de retornar un arreglo vacío
     */
  });

  test("getHeroesByOwner debe de regresar heroes de Marvel", () => {
    const owner = "Marvel";
    const heroes = getHeroesByOwner(owner);

    expect(heroes.length).toBe(2);
    expect(heroes).toEqual(heroes.filter((heroe) => heroe.owner === owner));
    /**
     * getHeroesByOwner debe de regresar heroes de Marvel
     * Si el owner no existe, debe de retornar un arreglo vacío
     * Si el owner es 'Marvel', debe de retornar los héroes de Marvel
     */
  });
});
