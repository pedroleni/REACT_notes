# Code - Control Props Pattern

Context → Elemento  comunicador sobre los elementos sin necesidad del paso de props [prop drilling].

```jsx
import React from "react";

const CounterContext = React.createContext(undefined);

const CounterProvider = ({ children, value }) => {
  return (
    <CounterContext.Provider value={value}>{children}</CounterContext.Provider>
  );
}

function useCounterContext() {
  const context = React.useContext(CounterContext);
  if (context === undefined) {
    throw new Error("useCounterContext must be used within a CounterProvider");
  }
  return context;
}

export { CounterProvider, useCounterContext };
```

Components → Elemento para aumentar el contador || Elemento para disminuir el contador || Elemento para mostrar el contador.

```jsx
import React from "react"
import { useCounterContext } from "../../context/CounterContext"

export const Increment = ({ name = "plus" }) => {
  const { handleIncrement } = useCounterContext()
  return (
    <button onClick={handleIncrement}>
      {name}
    </button>
  )
}
```

```jsx
import React from "react"
import { useCounterContext } from "../../context/CounterContext"

export const Decrement = ({ name = "minus" }) => {
  const { handleDecrement } = useCounterContext()
  return (
    <button onClick={handleDecrement}>
      {name}
    </button>
  )
}
```

```jsx
import React from "react";
import { useCounterContext } from "../../context/CounterContext"

export const Count = ({ maxnumber }) => {
  const { count } = useCounterContext();

  const haserror = maxnumber ? count >= maxnumber : false;

  return <h1 haserror={haserror.toString()}>{count}</h1>;
}
```

Componente Counter → Este elemento es el que va agrupar los elementos y usar el provider.

```jsx
import React, { useEffect, useRef, useState } from "react";
import { CounterProvider } from "../context/CounterContext";
import { Count, Decrement, Increment } from "./elements";

const Counter = ({ children, onChange, initialValue = 0 }) => {
  const [count, setCount] = useState(initialValue);

  const firstMounded = useRef(true);
  useEffect(() => {
    if (!firstMounded.current) {
      onChange && onChange(count);
    }
    firstMounded.current = false;
  }, [count, onChange]);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    setCount(Math.max(0, count - 1));
  };

  return (
    <CounterProvider value={{ count, handleIncrement, handleDecrement }}>
      {children}
    </CounterProvider>
  );
}

Counter.Count = Count;
Counter.Increment = Increment;
Counter.Decrement = Decrement;

export { Counter };
```

Componente WrappedComponent → Es el componente que vamos a exportar para ser utilizado en cualquier punto de nuestra aplicación.

```jsx
import React, { useState } from "react";
import { Counter } from "./components/Counter";

export const WrappedCounter = () => {
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

De tal modo en nuestra app.jsx podemos visualizarlo y usar toda la funcionalidad asociada en cada uno de los elementos que lo componen.

```jsx
import { WrappedCounter } from './control-props/WrappedCounter'

function App() {
  return (
    <div className="App">
      <WrappedCounter />
    </div>
  )
}

export default App
```