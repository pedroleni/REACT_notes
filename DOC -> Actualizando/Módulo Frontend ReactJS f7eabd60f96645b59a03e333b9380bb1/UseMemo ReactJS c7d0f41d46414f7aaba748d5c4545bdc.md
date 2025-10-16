# UseMemo ReactJS

**Introducción**

---

A veces hay que calcular un valor, ya sea mediante un cálculo complejo o llegando a la base de datos para realizar una consulta costosa o a la red.

Usando este Hook, esta operación se realiza solo una vez, luego el valor se almacenará en el valor memorizado y la próxima vez que desee hacer referencia a él, lo obtendrá mucho más rápido.

**Code**

---

```jsx
const memoizedValue = useMemo(() => expensiveOperation())
```

Asegura de añadir el array con los elementos que queremos memorizar. De lo contrario este realizará el cálculo una y otra vez.

```jsx
const memoizedValue = useMemo(() => expensiveOperation(param1, param2), [param1, param2])
```

Una de las particularidades del useMemo es que los asignamos a una variable, es decir el valor de retorno es almacenado. Mientras que el useEffect es para ejecutar un efecto lateral (side effect), la similitud es la capacidad de decidir cuando recalcular ese efecto o el valor en un useMemo. 

**Cuándo usar useMemo**

---

Normalmente el Hook useMemo está pensado para la optimización de recursos. En ocasiones tenemos que lanzar cálculos pesados en nuestro componente y no interesa que en cada render tengamos que volver a realizarlo. Por ello este Hook guarda el valor o lo memoriza para no lanzar el cálculo por cada render.

**Basic useMemo**

---

Para entender el useMemo lo que vamos a hacer es lanzar una misma funcionalidad una encapsulada por el useMemo y otra sin la encapsulación. Una vez lo tenemos tendremos un state que solicite un render a React y veremos qué ventajas obtenemos.

```jsx
import { useMemo, useState } from 'react';

const numbersArray = [1, 2, 1, 4, 0, 6];

const mapScores = (scores, caller) => {
  console.log('Invocamos mapScores =>', caller);

  return scores.map((num, index) => {
    const calc = (num * 3) / 2;
    const color = calc < 3 ? '🔴' : '🟢';

    return (
      <p key={index}>
        {calc} {color}
      </p>
    );
  });
};

const BasicUseMemo = () => {
  // toggle para solicitar un render y ver si hace el calculo de nuevo
  const [rerender, setRerender] = useState(false);

  const marksContent = mapScores(numbersArray, 'no-memo');

  const marksContentMemo = useMemo(() => {
    return mapScores(numbersArray, 'memo');
  }, []);

  return (
    <div>
      <div className="rows">
        <div>
          <h3>No memo</h3>
          {marksContent}
        </div>

        <div>
          <h3>Usando memo</h3>
          {marksContentMemo}
        </div>
      </div>

      <button onClick={() => setRerender(!rerender)}>Rerender</button>
    </div>
  );
};

export default BasicUseMemo;
```

Si nos fijamos la funcionalidad encapsulada por el useMemo como ya hizo el cálculo no lo realizará de nuevo, esto supone una gran ventaja a la hora de ahorrarnos cálculo fijos dentro de nuestra aplicación. 

**Memorizando un cálculo pesado para ordenar y mapear contenido**

---

Vamos a crear un componente que renderice una serie de posts que tenemos desordenados, sin título y con un formato de fecha no adecuado para mostrarlo a un usuario.

Para ver correctamente este contenido, vamos a tener que ordenar por fecha, añadir un título a cada post, y formatear la fecha adecuadamente. Aquí te dejamos un componente que hace esto mismo.

```jsx
const posts = [
  {
    slug: "html-desde-0",
    date: "Fri Oct 06 2023 10:45:00 GMT+0200 (Central European Summer Time)"
  },
  {
    slug: "css-desde-0",
    date: "Thu Feb 17 2022 18:15:00 GMT+0100 (Central European Standard Time)"
  },
  {
    slug: "javascript-desde-0",
    date: "Tue Aug 23 2022 13:21:00 GMT+0200 (Central European Summer Time)"
  }
];

const CodePosts = () => {
	// Menuda locura de cálculos! 🤯
  const orderedPostsWithTitle = posts
    .map((post) => ({
      ...post,
      date: new Date(post.date),
      title: post.slug.split("-").join(" ").toUpperCase()
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((post) => ({
      ...post,
      date: new Intl.DateTimeFormat("es-ES").format(post.date)
    }));

  return (
    <div>
      <h1>Post destacados 😍</h1>

      <ul>
        {orderedPostsWithTitle.map((post) => (
          <li key={post.slug}>
            <h3>{post.title}</h3> {post.date}
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CodePosts;
```

Como puedes observar aquí, en caso de que el componente padre provoque un render de este componente, vamos a recalcular de nuevo todo el array que estamos mostrando... ¡Esto puede ser una locura si la lista de posts es muy larga o se compone de componentes complejos!

![vistamemo1.PNG](UseMemo%20ReactJS%20c7d0f41d46414f7aaba748d5c4545bdc/vistamemo1.png)

Para prevenir esto, podemos utilizar el hook useMemo y memorizar los resultados. Este hook se componente mediante dos argumentos, el primero es un callback, como con `usEffect` pero que en este caso debe devolver un valor a memorizar, y el segundo es un array de dependencias que permitirán controlar cuando se relanza el hook. ¡Vamos a ponerlo en práctica!

Refactorizamos un poco el componente y haremos que los props se los envíe como props su componente padre... Con esto podremos ver que aunque el componente que lo contiene se rerendice X veces, los posts no se calcularán a menos que el prop `posts` cambie:

```tsx
import { useMemo, useState } from "react";

// const posts = [
//   {
//     slug: "html-desde-0",
//     date: "Fri Oct 06 2023 10:45:00 GMT+0200 (Central European Summer Time)"
//   },
//   {
//     slug: "css-desde-0",
//     date: "Thu Feb 17 2022 18:15:00 GMT+0100 (Central European Standard Time)"
//   },
//   {
//     slug: "javascript-desde-0",
//     date: "Tue Aug 23 2022 13:21:00 GMT+0200 (Central European Summer Time)"
//   }
// ];

const CodePostsRefactor = ({ posts }) => {
  // toggle para solicitar un render y ver si hace el calculo de nuevo
  const [rerender, setRerender] = useState(false);
  const orderedPostsWithTitle = useMemo(() => {
    // Pruébalo por tu cuenta y verás que no se repite este log!
    console.log("Generating posts...");
    return posts
      .map((post) => ({
        ...post,
        // transformamos la fecha a tipo fecha
        date: new Date(post.date),
        // formateamos el título
        title: post.slug.split("-").join(" ").toUpperCase()
      }))
      // ordenamos comparando las fechas
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((post) => ({
        ...post,
        // Volvemos a transformar las fechas a formato es-ES
        date: new Intl.DateTimeFormat("es-ES").format(post.date)
      }));
  }, [posts]);

  return (
    <div>
      <h1>Post destacados 😍</h1>
      <ul>
        {orderedPostsWithTitle.map((post) => (
          <li key={post.slug}>
            <h3>{post.title}</h3> {post.date}
            <hr />
          </li>
        ))}
      </ul>
      <button onClick={() => setRerender(!rerender)}>Rerender</button>
    </div>
  );
};

export default CodePostsRefactor;
```

¡Brutal! Ya sabemos como almacenar el resultado de operaciones complejas y costosas con grandes cantidades de datos 🔥