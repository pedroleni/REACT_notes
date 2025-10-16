# Custom Hooks ReactJS

Introducción

---

Los Custom Hooks son funciones propias, es decir, creadas por ti en tu código, para abstraer y encapsular comportamientos que se relacionen con otros hooks propios de React, como el uso de estados a través de `useState` o “sideeffects” a través de `useEffect`. **Construir tus propios Hooks te permite extraer la lógica del componente en funciones reutilizables**.

Antes de sumergirnos en crear nuestro primer Custom Hook el equipo detrás de React nos lanza algunas recomendaciones que tenemos que tener en cuenta.

- Nombrar todos nuestros Custom Hook con la palabra “use” al principio del nombre, no es obligatorio pero por convención se suele hacer. Por ejemplo `useMyCustomHook`.

- Dos componentes que usan un mismo Custom Hook no comparten estado, cada vez que usas un Hook personalizado, todo estado y efecto dentro de este son aislados completamente en el componente que lo utiliza.

- Reutiliza y piensa en la creatividad. Los Custom Hook ofrecen la flexibilidad de compartir lógica que no era posible antes con los componentes de React. Puedes escribir Hooks personalizados que cubran una amplia gama de casos de uso, como manejo de formularios, animación, suscripciones declarativas, temporizadores y probablemente muchos más que no hemos considerado.

**Custom Hook counter**

---

Vamos a realizar un ejemplo básico de un contador para explicar las particularidades de los Custom Hooks y luego entraremos en algunos ejemplos más complejos y con cierta utilidad en nuestro día a día.

Os presentamos un Custom Hook contador que tiene la posibilidad de hacer crecer o decrecer una cuenta.

```jsx
import { useState } from "react";

const useCounter = (intialeCount) => {
  const [count, setCount] = useState(intialeCount);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount((prevCount) => Math.max(0, prevCount - 1));
  };

  return { count, handleIncrement, handleDecrement };
};

export { useCounter };
```

Si os fijáis por un lado generamos un state, count, que guarda el valor del contador y por otro lado definimos las acciones que podemos lanzar `handleIncrement` o `handleDecrement` . Es buena práctica usar la palabra handle (manejador o controlador) para estas acciones.

Ahora podemos usar nuestro `Custom Hook` en todos los componente que queramos.

```jsx
import { useCounter } from "./hooks/useCounter";

export default function App() {
  const { count, handleIncrement, handleDecrement } = useCounter(0);

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleIncrement}>Incrementar</button>
      <button onClick={handleDecrement}>Decrementar</button>
    </>
  );
}
```

Wow 🦄! Ahora ya nos sabemos la teoría y hemos visto un ejemplo sencillito para calentar, pero esto acaba de comenzar. Vamos a por algunos ejemplos que nos puedan ayudar en nuestro día a día.

**Custom Hook useDebounce**

---

Imagina que queremos controlar todos los renders provocados por un cambio de state o que queremos controlar el número de peticiones que se lanzan en un buscador o filtro. Podemos crear nuestro Custom Hook para que solo se lancen los renders o las peticiones cada 200ms.

```jsx
import { useEffect, useState } from 'react'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 200)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
```

Tenemos un Hook en el que le entra el valor de control y como segundo argumento el tiempo de espera, en caso de no pasarlo será 200ms, después con un setTimeOut controlamos el valor de entrada.

Ahora podemos usar nuestro `useDebounce` donde queramos, y cuando el valor de control que hemos pasado como primer argumento cambie, se activará un nuevo timeout que devolverá el `debouncedValue` cuando pase el tiempo especificado. Te dejamos un ejemplo claro de uso del `useDebounce`. 

```jsx
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks'

export default function Component() {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value, 500)

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  // Fetch API (optional)
  useEffect(() => {
    // Do fetch here...
    // Triggers when "debouncedValue" changes
  }, [debouncedValue])

  return (
    <div>
      <p>Valor a tiempo real: {value}</p>
      <p>Valor debounced: {debouncedValue}</p>

      <input type="text" value={value} onChange={handleChange} />
    </div>
  )
}
```

**Custom Hook useToggle**

---

Vamos ahora con otro ejemplo sencillo pero nos puede ser útil para controlar un valor `booleano` de activo o no activo con un toggle.

