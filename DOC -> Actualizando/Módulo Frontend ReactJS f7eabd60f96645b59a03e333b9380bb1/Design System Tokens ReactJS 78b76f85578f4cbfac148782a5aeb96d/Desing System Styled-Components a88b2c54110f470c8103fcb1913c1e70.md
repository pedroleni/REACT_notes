# Desing System Styled-Components

**Introducción 🧐**

---

Es una librería que nos permite dar estilos a nuestros componentes de React, la particularidad es que nos crea un componente en el cual definimos sus estilos y podemos usarlos en varios puntos wrappeando o envolviendo nuestros componentes funcionales.

Estos componentes podemos condicionarlos a las propiedades o lógica que queramos, provocando un gran dinamismo a la hora de definir los elementos visuales de nuestra aplicación de React. Además nos deja crear clases automáticas para cada uno de los componentes, de este modo no se pisan nuestros estilos.

**Cambio de paradigma 🦾**

---

En el momento que decidimos usar los styled-components nos encontramos ante un cambio de paradigma. Como ya habéis visto cuando generamos nuestros Tokens podemos exportarlos en un fichero con la extension `json` que nos facilita la labor de la creación de choices.

**Creación de un proyecto de React con Emotion (styled-components)**

---

Empezamos creando nuestro proyecto con Vite. Para ello como siempre hacemos solamente tenemos que ejecutar el siguiente comando.

```bash
npm create vite@latest
```

[](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAABDUlEQVR4AYXRgUZDYRjH4TegFTKgpEqiFJgoWAoMEQGBgBboChaaAKxLKAhAhQqAdAmpBIQolkCFqp2nITvNKXuA7+/Hhzey5OWjE4Nq3rzY1f9/NGHPB549492+8Ww060iCS2XdctZdI3GsECmb+HJoIX6x6EgDm+lURTH+YB7V9nAqE5WNme4YKuOiY6iMe6PaQxUUIuTbswgFVNJwA8sO3Bn6yR6bWZMSNtJwDtuWfHpQxaPx9C9zadil7jrCigbq6UXceNIVKTWUIqypm2ytJdTiNyNeXclF6GttOVfeDEc7qzjR23r3OMFqZKng1kw0mXGLrfibHTScOZWgGv9TdC6ROFeMTgwYiIxvJzMRWQbeGZUAAAAASUVORK5CYII=)

Una vez tenemos el proyecto configurado en nuestro caso bajo el nombre de emotion-react-app debemos instalar las dependencias por defecto y además las de la librería.

```bash
npm i @emotion/react @emotion/styled
```

Y como dependencia de desarrollo añadimos el plugin de emotion/babel.

```jsx
npm i -D @emotion/babel-plugin
```

Genial ahora a nuestro fichero de vite.config le tenemos que decir que vamos a usar emotion.

```jsx
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
});
```

Y por último limpiamos nuestro proyecto y eliminamos los documentes css generados puesto que en adelante usaremos los componentes de Styled.

**Definición de un Tema**

---

Usar esta librería nos puede agilizar o ayudar en tareas de maquetación, con ello quiero decir que nos permite definir un theme y que ciertos estilos, colores, fuentes… sean globales en nuestro proyecto.

Para ello en `src` vamos a crear una carpeta `style` que contiene tres ficheros, uno que define el theme, otro como provider para usar a nivel global y finalmente un utils con funcionalidades genéricas.

Primero vamos a definir una serie de funcionalidades que son necesarias para la creación de un tema. Por ello creamos un fichero `utils.js`.

La primera funcionalidad será una función spacing que nos permite marcar el espaciado de mi aplicación en base a 8.

```jsx
const SPACE_PIXELS_VALUE = 8;

export const spacing = (spaceV, spaceH) =>
  spaceH !== null && spaceH !== undefined
    ? `${spaceV * SPACE_PIXELS_VALUE}px ${spaceH * SPACE_PIXELS_VALUE}px`
    : `${spaceV * SPACE_PIXELS_VALUE}px`;
```

La segunda funcionalidad que definimos es una pequeña función que nos comprueba si un elemento es un objeto plano.

```jsx
const isPlainObject = item =>  item !== null && typeof item === 'object' && item.constructor === Object
```

Y por último es una función generadora de temas, la hemos sacado de la librería de materialUI y hemos replicado su comportamiento.

```jsx
export const createTheme = (baseTheme, theme) => {
  const output = { ...baseTheme };
  if (isPlainObject(baseTheme) && isPlainObject(theme)) {
    Object.keys(theme).forEach((key) => {
      if (key === '__proto__') {
        return;
      }
      if (
        isPlainObject(theme[key]) &&
        key in baseTheme &&
        isPlainObject(baseTheme[key])
      ) {
        [key] = createTheme(
          baseTheme[key],
          theme[key]
        );
      } else {
        [key] = theme[key];
      }
    });
  }
  return output;
}
```

