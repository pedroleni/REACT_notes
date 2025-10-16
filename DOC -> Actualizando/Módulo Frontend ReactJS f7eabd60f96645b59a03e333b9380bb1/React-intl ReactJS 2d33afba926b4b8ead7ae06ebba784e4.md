# React-intl ReactJS

**Introducción**

---

`React-Intl` es una librería de JavaScript que nos permite internacionalizar nuestra aplicación. La `internacionalización` es el proceso de diseñar una aplicación con diferentes idiomas, localizando el de nuestra maquina local o permitiéndonos seleccionar que idioma aplicar.

Esto no solo contempla los textos y mensajes, sino también los números, fechas, divisas y unidades. 

**Proyecto intl**

---

Vamos a trabajar sobre la aplicación por defecto que nos ofrece React al configurar una nueva aplicación:

```bash
npm create vite@latest
cd react-intl-app
```

Una vez tengamos la aplicación base vamos a respetar en esta ocasión la estructura base que nos propone React, tal y como hemos mencionado, y vamos a instalar directamente la librería `React-Intl`

```bash
npm install react-intl
```

Al arrancar la aplicación veremos la página tal cual de React, así que vamos a trabajar sobre ella, ya que es una buena base para entender los conceptos y el uso de esta librería.

**Estructura de carpetas**

---

La estructura de nuestra aplicación será la misma que nos genera React con la particularidad de una carpeta llamada `lang` dentro de `src` donde irán todos los `.json` con los diferentes idiomas que utilizaremos en nuestra aplicación. 

En este ocasión vamos a aplicarle Inglés, Español y Francés.

![Captura de Pantalla 2022-10-03 a las 9.02.51.png](React-intl%20ReactJS%202d33afba926b4b8ead7ae06ebba784e4/Captura_de_Pantalla_2022-10-03_a_las_9.02.51.png)

A la hora de internacionalizar nuestra aplicación nos preguntaremos cómo se detecta el idioma por defecto del usuario. 

**IntlProvider & navigator**

---

Normalmente los usuarios tienen definido su idioma en el navegador, idioma detectable a través del objeto `navigator.language` incluido en prácticamente todos los navegadores de hoy en día.

Lo primero que tendremos que hacer es modificar nuestro archivo `main.js` en la raíz del proyecto, importando `IntlProvider` de `react-intl`.

Vamos a incluir una variable llamada `locale` que nos lea el valor de este objeto, importar los 3 idiomas que hemos creado y definir un condicional que nos recoja un idioma u otro según el valor de la variable.

Vamos a anidar nuestro componente `App` dentro de `IntlProvider` pasándole por props tanto la variable `locale` como una llamada `messages` a la que aplicaremos el idioma más adelante.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { IntlProvider } from "react-intl";

import Spanish from '../lang/es.json'
import English from '../lang/en.json'
import French from '../lang/fr.json'

import App from './App'
import './index.css'

const recoverLang = () => {
 return navigator.language === "fr-FR"
    ? French
    : navigator.language === "es-ES"
    ? Spanish
    : English;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IntlProvider locale={navigator.language} messages={recoverLang()}>
      <App />
    </IntlProvider>
  </React.StrictMode>
)
```

Ahora mismo si intentamos arrancar nuestra aplicación romperá ya que no hemos definido las traducciones, por lo que vamos a ello!

**Traducciones**

---

Vamos a basarnos en los textos presentados en pantalla por React y definir el contenido de nuestros tres json de la siguiente forma.

```json
// lang/en.json
{
  "app.header": "Edit the files and save to reload",
  "app.content": "Learn React",
  "app.channel.plug": "Internationalization for Students"
}
```

```json
// lang/es/json
{
  "app.header": "Edita los archivos y guarda para refrescar",
  "app.content": "Aprende React",
  "app.channel.plug": "Internacionalizacion para Students"
}
```

```json
// lang/fr/json
{
  "app.header": "Modifier les fichiers et les enregistrer pour les actualiser",
  "app.content": "Apprendre React",
  "app.channel.plug": "L'internationalisation pour Students"
}
```

Esta sintaxis se denomina sintaxis ICU, parte de FormatJS, en el cual podemos declarar y extraer mensajes de la misma forma que lo hacemos de una API. Vamos a ver esto en nuestro componente App a través de `FormattedMessage`, uno de los componentes de `react-intl` que nos permite extraer y pintar nuestras traducciones.

```jsx
import reactLogo from './assets/react.svg'
import { FormattedMessage } from "react-intl";

import './App.css'

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <p>
          <FormattedMessage
            id="app.header"
            defaultMessage="Edit the files and save to reload"
          />
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FormattedMessage id="app.content" defaultMessage="Learn React" />
        </a>
        <FormattedMessage
          id="app.channel.plug"
          defaultMessage="Internationalization for Students"
        />
      </header>
    </div>
  )
}