```jsx
import { useState, useCallback } from "react";

const useToggle = () => {
  const [state, setState] = useState(false);

  const handler = useCallback(() => {
    setState((prevValue) => !prevValue);
  }, []);

  return [state, handler];
};

export default useToggle;
```

Ahora podemos usar nuestro Custom Hook para controlar un cambio de state en un toggle.

```tsx
import useToggle from "./hooks/useToggle";

export default function App() {
  const [toggleState, handleToggle] = useToggle();

  return (
    <>
      <h3>Toggle: {toggleState.toString()}</h3>
      <button onClick={handleToggle}>Toggle</button>
    </>
  );
}
```

![toggle.gif](Custom%20Hooks%20ReactJS%200718c75722f74ce4abe9fca2e307e3b9/toggle.gif)

**Custom Hook para controlar el tamaño de la ventana**

---

¿Alguna vez has necesitado controlar el tamaño del window para cambiar un componente acorde a estos valores? Podemos crear un hook que nos permita tener control de esto en todo momento. Te dejamos un ejemplo de ello 🧙‍♂️.

```tsx
import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight
  }));

	useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
}

// Lo usamos en nuestro componente
export default function App() {
  const { width, height } = useWindowSize();

  return (
    <div className="App">
      <h1>La ventana mide</h1>
      <h2>Ancho: {width}</h2>
      <h2>Alto: {height}</h2>
    </div>
  );
}
```

**Custom Hook Fetch Api**

---

Con lo que hemos visto hasta ahora, podemos concluir que los custom hooks no son otra cosa que nuestros propios hooks combinando las herramientas que nos da React. Esto siempre es mejor verlo a través de un ejemplo y por ello vamos a crear un fichero llamado `UsePokemonCollection.jsx` , lo primero siempre es crear una función que actúe como un hook.

```tsx
const UsePokemonCollection = (): UsePokemonCollectionReturn => {
  const [filter, setFilter] = React.useState('ditto');

  const [pokemonCollection, setPokemonCollection] = React.useState([]);

  const loadPokemon = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${filter}`)
      .then((response) => response.json())
      .then((json) => setPokemonCollection([json]));
  };

  return { filter, setFilter, pokemonCollection, loadPokemon };
};
```

En este Hook, que puede estar fuera de nuestro fichero de componente, tenemos los `states` y una función que lanza mi petición a la PokeApi. Retornamos nuestros states y función para usarlas en cualquier componente.

```tsx
const { filter, setFilter, pokemonCollection, loadPokemon } =
    usePokemonCollection();

  React.useEffect(() => {
    loadPokemons();
  }, [filter]);
```

Nos traemos nuestro custom Hook y en el effect llamamos a nuestra función que carga los pokemon. ¿Qué ganamos haciendo esto? Que en nuestro useEffect tenemos el control de lanzar la request para conseguir más pokemon cuando queramos, si dejamos el segundo parámetro vacío solamente cargará la primera vez o podemos añadir más states de control como hemos visto anteriormente.

```tsx
import React from "react";

const UsePokemonCollection = (): UsePokemonCollectionReturn => {
  const [filter, setFilter] = React.useState('ditto');

  const [pokemonCollection, setPokemonCollection] = React.useState([]);

  const loadPokemon = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${filter}`)
      .then((response) => response.json())
      .then((json) => setPokemonCollection([json]));
  };

  return { filter, setFilter, pokemonCollection, loadPokemon };
};

export const CodeCustomHook = () => {
  const { filter, setFilter, pokemonCollection, loadPokemon } =
    usePokemonCollection();

  React.useEffect(() => {
    loadPokemon();
  }, [filter]);

  return (
    <div>
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      <ul>
        {pokemonCollection.map((pokemon, index) => (
          <li key={index}>
            <h1>{pokemon.name}</h1>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

Con esto tenemos control sobre los pokemon que cargamos en el componente, y a la vez hemos abstraido la lógica para reutilizarla en otro lugar si lo necesitamos, habrá mejor capacidad de testeo y mantenibilidad.

**Mini-Ejercicio**

---

Te habrás fijado en que cada vez que cambia el filter lanzamos una petición, ¿te atreves a combinar este último Custom Hook con el que hicimos antes, useDebounce, para mejorar el número de requests que hacemos? 🚀