Antes de ir a definir nuestro theme os propongo añadir en public una carpeta fonts con vuestras fuentes tipográficas.

![Captura de Pantalla 2022-10-10 a las 13.15.00.png](../Emotion%20theme%20ReactJS%202bf80e06c6114732ad71b3a87ec7cb9a/Captura_de_Pantalla_2022-10-10_a_las_13.15.00.png)

Genial! seguimos con el `theme.js` en el cual tendremos que definir desde los breakpoints de pantallas hasta colores pero podéis hacerlo todo lo complejo que queráis.

Para definir los valores de los breakpoints podemos definir una constante en la que almacenamos key:value 

```jsx
export const BREAKPOINTS = {
  extraSmall: 320,
  mobile: 576,
  tablet: 768,
  laptop: 992,
  desktop: 1200,
};
```

Igual que definimos los tamaños de ventana también podemos dejar fijamos los z-index para no acabar usando valores absurdos que añaden mayor profundidad.

```jsx
export const ZINDEX = {
  base: 100,
  modal: 200,
  spinner: 300,
};
```

Ahora definimos nuestros colores, para ello puedes usar la lógica que se adapte mejor en el proyecto aunque suele venir definida en un design system.

```jsx
const PRIMARY_PALETTE = {
  pink: '#ff758f',
}

const SECONDARY_PALETTE = {
  moon: '#999999',
  snow: '#F4F4F4',
  coal: '#333333',
}

const ALERT_PALETTE = {
  error: '#E74C3C',
  success: '#2ECC71',
  warning: '#F1C40F',
}
```

Definimos nuestro theme en base a los valores que nos han marcado vía design system o diseño.

```jsx
export const theme = {
  palette: {
    background: SECONDARY_PALETTE.coal,
    title: PRIMARY_PALETTE.pink,
    text: SECONDARY_PALETTE.snow,
    button: {
      background: PRIMARY_PALETTE.pink,
      border: SECONDARY_PALETTE.snow,
      text: SECONDARY_PALETTE.coal,
    },
    alert: {
      error: ALERT_PALETTE.error,
      success: ALERT_PALETTE.success,
      warning: ALERT_PALETTE.warning,
    }
  },
  mediaquery: {
    mobile: `@media (max-width: ${BREAKPOINTS.tablet}px)`,
    tablet: `@media (min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.desktop}px)`,
    desktop: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
  },
  typography: {
    fonts: {
      bold: '/assets/fonts/Rubik-Bold.ttf',
      italic: '/assets/fonts/Rubik-Italic.ttf',
      regular: '/assets/fonts/Rubik-Regular.ttf',
      semibold: '/assets/fonts/Rubik-SemiBold.ttf',
    },
  },
  spacing
}
```

Una vez tenemos el tema definido debemos hacer uso de `Global` de `@emotion/react` para definir dotar de sentido el theme generado, asignando los valores predeterminados. 

```jsx
import { Global } from '@emotion/react'

const GlobalStyles = () => {
  return (
    <Global
      styles={(theme) => [
        {
          "*": {
            fontFamily: "Regular",
            boxSizing: "border-box",
          },
          "html,body": {
            padding: 0,
            margin: 0,
            backgroundColor: theme.palette.background,
            color: theme.palette.text,
          },
          a: {
            color: "inherit",
            textDecoration: "none",
          },
        },
        {
          "@font-face": {
            fontFamily: "Regular",
            src: `url(${theme.typography.fonts.regular}) format("truetype")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "Italic",
            src: `url(${theme.typography.fonts.italic}) format("truetype")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "Bold",
            src: `url(${theme.typography.fonts.bold}) format("truetype")`,
          },
        },
        {
          "@font-face": {
            fontFamily: "SemiBold",
            src: `url(${theme.typography.fonts.semibold}) format("truetype")`,
          },
        },
      ]}
    />
  );
};

export default GlobalStyles;
```

**Usando el tema**

---

una vez tenemos nuestros estilos definidos a través de un theme podemos usarlo con el `ThemeProvider` de `@emotion/react` que nos permite tener un contexto para trabajar con nuestro theme en cualquier punto de nuestro aplicación.

Para ello en el `main.jsx` podemos importarlo y usar  nuestros estilos globales, vamos a verlo.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'

