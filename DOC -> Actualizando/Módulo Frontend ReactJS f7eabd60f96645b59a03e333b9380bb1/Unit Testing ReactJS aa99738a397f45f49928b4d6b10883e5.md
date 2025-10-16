# Unit Testing ReactJS

**Introducción**

---

El proceso de testing es un proceso vital para reducir la cantidad de posibles errores en nuestras aplicaciones, lo cual no significa que estos errores vayan a desaparecer sino que vamos a reducir su tasa de aparición.

Las pruebas unitarias son pruebas realizadas de forma aislada para garantizar la calidad de pequeñas partes de su código, como funciones, clases, etc.

**3 beneficios de las pruebas unitarias**

---

1. Encontrar y corregir errores, optimizando el tiempo de la persona de control de calidad
2. Aumente la fiabilidad de su aplicación
3. Servir como documentación

**Herramienta**

---

En lugar de usar Jest, usemos  ***vitest***  como entorno para ejecutar nuestras pruebas. Esta es una alternativa para proyectos creados con ***vite.*** Si aún no conoces vitest, mira lo que dice su propia documentación al respecto:

> Vitest es un marco de prueba de unidad extremadamente rápido desarrollado por Vite.
> 

En cuanto a la creación de las pruebas, vamos a automatizar la forma en que el usuario podría interactuar con nuestra pantalla. Para ello utilizaremos la  ***biblioteca de pruebas de reacción***  que según la documentación es:

> Una familia completa de paquetes para crear pruebas utilizando las mejores prácticas centradas en el comportamiento del usuario.
> 

**Entendiendo una prueba unitaria**

---

1. bloque de prueba
    1. Renderiza el componente que queremos probar.
    2. Encuentra los elementos con los que queremos interactuar.
    3. Interactuar con estos elementos.
    4. Afirmar el resultado esperado.
    
2. describe, test e expect
    1. `describe` sirve para crear un conjunto de pruebas.
    2. `test` sirve para crear un caso de prueba.
    3. `expect` sirve para describir lo que esperamos con un resultado ideal para esa prueba.
    
3. `screen`, `render`, `userEvent`, `queryBy`…/`findBy`…, `toBeInTheDocument`/`toHaveTextContent`
    1. `screen` es lo que nos permite ver la pantalla y desde allí encontrar los nodos DOM.
    2. `render` es el método que renderiza nuestro componente en el entorno de prueba.
    3. `userEvent` simula algunos eventos e interacciones del usuario.
    4. `queryBy`…/`findBy`… son las consultas, algunos de los muchos métodos que nos ayudan a encontrar, buscar, traer uno o más elementos de la pantalla.
    5. `toBeInTheDocument`/`toHaveTextContent` son los comparadores, algunos de los muchos métodos que nos ayudan a comparar el resultado esperado con el resultado recibido. También nos ayudan con el registro de mensajes de error.

configuración del entorno

---

Usemos vite para crear nuestro proyecto que viene con un contador por defecto, no olvides elegir reaccionar los dos tiempos que aparecen para elegir el idioma:

```bash
npm create vite@latest react-testing
```

Entramos en el proyecto:

```bash
cd react-testing

```

Descargamos las dependencias importantes para que funcione el proyecto reactJS:

```bash
npm install

```

**Ahora configuremos nuestro proyecto para recibir y ejecutar pruebas unitarias con vitest y testing library react:**

1. Instala las dependencias como dependencias de desarrollo

```bash
npm install vitest -D

```

```bash
npm install @vitest/ui @testing-library/jest-dom @testing-library/react @testing-library/react-hooks @testing-library/user-event jsdom -D --force

```

1. Añade los scripts en `package.json`

```json
"test": "vitest",
"test:ui": "vitest --ui"
```

1. Añade la propiedad de prueba en `vite.config`

```json
test: {
 globals: true,
 setupFiles: 'src/setupTests.js',
}
```

1.  Crea `setupTests.js`

```jsx
import '@testing-library/jest-dom'
export { default as userEvent } from '@testing-library/user-event'
```

**Definiendo funcionalidad**

---

1. Genera nueva funcionalidad en el fichero App.jsx

```jsx
import { useState } from 'react'
import './App.css'

function App() {
  const [text, setText] = useState('')

  const handleInput = (e) => setText(e.target.value)

  return (
    <div className="App">
      <img data-testid="giphy" src="https://media.giphy.com/media/CuuSHzuc0O166MRfjt/giphy.gif" alt="giphy" />

      <div>
        <input onChange={handleInput} placeholder="Type your name!" />
        <h1>Hello, {text}</h1>
      </div>
    </div>
  )
}

export default App
```

