# UseContext ReactJS

**Introducción**

---

React Context es una forma de administrar el estado globalmente. Se puede usar junto con `useState`Hook para compartir el estado entre componentes profundamente anidados más fácilmente que `useState`solo.

**El problema**

---

El estado debe estar en manos del componente principal más alto en la pila que requiere acceso al estado.

Para ilustrar, tenemos muchos componentes anidados. El componente en la parte superior e inferior de la pila necesita acceso al estado.

Para hacer esto sin contexto, necesitaremos pasar el estado como "props" a través de cada componente anidado. Esto se llama "prop drilling".

Vamos a ver con un ejemplo sencillo para entender el problema y así entender el uso del Context. Vamos a crear una serie de componentes dentro de nuestra carpeta de components.

![Captura de Pantalla 2022-10-01 a las 20.43.49.png](UseContext%20ReactJS%200cd8b96cf1f54e028ded7e39e4ed5b87/Captura_de_Pantalla_2022-10-01_a_las_20.43.49.png)

```jsx
import { useState } from "react";
import { Component2 } from "./Component2"

export const Component1 = ({ user }) => {
  const [user, setUser] = useState("Alberto Rivera");

  return (
    <>
      <h1>{`Hello ${user}!`}</h1>
      <Component2 user={user} />
    </>
  );
}
```

```jsx
import { Component3 } from "./Component3"

export const Component2 = ({ user }) => {

  return (
    <>
      <h1>Component 2</h1>
      <Component3 user={user} />
    </>
  );
}
```

```jsx
import { Component4 } from "./Component4"
export const Component3 = ({ user }) => {
  return (
    <>
      <h1>Component 3</h1>
      <Component4 user={user} />
    </>
  );
}
```

```jsx
import { Component5 } from "./Component5"

export const Component4 = ({ user }) => {

  return (
    <>
      <h1>Component 4</h1>
      <Component5 user={user} />
    </>
  );
}
```

```jsx
export const Component5 = ({ user }) => {

  return (
    <>
      <h1>Component 5</h1>
      <h2>{`Hello ${user} again!`}</h2>
    </>
  );
}
```

Y en nuestro App.jsx podemos importar nuestro Component1 para así ver el resultado.

```jsx
import { useState } from 'react'
import './App.css'
import { Component1 } from './context/Component1'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Component1 />
    </div>
  )
}

export default App
```

Como podemos observar estamos pasando por todos los componentes pese a que el user solamente lo necesitamos en el Componente1 (donde lo iniciamos) y el Componente5.

![Captura de Pantalla 2022-10-01 a las 20.56.59.png](UseContext%20ReactJS%200cd8b96cf1f54e028ded7e39e4ed5b87/Captura_de_Pantalla_2022-10-01_a_las_20.56.59.png)

**La solución**

---

Pues la solución pasa por crear un contexto. Para crear contexto, debe importarlo `createContext` e inicializarlo. Lo haremos sobre el Component1 que es el elemento que está en lo más alto de nuestra Pila (Si lo necesitásemos en todos lo haríamos sobre App).

```jsx
import { useState, createContext } from "react";
const UserContext = createContext();
```

A continuación, usaremos el provider de contexto para envolver el árbol de componentes que necesitan el contexto de estado.

**Provider Context**

---

Envuelve los componentes secundarios en el proveedor de contexto y proporciona el valor del estado.

```jsx
import { useState, createContext } from "react";
import { Component2 } from "./Component2"

export const UserContext = createContext();

export const Component1 = () => {
  const [user, setUser] = useState("Alberto Rivera");

  return (
    <>
      <UserContext.Provider value={user}>
        <h1>{`Hello ${user}!`}</h1>
        <Component2 user={user} />
      </UserContext.Provider>
    </>
  );
}
```

Ahora, todos los componentes de este árbol tendrán acceso al contexto del usuario.

**Usamos el Hook de useContext en el resto de componentes**

---

Para usar el Contexto en un componente secundario, necesitamos acceder a él usando el `useContext`Hook. Primero, incluye `useContext`en la declaración de importación. En nuestro caso lo haremos sobre el Componente5 que es el que necesita la información del user.

