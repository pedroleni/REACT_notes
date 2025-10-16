# UseCallback ReactJS

**Introducción**

---

useCallback es un hook de React que se encarga de memoizar las funciones y de que no se rerendericen al montarse los components. Es muy útil cuando se transfieren funciones a componentes hijos.

La función useCallback acepta dos argumentos y retorna una función. El primer argumento es la función a memorizar y el segundo, al igual que useEffect, es una variable a vigilar, de manera que React no genere una nueva función con cada renderizado, siempre y cuando esa variable no cambie. Al igual que con useEffect también podemos dejar el array vacio, en lugar de value.

```jsx
import { useCallback } from 'react'

const MyComponent = ({prop}) => {
  const callback = () => {
    return 'Result'
  };
  const memoizedCallback = useCallback(callback, [prop])
  return <ChildComponent callback={memoizedCallback} />
}
```

De nuevo, mientras el prop que recibe el componente llamado Component, se mantenga constante, no se creará una nueva función, por más que se re-renderice el componente.

**La verificación de igualdad de funciones**

---

Antes de profundizar en el uso de useCallback(), distingamos el problema que resuelve useCallback(): la verificación de igualdad de funciones.

Las funciones en JavaScript son ciudadanos de primera clase, lo que significa que una función es un objeto regular. El objeto función puede ser devuelto por otras funciones, ser comparado, etc… Cualquier cosa que puedas hacer con un objeto.

Escribamos una function `factory()` que devuelva funciones que suman números.

```jsx
function factory() {
  return (a, b) => a + b;
}
const sum1 = factory();
const sum2 = factory();
sum1(1, 2); // => 3
sum2(1, 2); // => 3
sum1 === sum2; // => false
sum1 === sum1; // => true
```

sum1 y sum2 son funciones que suman dos números. Han sido creados por una function `factory()`. Las funciones sum1 y sum2 comparten el mismo código fuente pero son objetos de función diferentes. Comparándolos `sum1 === sum2` se evalúa como falso.

Así es como funcionan los objetos de JavaScript. Un objeto (incluido un objeto de función) es igual solo a sí mismo.

**El proposito de useCallback**

---

A menudo se crean diferentes objetos de función que comparten el mismo código dentro de los componentes de React.

```jsx
const MyComponent= () => {
  // handleClick se vuelve a crear en cada render
  const handleClick = () => {
    console.log('Clicked!');
  };
  // ...
}
```

handleClick es un objeto de función diferente en cada representación de MyComponent. La recreación de funciones en cada representación no es un problema, por lo que no debemos abusar de este hook. 

Pero en algunos casos, debe mantener una sola instancia de función entre las representaciones:

1. Un componente funcional envuelto dentro de React.memo() acepta una función por props.
2. Cuando el objeto de la función es una dependencia de otros hooks. `useEffect(()⇒{}, [callback])`.
3. Cuando la función tiene algún estado interno. Cuando la función es un debounce o throttled.

Ahí es cuando `useCallback(()=>{}, [])` es útil: dados los mismos valores de dependencia `[]`, el hook devuelve la misma instancia de función entre representaciones (también conocida como memorización):

```jsx
import { useCallback } from 'react';
function MyComponent() {
  // handleClick is the same function object
  const handleClick = useCallback(() => {
    console.log('Clicked!');
  }, []);
  // ...
}
```

La variable handleClick siempre tiene el mismo objeto de función de devolución de llamada entre las representaciones de MyComponent.

**Ejemplo básico de useCallback**

---

A continuación se muestra una configuración sencilla con un componente Botón y un componente Contador. El Contador tiene dos partes de estado y genera dos componentes Botón, cada uno de los cuales actualizará una parte distinta del estado de los componentes Contador.

El componente Button recibe dos props: `handleClick` y nombre. Cada vez que el Button se renderice, se registrará en la consola.

```jsx
import { useCallback, useState } from 'react'

const Button = ({handleClick, name}) => {
  console.log(`${name} rendered`)
  return <button onClick={handleClick}>{name}</button>
}

const Counter = () => {
console.log('counter rendered')
  const [countOne, setCountOne] = useState(0)
  const [countTwo, setCountTwo] = useState(0)
  return (
    <>
      {countOne} {countTwo}
      <Button handleClick={() => setCountOne(countOne + 1)} name="button1" />
      <Button handleClick={() => setCountTwo(countTwo + 1)} name="button2" />
    </>
  )
}
```

