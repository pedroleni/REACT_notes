# ⚛️ React + 🧠 Redux: Guía rápida

## 🧐 ¿Qué es Redux?

Redux es una **librería para manejar el estado global** de tu aplicación. Aunque fue creada de forma independiente, se usa comúnmente con React gracias a la integración oficial de `react-redux`.

> Piensa en Redux como una especie de "cerebro central" que recuerda todo lo que está pasando en tu app, sin importar dónde estés.

---

## ⚛️ + 🧠 ¿Por qué usar Redux con React?

React maneja muy bien el **estado local** (con `useState`, `useReducer`, etc.), pero cuando:

- Tienes múltiples componentes que dependen del mismo estado.
- El estado necesita compartirse entre muchas partes.
- El paso de props se vuelve un infierno.

...entonces **Redux entra al rescate** 🦸‍♂️

---

## 🧱 Conceptos clave de Redux

| Concepto     | Qué hace                       | Ejemplo mental                       |
| ------------ | ------------------------------ | ------------------------------------ |
| **Store**    | Almacena todo el estado global | Un gran armario                      |
| **Action**   | Describe lo que quieres hacer  | Una nota: "Sube el contador"         |
| **Reducer**  | Decide cómo cambia el estado   | Un chef que recibe órdenes (actions) |
| **Dispatch** | Envia una action al store      | Gritas "¡sube el contador!"          |
| **Selector** | Extrae datos del store         | Sacas una camiseta del armario       |

---

## 🛠️ Redux Toolkit: la forma moderna de Redux

Redux Toolkit (`@reduxjs/toolkit`) es la forma recomendada de usar Redux hoy en día. Te ahorra escribir mucho código repetitivo y viene con buenas prácticas integradas.

Ejemplo de un "slice":

```js
import { createSlice } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

## ⚙️ ¿Cómo se integra en React?

    1.	Configuras el store con los reducers.
    2.	Envuelves tu <App /> con <Provider> para que React sepa dónde está el store.
    3.	Usas useSelector() para leer el estado.
    4.	Usas useDispatch() para disparar acciones.

```js
import { useSelector, useDispatch } from "react-redux";
import { increment } from "./counterSlice";

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```