```jsx
import { useContext } from "react";
import { UserContext } from "./Component1";
```

Luego podemos acceder al Contexto del usuario en todos los componentes, aunque como he indicado lo vamos a probar en el Componente5.

```jsx
import { useContext } from "react";
import { UserContext } from "./Component1";

export const Component5 = () => {
  const user = useContext(UserContext);
  return (
    <>
      <h1>Component 5</h1>
      <h2>{`Hello ${user} again!`}</h2>
    </>
  );
}
```

**Recordatorio**

---

Recuerda limpiar el paso por props de user del resto de componentes.

```jsx
import { Component3 } from "./Component3"

export const Component2 = () => {

  return (
    <>
      <h1>Component 2</h1>
      <Component3 />
    </>
  );
}
```

**Resultado**

---

Ahora que no pasa por cada uno de los componentes observamos que vamos a obtener el mismo resultado.

![Captura de Pantalla 2022-10-01 a las 21.14.07.png](UseContext%20ReactJS%200cd8b96cf1f54e028ded7e39e4ed5b87/Captura_de_Pantalla_2022-10-01_a_las_21.14.07.png)

Genial ahora tenemos los conceptos básicos del useContext asentados con este pequeño ejemplo. Pero podemos profundizar con algunos ejemplos más complejos e incluso dar super-poderes a nuestro provider.

**ThemeContext**

---

Vamos a crear un contexto para manejar el Theme de nuestra aplicación, para ello empezamos como siempre con un nuevo proyecto. 

```bash
npm create vite@latest
```

Una vez que estamos dentro lo primero será limpiar el proyecto y los estilos para gestionar nuestro Theme.

**Estructura de carpetas y ficheros**

---

Creamos una carpeta dentro de src con el nombre context y dentro de ella un fichero bajo el nombre de ThemeContext.jsx. 

![Captura de Pantalla 2022-10-01 a las 21.24.01.png](UseContext%20ReactJS%200cd8b96cf1f54e028ded7e39e4ed5b87/Captura_de_Pantalla_2022-10-01_a_las_21.24.01.png)

**Trabajando en el ThemeContext**

---

Lo primero como siempre debemos crear nuestro contexto. Cuando inicializamos el Contexto le dotaremos de un objeto con las propiedades theme (dark - light) y una función que puede modificar dicho theme → toggleTheme.

```jsx
import { createContext } from 'react';

export const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => null,
});
```

**Dotando de funcionalidad a nuestro Povider**

---

Aquí estará lo más complejo de entender de este ejemplo pero intentaremos ir paso por paso para entender la funcionalidad que estamos dotando.

a. Definimos una función ThemeContextProvider que será nuestro envoltorio de componentes haciendo uso de *children*.

```jsx
export const ThemeContextProvider = ({ children, }) => {

  return (
    <ThemeContext.Provider>
      {children}
    </ThemeContext.Provider>
  );
}
```

b. Como bien sabemos para gestionar el theme necesitamos un state que nos permita cambiar la propiedad del theme de dark (valor por defecto) a light. Y además por rizar el rizo vamos a comprobar si el local.storage tiene almacenado las preferencias del usuario. [Ya sabemos que no pero después configuraremos la manera de guardarlo].

```jsx
export const ThemeContextProvider = ({ children, }) => {
  // Definimos el control que haremos sobre los datos del Provider
  const [theme, setTheme] = useState(
    // Inicializamos el state de forma lazy para leer localStorage primero
    () => (localStorage.getItem('theme')) || 'dark'
  );

  return (
    <ThemeContext.Provider>
      {children}
    </ThemeContext.Provider>
  );
}
```

c. Dotamos de valor la función toggleTheme que era null en principio, tener en cuenta que no debemos perder la referencia de esta por lo que tendremos que envolverla en un useCallback.

```jsx
// Definimos el provider: 
export const ThemeContextProvider = ({ children, }) => {
  // Definimos el control que haremos sobre los datos del Provider
  const [theme, setTheme] = useState(
    // Inicializamos el state de forma lazy para leer localStorage primero
    () => (localStorage.getItem('theme')) || 'dark'
  );

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider>
      {children}
    </ThemeContext.Provider>
  );
}
```