**Primeros Tests**

---

1. Crear archivo de prueba

```jsx
app.test.jsx

```

1. Incluye la configuración `jsdom` en cada archivo de test

```jsx
/**
* @vitest-environment jsdom
*/
```

1. Importa todo lo necesario para ejecutar los test

```jsx
import { describe, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App  from './App'
```

1. Ahora escribe tu primera prueba que cubre el caso de renderizar correctamente el h1 y probar si el contador funciona:

```jsx
import { describe, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

/**
* @vitest-environment jsdom
*/

describe('App', () => {
  test('should render the correct elements', () => {
    render(<App />)

    expect(screen.getByAltText('giphy')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type your name!')).toBeInTheDocument()
    expect(screen.getByText('Hello,')).toBeInTheDocument()
  })

  test('should render the correct alt text', () => {
    render(<App />)

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'giphy')
  })

  test('should render the correct name when the user filled', () => {
    render(<App />)

    const inputElement = screen.getByPlaceholderText('Type your name!')
    expect(screen.queryByText('Hello,')).toBeInTheDocument()

    userEvent.type(inputElement, 'Alberto')

    waitFor(() => expect(screen.queryByText('Hello, Alberto')).toBeInTheDocument())
  })
})
```

1. Ahora ejecutemos nuestras pruebas:

```bash
npm run test

o

npm run test:ui
```

¡Listo! Este es el resultado esperado:

![Captura de pantalla 2022-11-26 a las 22.21.15.png](Unit%20Testing%20ReactJS%20aa99738a397f45f49928b4d6b10883e5/Captura_de_pantalla_2022-11-26_a_las_22.21.15.png)

![Captura de pantalla 2022-11-26 a las 22.21.53.png](Unit%20Testing%20ReactJS%20aa99738a397f45f49928b4d6b10883e5/Captura_de_pantalla_2022-11-26_a_las_22.21.53.png)

Continuamos creando un componente para realizar testing sobre el, generamos un footer.

```jsx
import github from '/images/github.png';
import instagram from '/images/instagram.png';
import linkedin from '/images/linkedin.png';
import twitter from '/images/twitter.png';

export const socialLogos = [
  { link: 'https://github.com', src: github, alt: 'github' },
  { link: 'https://www.instagram.com', src: instagram, alt: 'instagram' },
  { link: 'https://www.linkedin.com/', src: linkedin, alt: 'linkedin' },
  { link: 'https://twitter.com', src: twitter, alt: 'twitter' },
];

const Footer = () => {
  return (
    <footer>
      <ul>
        {socialLogos.map((logo, idx) => (
          <li key={idx}>
            <a href={logo.link}>
              <img src={logo.src} alt={`logo ${logo.alt}`} width={40} height={40} />
            </a>
          </li>
        ))}
      </ul>
      <p>
        Created with love by @RiveraMerida <span role="img">💕</span>
      </p>
    </footer>
  );
};

export default Footer;
```

Y ahora podemos aplicar test sobre cada uno de los elementos y así comprobar que el comportamiento es el adecuado.

```jsx
import { describe, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import Footer, { socialLogos } from './Footer';

/**
* @vitest-environment jsdom
*/

describe('Footer', () => {
  test('should render the correct elements', () => {
    render(<Footer />)
    expect(screen.getByText('Created with love by @RiveraMerida')).toBeInTheDocument()
  })

  test('Social logos should be appear', () => {
    render(<Footer />)
    waitFor(() => socialLogos.forEach((logo) => {
      expect(screen.getByAltText(`logo ${logo.alt}`)).toBeVisible();
    }))
  })
})
```

**Unit Testing with Emotion Theme**

---

Si en algún momento estuviese usando un ThemeProvider de emotion cabe recordar que tenemos que importarlo y envolver al componente que queremos testear.

```jsx
import { ThemeProvider } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test } from 'vitest';

import Footer, { socialLogos } from '../components/Footer';
import { createTheme, theme } from '../styles';

describe('Footer', () => {
  beforeEach(() => {
    render(
      <ThemeProvider theme={createTheme(theme)}>
        <Footer />
      </ThemeProvider>,
    );
  });

  test('Message text should be appear', () => {
    expect(screen.getByText('Create with love by @RiveraMerida')).toBeVisible();
  });

  test('Social logos should be appear', () => {
    socialLogos.forEach((logo) => {
      expect(screen.getByAltText(`logo ${logo.alt}`)).toBeVisible();
    });
  });
});
```