import { ThemeProvider } from '@emotion/react'
import GlobalStyles from './styles/globalStyles';
import { createTheme } from './styles/utils';
import { theme } from './styles/theme';

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme(theme)}>
      <GlobalStyles />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
```

Si escribimos dentro de nuestro App un h1 y un p para poder comprobar si se está aplicando el tema.

```jsx
const App = () => {
  return (
    <div>
      <h1>Bienvenidos a React + Emotion</h1>
      <p>Un nuevo enfoque de estilar nuestras aplicaciones</p>
    </div>
  )
}

export default App
```

El resultado obtenido debería ser algo similar a lo que vemos en la imagen a continuación.

![Captura de Pantalla 2022-10-10 a las 16.36.07.png](../Emotion%20theme%20ReactJS%202bf80e06c6114732ad71b3a87ec7cb9a/Captura_de_Pantalla_2022-10-10_a_las_16.36.07.png)

**Definición de componentes usando el theme**

---

Ahora vamos a definir un par de componentes para ver el uso Emotion y el theme sobre estos elementos, para ello creamos dos componentes sencillos denominados `title` y `button`.

Vamos a empezar con title en el que vamos a definir un styled componente para los h1 donde le podamos indicar el tamaño predeterminado de estos en base a tres valores small, medium y large.

```jsx
import React from 'react'
import styled from '@emotion/styled'

const getSizeStyles = (theme, size) => {
  switch (size) {
    case 'small':
      return {
        fontSize: theme.spacing(1.75),
        fontSizeTablet: theme.spacing(1.75),
        fontSizeDesktop: theme.spacing(2),
      };
    case 'large':
      return {
        fontSize: theme.spacing(2.5),
        fontSizeTablet: theme.spacing(2.75),
        fontSizeDesktop: theme.spacing(3),
      };
    case 'medium':
    default:
      return {
        fontSize: theme.spacing(2),
        fontSizeTablet: theme.spacing(2.25),
        fontSizeDesktop: theme.spacing(2.5),
      };
  }
};

const PROPS_SHOULD_BE_HIDDEN = ['size']

const TitleWrapper = styled('h1', {
  shouldForwardProp: (prop) => !PROPS_SHOULD_BE_HIDDEN.includes(prop),
})(({ theme, size }) => ({
  color: theme.palette.title,
  fontSize: getSizeStyles(theme, size).fontSize,
  [`${theme.mediaquery.tablet}`]: {
    fontSize: getSizeStyles(theme, size).fontSizeTablet,
  },
  [`${theme.mediaquery.desktop}`]: {
    fontSize: getSizeStyles(theme, size).fontSizeDesktop,
  },
})
);

const Title = ({ children, size = 'medium' }) => {
  return (
    <TitleWrapper size={size}>{children}</TitleWrapper>
  )
}

export default Title
```

Y en nuestro Button haremos alguna lógica un poco más compleja como memoizar los estilos y definir unas variantes ajustadas a una propiedad.

```jsx
import React, { useMemo } from 'react'
import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'

const getStylesFromVariant = (theme, variant = 'default') => ({
  outline: 'none',
  cursor: variant ? 'pointer' : 'default',
  margin: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  '& > *': {
    fontFamily: 'SemiBold',
    letterSpacing: 1,
    fontSize: theme.spacing(1.5),
  },
  backgroundColor: variant === 'error' ? theme.palette.alert.error :
    variant === 'success' ? theme.palette.alert.success :
      variant === 'warning' ? theme.palette.alert.warning :
        theme.palette.button.background,
  color: theme.palette.button.text,
  border: `1px solid ${theme.palette.button.border}`,
  '&:hover': {
    backgroundColor: theme.palette.button.border,
  }
});

const PROPS_SHOULD_BE_HIDDEN = ['variant'];

const ButtonWrapper = styled('button', {
  shouldForwardProp: (prop) => !PROPS_SHOULD_BE_HIDDEN.includes(prop),
})(({ variant }) => ({
  ...variant,
}));

const Button = ({ children, variant = 'default' }) => {
  const theme = useTheme();
  const variantMemo = useMemo(
    () => getStylesFromVariant(theme, variant),
    [theme, variant]
  );
  return (
    <ButtonWrapper variant={variantMemo}>{children}</ButtonWrapper>
  )
}

export default Button
```

Obteniendo el siguiente resultado, tenemos que tener en cuenta que a cada botón le tenemos que pasar su variant. 

![Captura de Pantalla 2022-10-10 a las 17.51.00.png](../Emotion%20theme%20ReactJS%202bf80e06c6114732ad71b3a87ec7cb9a/Captura_de_Pantalla_2022-10-10_a_las_17.51.00.png)

---