d. Antes de pasar los valores a nuestro provider, vamos a hacer uso de un useEffect para cada vez  que arranque nuestro Contexto compruebe si tenemos el valor de theme almacenado en el local.storage y guardarlo actualizado.

```jsx
// Definimos el provider: 
export const ThemeContextProvider = ({ children, }) => {
  // Definimos el control que haremos sobre los datos del Provider
  const [theme, setTheme] = useState(
    // Inicializamos el state de forma lazy para leer localStorage primero
    () => (localStorage.getItem('theme')) || 'dark'
  );

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  // Cada vez que theme cambie, lo guardo actualizado en localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider>
      {children}
    </ThemeContext.Provider>
  );
}
```

e. Genial! llegamos al último paso que es pasarle la config a nuestro Provider.

```jsx
// Definimos el provider: 
export const ThemeContextProvider = ({ children, }) => {
  // Definimos el control que haremos sobre los datos del Provider
  const [theme, setTheme] = useState(
    // Inicializamos el state de forma lazy para leer localStorage primero
    () => (localStorage.getItem('theme')) || 'dark'
  );

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  // Cada vez que theme cambie, lo guardo actualizado en localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
```

**Resultado**

---

Nuestro contexto debería lucir de la siguiente manera.

```jsx
import React, {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';

// Creamos contexto del Theme
export const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => null,
});

// Definimos el provider: 
export const ThemeContextProvider = ({ children, }) => {
  // Definimos el control que haremos sobre los datos del Provider
  const [theme, setTheme] = useState(
    // Inicializamos el state de forma lazy para leer localStorage primero
    () => (localStorage.getItem('theme')) || 'dark'
  );

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  // Cada vez que theme cambie, lo guardo actualizado en localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
```

**Usar de manera global**

---

Como queremos que el Theme englobe a toda nuestra aplicación debemos usarla envolviendo a “Todos” nuestros componentes y para ello el mejor sitio es en el main.jsx.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeContextProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </React.StrictMode>
)
```

**Componente Swichter**

---

Una vez que tenemos nuestro contexto podemos crear un componente Switcher para cambiar el state de nuestro contexto. Simplemente toggleamos haciendo uso de la función creada en nuestro provider.

```jsx
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const ThemeSwitcher = () => {
  // Accedemos a los valores de ThemeContext
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="theme-button" type="button" onClick={toggleTheme}>
      {theme === 'dark' ? '🌞' : '🌚'}
    </button>
  );
};

export default ThemeSwitcher;
```

Usamos el ThemeSwitcher en el app.jsx. Además de añadir algunas clases y usar el context.

```jsx
import React, { useContext } from 'react';
import './App.css'
import ThemeSwitcher from './components/ThemeSwitcher';
import { ThemeContext } from './context/ThemeContext';

function App() {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`App color-${theme}`}>
      <header>
        <ThemeSwitcher />
      </header>
    </div>
  )
}

export default App
```

**Estilos**

---

Vamos a dar estilos antes de ver el reusltado final. Os dejamos los estilos de los fichero app.css. Os recuerdo que en el index.css hemos eliminado los estilos.

```css
body {
  margin: 0;
}

header {
  display: flex;
  justify-content: center;
}

.color-dark,
.color-light {
  height: 100vh;
}

.color-dark {
  background-color: #1a1a1a;
  color:  rgba(255, 255, 255, 0.87);
}

.color-light {
  background-color: rgba(255, 255, 255, 0.87);
  color: #1a1a1a;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-family: inherit;
  cursor: pointer;
  margin: 5rem;
  background-color: yellowgreen;
}

button:hover {
  border-color: #646cff;
}
```

Genial! pues ya tenemos un ThemeColor o DarkMode implementado en nuestro contexto. Os dejo el resultado.

![darkmode.gif](UseContext%20ReactJS%200cd8b96cf1f54e028ded7e39e4ed5b87/darkmode.gif)