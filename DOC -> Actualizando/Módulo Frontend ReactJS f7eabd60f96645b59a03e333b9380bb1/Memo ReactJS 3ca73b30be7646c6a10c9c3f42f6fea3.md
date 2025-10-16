# Memo ReactJS

**Introducción**

---

Ya te habrás encontrado en bastantes ocasiones la necesidad de no renderizar de nuevo un componente aunque cambie el estado del componente padre, ¡pero sigue ocurriendo y no tienes forma de evitarlo! 😱 

Este comportamiento podremos obtenerlo a través de `React.memo`, una funcionalidad de React que permite a nuestros componentes realizar un `shallowCompare` de sus props. Esto quiere decir que para cada prop recibida, nuestro componente comprobará si las anteriores y las nuevas (`nextProps`) son exactamente iguales, y en caso de no serlo, permitirá un rerender del componente.

Esto puede generar problemas con objetos, arrays y funciones generadas a nivel del componente padre sin estar gestionadas a través de un estado, ya que para cada render estas se recalcularán y perderemos la referencia al elemento del render anterior, haciendo inútil un `shallowCompare`.

**Previniendo rerenders gracias a React.memo**

---

Vamos a ver un ejemplo de ello para ponerlo en práctica creando una vista donde dar puntuación a nuestras películas.

Creamos el componente `Movie.jsx` en el que pintaremos el título y puntuación de la peli.

```jsx
const Movie = ({ title, poster }) => {
	console.log('Renderizando Movie...');

  return (
    <div>
      <h3>{title}</h3>
      <img src={poster} alt={title} width={200} />
    </div>
  );
};

export default Movie;
```

Ahora crearemos otro componente `Review.jsx` donde almacenar una reseña y su puntuación, que será dinámica.

```jsx
const Review = ({ title, score }) => {
	console.log('Renderizando Review...');

  return (
    <div>
      <p>
        {title} - {score}
      </p>
    </div>
  );
};

export default Review;
```

Y por último, el componente padre tendrá un state que cambiará la puntuación según introduzcamos valores en un input.

```tsx
import { useState } from "react";
import Movie from "./MovieComponent";
import Review from "./ReviewComponent";

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="App">
      <Movie
        title="Guardianes de la Galaxia"
        poster="https://m.media-amazon.com/images/I/61-ndDQWTdL._AC_.jpg"
      />
      <hr />

      <label>Cambia tu puntuación:</label>
      <br />
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.valueAsNumber)}
      />
      <Review
        title="La he disfrutado muchísimo, siempre es un placer ver a los guardianes en acción"
        score={score}
      />
    </div>
  );
}
```

Esto lo veremos de la siguiente forma, fíjate en que los console.log de cada componente aparecen cada vez que cambia el estado del componente padre.

![guardiasnomemo.gif](Memo%20ReactJS%203ca73b30be7646c6a10c9c3f42f6fea3/guardiasnomemo.gif)

¿Pero es esto lo que buscamos? Seguro que piensas que idealmente no querríamos renderizar nuevamente el componente `Movie` cada vez que cambia el estado, ya que este componente no depende del valor `score`.

Esto es posible gracias a `React.Memo` ya que los props son fácilmente comparables entre renders, evitando renderizados de más, ¡vamos a verlo en acción!

```tsx
import React from "react";

const Movie = React.memo(({ title, poster }) => {
  console.log("Renderizando Movie...");

  return (
    <div>
      <h3>{title}</h3>
      <img src={poster} alt={title} width={200} />
    </div>
  );
});

export default Movie;
```

Hemos añadido React.memo como envoltura de nuestro componente, ahora solamente tenemos que ver que ocurre cuando cambiamos el valor del input.

![guardiaswithmemo.gif](Memo%20ReactJS%203ca73b30be7646c6a10c9c3f42f6fea3/guardiaswithmemo.gif)

¡Y ya lo tenemos, acabamos de optimizar nuestra aplicación!

A pesar de lo ventajoso que esto resulta, te recomendamos no abusar del uso de `React.memo` ya que envolver componentes con esta utilidad provocará una comprobación constante de los props, y es posible que inclinemos la balanza hacia el lado equivocado debido a un exceso de comprobaciones que ralentizarán la aplicación ⚖️.

Pues tal y como hemos visto, ya sabes optimizar tus componentes para prevenir un exceso de renders que afecten negativamente a tu aplicación, ¡aunque hay que usarlo con cabeza y únicamente cuando tengamos problemas de rendimiento primero!