export default App
```

Tal y como aparece en el código podemos ver que a través del componente le estamos pasando por `id` cada una de las propiedades de nuestro JSON y un `defaultMessage` que, tal y como su nombre indica, será el mensaje por defecto si no hay un idioma seleccionado que lo sobreescriba. 

**Argumentos y pequeñas modificaciones**

---

En `React Intl` podemos crear argumentos para variar el texto hardcodeado que hemos insertado en nuestros archivos de idiomas. Es tan simple como añadir una variable entre las strings a la cual podremos acceder desde el punto de aplicación donde la estemos aplicando. Por ejemplo → lang/en.json

```json
{
  "app.header": "Edit the files and save to reload",
  "app.content": "Learn React",
  "app.channel.plug": "Internationalization for {username}"
}
```

Como podéis ver hemos sustituido "Students" por una variable llamada `username` entre llaves. De esta forma podemos incluir en nuestro `FormattedMessage` otra key que mencione a dicha variable y sustituirla.

```jsx
<FormattedMessage
  id="app.channel.plug"
  defaultMessage="Internationalization for students"
  values={{ username: "Peter Parker" }}
/>
```

**Selector de idiomas**

---

En este apartado vamos a ver como cambiar nuestro idioma usando un menú y cambiando el el estado, siendo esta la forma correcta de hacerlo y no como lo estábamos haciendo antes.

Para empezar vamos a crear una carpeta `context` en la que añadiremos un archivo llamado `context-language.js`. Este contexto contendrá el selector de idiomas y nos permitirá cambiar la localización del navegador.

```jsx
import React, { useState, createContext } from 'react'

import { IntlProvider } from 'react-intl'

import French from '../lang/fr.json'
import Spanish from '../lang/es.json'
import English from '../lang/en.json'

export const contextLanguage = createContext();

const recoverLang = () => {
  return navigator.language === "fr" ? French : navigator.language === "es" ? Spanish : English;
}

const ProviderLanguage = (props) => {
  const [locale, setLocale] = useState(navigator.language);
  const [messages, setMessages] = useState(recoverLang());

  const handleLanguage = (e) => {
    setLocale(e.target.value);
    setMessages(e.target.value === "fr" ? French : e.target.value === "es" ? Spanish : English);
  }

  return (
    <contextLanguage.Provider value={{ locale, handleLanguage }}>
      <IntlProvider messages={messages} locale={locale}>
        {props.children}
      </IntlProvider>
    </contextLanguage.Provider>
  );
};

export default ProviderLanguage;
```

Vamos a darle uso al `contexto` para seleccionar los idiomas cambiando el contexto del mismo mediante un componente selector de language.

```jsx
import { useContext } from "react";
import { contextLanguage } from "../context/languageContext";

const SelectLanguage = () => {
  const {handleLanguage} = useContext(contextLanguage);
  return (
    <select
      name="language"
      id="language"
      onChange={handleLanguage}
    >
      <option value="en-EN">English</option>
      <option value="es-ES">Spanish</option>
      <option value="fr-FR">French</option>
    </select>
  );
};

export default SelectLanguage;
```

Genial! Pues con si usamos el componente Selector de idioma y el FormattedMessage en nuestro App para probarlo veremos el resultado de nuestro desarrollo.

```jsx
import React from 'react'
import { FormattedMessage } from 'react-intl'

import reactLogo from './assets/react.svg'
import './App.css'
import SelectLanguage from './components/SelectLanguage'

function App() {

  return (
    <div className="App">
      <SelectLanguage />
      <header className="App-header">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <p>
          <FormattedMessage
            id="app.header"
            defaultMessage="app.header"
          />
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FormattedMessage id="app.content" defaultMessage="app.content" />
        </a>
        <FormattedMessage
          id="app.channel.plug"
          values={{ username: "Peter Parker" }}
        />
      </header>

    </div>
  )
}

export default App
```

Os recordamos que los contextos deben envolver nuestro app en caso que sean globales, por ello en el main.jsx debemos provisionarselo.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import ProviderLanguage from './context/context-language'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProviderLanguage>
      <App />
    </ProviderLanguage>
  </React.StrictMode>
)
```

**Fecha local**

---

Al definir React-Intl hemos dicho que también había que tener el cuenta el formato de las fechas, por lo que vamos a hacer uso de el componente `FormattedDate` para que nos pinte la fecha actual en un determinado formato. 

```jsx
import React from 'react'
import { FormattedMessage, FormattedDate } from 'react-intl'

import reactLogo from './assets/react.svg'
import './App.css'
import SelectLanguage from './components/SelectLanguage'

function App({ date }) {

  return (
    <div className="App">
      <SelectLanguage />
      <header className="App-header">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <p>
          <FormattedMessage
            id="app.header"
            defaultMessage="app.header"
          />
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FormattedMessage id="app.content" defaultMessage="app.content" />
        </a>
        <FormattedMessage
          id="app.channel.plug"
          values={{ username: "Peter Parker" }}
        />
        <FormattedDate
          value={date}
          year="numeric"
          month="long"
          day="numeric"
          weekday="long"
        />
      </header>

    </div>
  )
}

export default App
```

Los props son enviados de componentes padres a hijos, así que vamos a invocar a nuestro componente.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import ProviderLanguage from './context/context-language'

import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ProviderLanguage>
      <App date={Date.now()} />
    </ProviderLanguage>
  </React.StrictMode>
)
```

![react-intl.gif](React-intl%20ReactJS%202d33afba926b4b8ead7ae06ebba784e4/react-intl.gif)