En este ejemplo, cada vez que hagas clic en uno de los dos botones, verás esto en la consola:

```
// counter rendered

// button1 rendered
// button2 rendered
```

Ahora, si aplicamos `useCallback` a nuestras funciones `handleClick` y envolvemos nuestro Button en `React.memo`, podemos ver lo que nos proporciona `useCallback`. `React.memo` es similar a `useMemo` y nos permite memoizar un componente.

```jsx
import { useCallback, useState } from 'react'

const Button = React.memo(({handleClick, name}) => {
  console.log(`${name} rendered`)
  return <button onClick={handleClick}>{name}</button>
})

const Counter = () => {
  console.log('counter rendered')
  const [countOne, setCountOne] = useState(0)
  const [countTwo, setCountTwo] = useState(0)
  const memoizedSetCountOne = useCallback(() => setCountOne(countOne + 1), [countOne)
  const memoizedSetCountTwo = useCallback(() => setCountTwo(countTwo + 1), [countTwo])
  return (
    <>
        {countOne} {countTwo}
        <Button handleClick={memoizedSetCountOne} name="button1" />
        <Button handleClick={memoizedSetCountTwo} name="button2" />
    </>
  )
}
```

Ahora, cuando hagamos clic en cualquiera de los botones, sólo veremos el botón que hemos pulsado para entrar en la consola:

```
// counter rendered

// button1 rendered

// counter rendered

// button2 rendered
```

Hemos aplicado la memoización a nuestro componente botón, y los valores prop que se le pasan son vistos como iguales. Las dos funciones de `handleClick` se almacenan en caché y serán vistas como la misma función por React hasta que cambie el valor de un elemento de la matriz de dependencia (por ejemplo, `countOne`, `countTwo`).

**Ejemplo de uso avanzado**

---

Vamos a verlo en profundidad con un ejemplo muy sencillo que nos ayude a comprender el useCallback. Vamos a definir un componente que recibe una función por props para limpiar o eliminar los datos de un usuario.

```jsx
const DeleteUser = memo(({ deleteUser }) => {
  console.log("Me renderizo una vez");

  return <button onClick={deleteUser}>Delete User</button>;
});
```

Y ahora un componente padre que tiene un `useState` de User y un `useCallback` que es nuestra función que pasamos al hijo para que la ejecute cuando clickemos sobre el botón de eliminar usuario.

```jsx
export const CodeUseCallback = () => {
  const [user, setUser] = useState({
    name: "Alberto",
    lastName: "Rivera",
  });

  const deleteUserCallback = useCallback(() => {
    setUser({ name: "", lastName: "" });
  }, []);

  return (
    <>
      <h3>
        {user.name} | {user.lastName}
      </h3>
      <input
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />
      <input
        value={user.lastName}
        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
      />

      <DeleteUser deleteUser={deleteUserCallback}>Reset name</DeleteUser>
    </>
  );
};
```

¿Qué está sucediendo? Vamos a verlo paso por paso para entenderlo definitivamente:

1. Tenemos una función `deleteUserCallback` que está englobada por un `useCallback` que se la pasamos al hijo, esta función se ha calculado una única vez ya que se le pasa como segundo parámetro tenemos un array vacío.
2. Al componente hijo le pasamos dicha función como prop `deleteUser`, y este componente hijo está englobado en un `React.memo`. Esto comparará los props en cada intento de render para asegurar que no se renderiza de nuevo innecesariamente.
3. En el componente hijo cuando clickamos sobre el botón, este invoca a la referencia que tenemos a través de los props de dicha función para ejecutarla.
4. Esta función cambia el estado del componente padre, y aun así vemos que el componente hijo no se renderiza nuevamente. Esto ocurre gracias a la combinación de `useCallback` para guardar una referencia única a una función, y `memo` como herramienta que compara dichas referencias antes de rerenderizar.

![useCallback.gif](UseCallback%20ReactJS%20c62c7b05e9af47a18f55a6468b799a02/useCallback.gif)

¡Recuerda! Si no utilizamos `useCallback`, en cada render la función `deleteUser` haría referencia a una nueva función, y el `shallowCompare` no nos permitiría prevenir renders innecesarios 🤓