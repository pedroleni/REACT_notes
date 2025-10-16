# Patterns avanzados ReactJS

**Introducción**

---

En ocasiones hemos querido abstraer o desacoplar nuestros componentes para hacerlos lo más flexible y menos complejo posible, esto viene dado por algunas preguntas que nos solemos hacer cuando llegamos a este punto:

- ¿Cómo construyo un componente reutilizable para adaptarse a diferentes casos de uso?
- ¿Cómo construyo un componente con una API simple, haciéndolo fácil de usar?
- ¿Cómo construyo un componente extensible en términos de interfaz de usuario y funcionalidad?

Si llevas poco tiempo trabajando con React dirás que es extraño que nadie se plantease antes estas cuestiones y la verdad es que ya ha habido muchos antes de nosotros.  

El concepto Pattern viene a responder estas dudas y hoy haremos un resumen de los 5 más interesantes desde nuestro punto de vista. También los llevaremos a comparación en los que valoraremos los siguientes puntos:

1. Introducción al Pattern 
2. Simple Code Example
3. Pros vs Cons
4. Librerías que hacen uso de este Pattern. 

**Compound Components Pattern || Componentes Compuestos**

---

Este patrón hace posible la creación de componentes expresivos y declarativos al tiempo que evita la `prop drilling`. Considera usar este patrón si deseas un componente personalizable, con una mejor separación de dependencias y una API comprensible.

Si quieres probar el código puedes seguir la guía de construcción:

[Code - Compound components](Patterns%20avanzados%20ReactJS%20f3b3efbbe74d4e1e83681fe500c7efbe/Code%20-%20Compound%20components%20514e5b7e5ccc4da89b180723ffed8475.md)

**Pros del uso de Compound Components Pattern || Componentes Compuestos**

---

**Complejidad reducida:** evita atascar todas las props en un componente principal gigante y desglosarlos en componentes secundarios. En cambio, las props se adjuntan al children del counter que tiene más sentido.

```jsx
<Counter 
	maxnumber={10}
	textincrement={plus}
	textdecrement={minus}
	onChange={handleChange}
/>

		VS.	|| VS.

<Counter onChange={handleChangeCounter}>
	<Counter.Decrement name="minus" />
  <Counter.Count maxnumber={10} />
  <Counter.Increment name="plus" />
 </Counter>
```

Flexibilidad en UI: nos permite usar estos componentes con la estructura que queramos sin tener que modificar los componentes.

```jsx
<Counter onChange={handleChangeCounter}>
	<Counter.Decrement name="minus" />
  <Counter.Count maxnumber={10} />
  <Counter.Increment name="plus" />
 </Counter>
```

![Captura de pantalla 2022-11-26 a las 17.23.21.png](Patterns%20avanzados%20ReactJS%20f3b3efbbe74d4e1e83681fe500c7efbe/Captura_de_pantalla_2022-11-26_a_las_17.23.21.png)

```jsx
<Counter onChange={handleChangeCounter}>
  <Counter.Count maxnumber={10} />
	<Counter.Decrement name="minus" />
  <Counter.Increment name="plus" />
 </Counter>
```

![Captura de pantalla 2022-11-26 a las 17.24.13.png](Patterns%20avanzados%20ReactJS%20f3b3efbbe74d4e1e83681fe500c7efbe/Captura_de_pantalla_2022-11-26_a_las_17.24.13.png)

**Separación de lógica:** la mayor parte de la lógica está centralizada en Counter. Se utiliza un contexto (CounterProvider + useCounterContext) para compartir estados (counter) y controladores (handleIncrement(), handleDecrement()) entre los elementos secundarios de Counter. Esto nos da una clara distribución de responsabilidades.

![Captura de pantalla 2022-11-26 a las 17.32.49.png](Patterns%20avanzados%20ReactJS%20f3b3efbbe74d4e1e83681fe500c7efbe/Captura_de_pantalla_2022-11-26_a_las_17.32.49.png)

**Contras del uso de Compound Components Pattern || Componentes Compuestos**

---

**Demasiada flexibilidad :** tener este nivel de flexibilidad también puede conducir a situaciones que no se anticiparon originalmente (ejemplos: código no deseado, orden de childs del contador incorrecto, child obligatorio faltante). 

```jsx
<Counter onChange={handleChangeCounter}>
  <div>Too much flexibility</div>
  <Counter.Decrement name="minus" />
  <Counter.Count maxnumber={10} />
  <Counter.Increment name="plus" />
</Counter>
```

![Captura de pantalla 2022-11-26 a las 17.43.44.png](Patterns%20avanzados%20ReactJS%20f3b3efbbe74d4e1e83681fe500c7efbe/Captura_de_pantalla_2022-11-26_a_las_17.43.44.png)

**Librerías**  **Compound Components Pattern || Componentes Compuestos**

---

