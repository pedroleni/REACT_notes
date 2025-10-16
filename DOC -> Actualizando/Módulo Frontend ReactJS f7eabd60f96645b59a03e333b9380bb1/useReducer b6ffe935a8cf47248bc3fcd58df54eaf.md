# useReducer

**Introducción**

---

El hook `useReducer` nos permite manejar estados “complejos” por medio de una función reductora. Un estado complejo es aquel que tiene una estructura de varios niveles, por ejemplo: un objeto de objetos que contiene arrays.

```jsx
{
   foo: {
     faa: {
       test: [],
       testB: ''
     }
   },
   fee: [],
   fii: {
     testC: [],
     testD: {}
   }
 }
```

**Cómo funciona el useReducer**

---

```jsx
const [state, dispatch] = useReducer(
  reducer, 
  initialArg, 
	init
);
```

Donde `reducer` es simplemente una función de Javascript que actualiza el estado, `initialArg` es el estado inicial e `init` es una función opcional para también definir el estado inicial.

Este hook devuelve un array donde en la posición cero es el estado y en la posición uno es un `dispatch` que es una función que usaremos para actualizar el estado.

En realidad, es muy parecido al hook `useState`

```jsx
const initialState = false;
const [state, setState] = useState(initialState);
```

Veamos más sobre el hook `useReducer` haciendo una comparación con `redux` y ejemplos sobre su uso en los siguientes apartados.

**Funciones reductoras(reducers)**

---

Un reducer es una función de Javascript que recibe por parámetro el valor del estado actual y por segundo parámetro un objeto plano de Javascript llamado `action`
con la información necesaria para actualizar el estado.

Suena más complejo de lo que parece. Mira el siguiente ejemplo de un reducer.

```jsx
const reducer = (state, action) => {
   switch (action.type) {
     case 'increment':
       return {count: state.count + 1};
     case 'decrement':
       return {count: state.count - 1};
     default:
       throw new Error();
   }
}
```

Como podemos ver, el `reducer` recibe el valor del estado y un action.

El parámetro `action` es un objeto plano de Javascript y tendrá por lo menos una propiedad llamada `type` que usamos como una cadena, ejemplo: `{ type: 'ADD_TODO' }`.

Según el valor de `action.type`, es el cambio de estado a ejecutar. Es importante que sepas que no mutamos el estado sino que creamos y devolvemos uno nuevo.

Hay quienes prefieren evitar el uso de `switch` pero debes saber que es opcional usarlo. Puedes usar una serie de sentencias `if` también. Depende de ti.

Este ejemplo de la documentación oficial de reactjs.org es sólo una muestra de cómo podría lucir un reducer para un estado de un contador, pero es sólo para fines de ejemplo.

Al inicio comentamos que `useReducer` es recomendado para estados complejos y es lo que veremos en el ejemplo práctico.

**Ejemplo de un componente con useReducer**

---

Vamos a hacer un componente para manejar una lista de cosas por hacer (TODO list).

Antes de implementar `useReducer` primero vamos a definir el estado inicial y la función reductora que nos pide este hook al ejecutarlo.

Primero hay que pensar en cuál es el estado más simple que puede necesitar nuestro componente de cosas por hacer.

Consideremos lo siguiente:

- El usuario va a poder agregar nuevos elementos en la lista de cosas por hacer.
- El usuario necesita visualizar en la UI la lista de las cosas por hacer.
- El usuario va a poder marcar como completado o no completado un elemento de lista.

Te propongo que usemos la siguiente estructura.

```jsx
const state = [
  {
    id: 1,
    name: "Terminar de leer el capítulo de useReducer",
    isCompleted: false
  }
];
```

Un array de objetos planos en el que cada objeto tendrá un `id` para identificarlo (podríamos usar el índice del array pero no es lo común en aplicaciones reales), un `name` y un booleano `isCompleted` que usaremos para marcar como completado o no completado.

```jsx
import React, { useState, useReducer } from "react";
// librería para generar id dinámicos
import { v4 as uuidv4 } from "uuid";

// Estado inicial - único valor de la lista
const initialState = [
  {
    id: uuidv4(),
    name: "Terminar de leer el capítulo de useReducer",
    isCompleted: false
  }
];

// Recibe el state actual + la action a lanzar
const reducer = (state, action) => {
  // Si el tipo de action es añadir un elemento
  if (action.type === "ADD_TODO") {
    // Del payload saca el nombre de elemento
    const { name } = action.payload;
    // Retorna el nuevo elemento + los que hubiese en el array del listado
    return [
      ...state,
      {
        id: uuidv4(),
        name,
        isCompleted: false
      }
    ];
  }
  // Si el tipo de la action es completado
  if (action.type === "TOGGLE_IS_COMPLETED") {
    // Recuperado el id del action.payload
    const { id } = action.payload;
    // mapea los elementos y modifica la propiedad isCompleted si encuentra el id
    const newState = state.map((singleTodo) => {
      if (singleTodo.id === id) {
        return { ...singleTodo, isCompleted: !singleTodo.isCompleted };
      }
      // retorna los elementos
      return singleTodo;
    });
    // retorna el new state con el elemento modificado
    return newState;
  }
  // Por defecto si el action.type fuese otro retorna el estado son modificar
  return state;
};

export const Todo = () => {
  // State del texto - tarea
  const [todoText, setTodoText] = useState("");
  // reducer tiene un state y dispatch (acción que lanza) -> 1 value reducer || 2 value state inicial
  const [state, dispatch] = useReducer(reducer, initialState);
  // modidica el state del texto o tarea
  const handleChange = ({ target }) => setTodoText(target.value);
  // al clickar lanzamos con dispatch con el payload y el name del elemento
  const handleClick = () => {
    dispatch({
      type: "ADD_TODO",
      payload: { name: todoText }
    });
    setTodoText("");
  };
  // al cliackar sobre el elemento lanzamos la accion para completar
  const handleToggle = (id) => {
    dispatch({
      type: "TOGGLE_IS_COMPLETED",
      payload: { id }
    });
  };

  return (
    <>
      {/* add nuevo todo o tarea */}
      <p>
        Nuevo TODO:
        <input type="text" value={todoText} onChange={handleChange} />
        <button onClick={handleClick}>Agregar</button>
      </p>

      <h2>Listado</h2>

      {/* Listado */}
      <ul>
        {state.map(({ name, isCompleted, id }) => {
          const style = {
            // si es complete tachamos
            textDecoration: isCompleted ? "line-through" : "inherit"
          };

          return (
            // funcion de tachado -> completado
            <li key={id} style={style} onClick={() => handleToggle(id)}>
              {name}
            </li>
          );
        })}
      </ul>
    </>
  );
};
```