# useRef ReactJS

**Introducción**

---

Este Hook es muy interesante porque es un hook que nos permite almacenar una referencia a casi cualquier cosa con la que necesitemos interactuar 🙉. Vamos a ver algunos ejemplos para entenderlo mejor.

Podemos manipular directamente el DOM almacenando una referencia a un elemento `HTML`, ya que no usa el virtual DOM cuando trabajamos con estos elementos a través de `useRef`. Para crear una referencia a un elemento de `HTML`, dicho elemento debe tener la propiedad `ref` con el valor de la variable de referencia.

Además el hook `useRef` siempre nos devuelve un objeto mutable con una única propiedad llamada `current`, a la que accederemos a través de `refVariable.current`. ¡Aunque esto lo veremos mejor en código 💻!

**Renderizamos el valor imperativamente**

---

Vamos a crear un componente muy sencillo que tenga un input y lo enlazaremos a una referencia e imprimiremos el valor. Esto provocacará un nuevo renderizado solo cuando invoquemos a `printValue` en lugar de hacerlo a cada cambio del input.

```tsx
import { useRef, useState } from "react";

export const CodeUseRef = () => {
  const textInput = useRef(null);
  const [name, setName] = useState("Alberto");

  const printValue = () => {
		const inputValue = textInput.current?.value;
    if (inputValue) setName(inputValue);

    console.log("Imprime nombre:", inputValue);
  };

  return (
    <div>
      <h1>Hola soy {name}</h1>
      <input type="text" placeholder="name" ref={textInput} />
      <button onClick={printValue}>Mostrar</button>
    </div>
  );
};
```

![useRefOne.gif](useRef%20ReactJS%2049c958b8959d442abd5bc8e34f75aaee/useRefOne.gif)

**Autofocus en un campo input al montar el componente**

---

Podemos tener otro ejemplo en un formulario, le damos focus a un input cuando se renderice el componente por primera vez. Para ello dentro del `useEffect` realizaremos `focus` al input, y este useEffect ocurrirá solamente cuando el componente se monte.

```tsx
import { useRef, useEffect } from "react";

export const CodeRefFocus = () => {
  const focusInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusInputRef.current) focusInputRef.current.focus();
  }, []);

  return (
    <div>
      <form>
        <div>
          <label htmlFor="user">Usuario</label>
          <input type="text" id="user" placeholder="User" ref={focusInputRef} />
        </div>
        <div>
          <label htmlFor="pass">Constraseña</label>
          <input type="password" id="pass" placeholder="Pass" />
        </div>
      </form>
    </div>
  );
};
```

De tal modo que podemos ver que cuando se monta nuestro componente se hace auto focus al input al que hemos hecho referencia. Puedes probar recargando la página y verás que siempre te posiciona sobre el input de usuario:

![useRefFocus.gif](useRef%20ReactJS%2049c958b8959d442abd5bc8e34f75aaee/useRefFocus.gif)

**Calculadora de sueldo neto**

---

Ahora podemos ver un ejemplo más complejo con una calculadora de sueldo neto. Vamos a utilizar `useRef` para recoger los valores de los inputs sin provocar un rerender cuando cambiemos el valor de los campos al no modificar ningún estado.

```tsx
import { useRef } from "react";

export const CodeTaxCalculator = () => {
  const grossIncomeRef = useRef(null);
  const taxPercentRef = useRef(null);

  const getNetIncome = () => {
    const grossIncome = grossIncomeRef.current?.valueAsNumber;
    const taxPercent = taxPercentRef.current?.valueAsNumber;

    const total = grossIncome - grossIncome * (taxPercent / 100);
    console.log("The net total is:", total);
  };

  return (
    <div>
      <h1>Calculadora sueldo neto</h1>

      <label htmlFor="gross-income">Sueldo bruto</label>
      <input
        id="gross-income"
        name="gross-income"
        type="number"
        defaultValue="0"
        min="0"
        ref={grossIncomeRef}
      />

      <br />

      <label htmlFor="tax">Porcentaje de impuestos</label>
      <input
        id="tax"
        name="tax"
        type="number"
        defaultValue="10"
        min="0"
        max="100"
        ref={taxPercentRef}
      />

      <br />

      <button onClick={getNetIncome}>Obtener sueldo neto</button>
    </div>
  );
}
```

![sueldoneto.gif](useRef%20ReactJS%2049c958b8959d442abd5bc8e34f75aaee/sueldoneto.gif)

**Cambiar estilos directamente**

---

Además de esto podemos jugar con clases y estilos, vamos a añadir una clase de CSS a un elemento que ya se encuentra en el DOM.

```tsx
import { useRef } from "react";
import "../App.css";

export const CodeUseRefCss = () => {
  const colorRef = useRef(null);

  const changeColor = () => {
    colorRef.current.className === "box" ? 
			colorRef.current.className = "box-modify" : 
			colorRef.current.className = "box";
  };

  return (
    <>
      <div className="box" ref={colorRef}>
        I´m in a Box
      </div>
      <button onClick={changeColor}>Modify color</button>
    </>
  );
};
```

Y en el fichero de App.css añadimos los estilos que queramos.

```css
.box {
  background-color: skyblue;
}

.box-modify {
  background-color: coral;
}
```

Ahora cuando hagamos click en el botón cambiará una clase por otra sin necesidad de almacenar nada en el estado interno del componente 🦄

![useRefCss.gif](useRef%20ReactJS%2049c958b8959d442abd5bc8e34f75aaee/useRefCss.gif)

Con esto hemos entendido sintácticamente el funcionamiento de `useRef` . Pero os dejamos un último ejemplo para que podáis practicar.

```jsx
import { useEffect, useRef, useState } from 'react';

export const CodeInterval = () => {
  const [toggle, setToggle] = useState(false);
  // Creo un ref para almacenar el intervalo
  const intervalRef = useRef(null);

  useEffect(() => {
    // Cuando activo el toggle POR PRIMERA VEZ y NO TENGO INTERVALO guardado en intervalRef
    if (toggle && !intervalRef.current) {
      let time = 0;
      // Guardo el intervalo en intervalRef y por tanto,
      // ya no entra nunca más en el if
      intervalRef.current = setInterval(() => {
        time += 1000;

        console.log('Intervalo!', time);
        // Cuando time sea 30... puedo hacer una request
      }, 1000);
    }
  }, [toggle]);

  // Solamente LIMPIA el intervalo al desmontar el componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  console.log('Renderizando CodeInterval!');

  return (
    <div>
      <h3>CodeInterval</h3>

      <button onClick={() => setToggle(!toggle)}>Activar intervalo!</button>
    </div>
  );
};
```