[React-Bootstrap](https://react-bootstrap.github.io/components/dropdowns/)

[Accordion](https://reach.tech/accordion/)

**Control Props Pattern  || Control de props**

---

Este patrón convierte su componente en un componente controlado. Un estado externo se consume como una "única fuente de verdad" que permite a los desarrolladores insertar su propia lógica para modificar el comportamiento predeterminado del componente.

Si quieres probar el código puedes seguir la guía de construcción:

[Code - **Control Props Pattern**](Patterns%20avanzados%20ReactJS%20f3b3efbbe74d4e1e83681fe500c7efbe/Code%20-%20Control%20Props%20Pattern%2052cb24fdf56947f7a32623f1cf0d2d78.md)

**Pros del uso Control Props Pattern** 

---

Otorga más control → dado que el desarrollador controla el estado principal y puede influir directamente en el comportamiento del counter.

```jsx
export const WrappedCounterProps = () => {
  const [count, setCount] = useState(0);

  const handleChangeCounter = (newCount) => {
    if (newCount > 6) {
      setCount(newCount);
      console.log(newCount)
    }
  };

  return (
    <div className="compound-components">
      <Counter value={count} onChange={handleChangeCounter}>
        <Counter.Decrement name="minus" />
        <Counter.Count maxnumber={10} />
        <Counter.Increment name="plus" />
      </Counter>
    </div>
  );
}
```

![Captura de pantalla 2022-11-26 a las 18.45.08.png](Patterns%20avanzados%20ReactJS%20f3b3efbbe74d4e1e83681fe500c7efbe/Captura_de_pantalla_2022-11-26_a_las_18.45.08.png)

**Contras del uso Control Props Pattern**

---

Complejidad de implementación: Antes bastaba con una única integración (JSX) para que el componente funcionara. Ahora se distribuye en 3 lugares diferentes (JSX/useState/handleChange).

**Librería Control Props Pattern**

---

[MUI: The React component library you always wanted](https://mui.com/)

**Custom Hooks Patterns || Hooks personalizados** 

---

La lógica principal ahora se mueve a un hook personalizado. Este hook expone varias lógicas internas (states, controllers), lo que brinda un gran control a los desarrolladores.

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

**Pros de usar Custom Hook Pattern**

---

Otorga más control: los desarrolladores pueden insertar su propia lógica entre useCounter y el componente, lo que les permite modificar el comportamiento predeterminado del componente.

**Contras del uso Custom Hook Pattern**

---

Complejidad de implementación: Dado que la parte lógica está separada de la parte renderizada, depende de los desarrolladores vincular ambas.

**Librería Custom Hook Pattern**

---

[Home](https://react-hook-form.com/)

**UseReducer Pattern**

---

El useReducer está inspirado en el patrón Redux. Cuando tenemos mucha lógica o niveles de subcomponentes y así asegurar no tener problemas de mantenibilidad.

Vamos a tener un componente padre con los datos de un usuario y un componente hijo que nos va a servir para modificar o editar estos datos. 

Ahora vamos con nuestro Reducer, en el que recibe un **`User`** y una **`Action`** , para cada action disparará un evento que actúa sobre nuestro User. 

```tsx
const userReducer = (state, action) => {
  switch (action.type) {
    case actionIds.setName:
      return {
        ...state,
        name: action.payload,
      };
    default:
      return state;
  }
};
```

De tal modo que tenemos nuestro componente padre que hace uso del reducer, nuestro componente hijo que hace de input y quedaría.

```tsx
import { memo, useReducer } from "react";

const userReducer = (state, action): User => {
  switch (action.type) {
    case actionIds.setName:
      return {
        ...state,
        name: action.payload,
      };
    default:
      return state;
  }
};

const ChangeUser = memo((props) => {
  console.log(
    "Solo se renderiza cuando se updatea el nombre -> mira el hook memo"
  );

  return (
    <input
      value={props.name}
      onChange={(e) =>
        props.dispatch({ type: actionIds.setName, payload: e.target.value })
      }
    />
  );
});

const CodeUseReducer: React.FC = () => {
  const [userData, dispatch] = useReducer(userReducer, {
    name: "Alberto",
  });

  return (
    <div>
      <h1>{userData.name}</h1>
      <ChangeUser name={userData.name} dispatch={dispatch} />
    </div>
  );
};

export default CodeUseReducer;
```

Ahora para comprobar la escalabilidad podemos añadir más propiedades a nuestro User e ir probando el funcionamiento de nuestro Reducer.

**Pros de usar Use Reducer Pattern**

---

Nos permite trabajar con estados complejos y mutables sin hacer uso de librerías como Redux. En los casos más complicados, usar reducers de estado es la mejor manera de dejar el control a los desarrolladores. Ahora se puede acceder a todas las acciones internas de CodeUseReducer desde el exterior.

**Contra de usar Use Reducer Pattern**

---

Complejidad de implementación: este patrón es probablemente el más complejo de implementar.

Falta de visibilidad: dado que la acción de cualquier reductor se puede cambiar, se requiere una buena comprensión de la lógica interna del componente.

**Librería Use Reducer Pattern**

---

[GitHub - downshift-js/downshift: 🏎 A set of primitives to build simple, flexible, WAI-ARIA compliant React autocomplete, combobox or select dropdown components.](https://github.com/downshift-js/downshift#statereducer)