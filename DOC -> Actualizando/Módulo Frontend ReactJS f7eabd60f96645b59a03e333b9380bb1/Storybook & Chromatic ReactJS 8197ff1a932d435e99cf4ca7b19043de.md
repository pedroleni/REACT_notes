# Storybook & Chromatic ReactJS

**¿Qué es Storybook?**

---

Storybook es una librería open-source que permite realizar documentación y desarrollo de componentes sin necesidad de tenerlas volcadas en una aplicación real. En resumen, es una herramienta para desarrollar componentes e interfaces de manera visual.

[Storybook: Frontend workshop for UI development](https://storybook.js.org/)

![Captura de pantalla 2022-10-28 a las 8.43.23.png](Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de/Captura_de_pantalla_2022-10-28_a_las_8.43.23.png)

**Implementando Storybook en nuestro proyecto**

---

Para implementar Storybook lo primero que tenemos que hacer es crear un proyecto de React con Vite.

```jsx
npm create vite@latest
```

Una vez tengamos las dependencias instaladas y el proyecto preparado para empezar instalaremos adicionalmente la librería storybook:

```jsx
npx sb init --builder @storybook/builder-vite
```

![Captura de pantalla 2022-10-28 a las 9.19.47.png](Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de/Captura_de_pantalla_2022-10-28_a_las_9.19.47.png)

Storybook tiene una versión para proyectos de Vite, pero tiene otras instalaciones alternativas para diferentes librerías, bundlers y frameworks.

Cuando termine la instalación de Storybook veremos que nos ha creado dos directorios nuevos en nuestro proyecto, una carpeta llamada **.storybook** y una carpeta dentro de src llamada **stories**. 

En la carpeta **.storybook** estará la configuración global de la librería y en la carpeta **stories** estarán los componentes y documentación que conectarán nuestros componentes funcionales con Storybook.

![Captura de pantalla 2022-10-28 a las 9.21.26.png](Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de/Captura_de_pantalla_2022-10-28_a_las_9.21.26.png)

Importante: dentro de la carpeta .storybook tendremos que cambiar la extensión del fichero main.js por **main.cjs.** Esto se debe a que, de momento, Storybook solo puede lanzar su fichero main a través de **commonjs** cuando el fichero de entrada del proyecto es de tipo module.

Si inspeccionamos la carpeta stories veremos que ya nos vienen por defecto algunas “stories” de ejemplo, así que vamos a arrancar Storybook para ver de que se trata todo esto:

```jsx
npm run storybook
```

![Captura de pantalla 2022-10-28 a las 9.45.39.png](Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de/Captura_de_pantalla_2022-10-28_a_las_9.45.39.png)

Este comando arrancará storybook en [http://localhost:6006/](http://localhost:6006) y podremos acceder a través de la terminal en el puerto indicado. De todas formas, por defecto, Storybook se abre automáticamente en el navegador:

![Captura de pantalla 2022-10-28 a las 9.46.48.png](Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de/Captura_de_pantalla_2022-10-28_a_las_9.46.48.png)

En esta página podremos ver los componentes que vienen por defecto en Storybook y explorar todas sus variantes, estilos, configuraciones e interacciones disponibles. Por lo tanto, en Storybook tendremos de manera documentada nuestros componentes, pudiendo acceder a todas las propiedades tanto a nivel de estilos como funcionales.

![Oct-28-2022 09-50-03.gif](Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de/Oct-28-2022_09-50-03.gif)

**Probando nuestros componentes**

---

Vamos a limpiar la carpeta **stories** dejando la carpeta assets y vamos a crear nuestro primer componente.

Para ello, dentro de src creamos nuestra carpeta components y haremos un nuevo fichero llamado Button.jsx y su Button.css:

```jsx
//Button.jsx
import React from "react";
import PropTypes from "prop-types";
import "./button.css";
export const Button = ({ backgroundColor, size, label, ...props }) => {
  return (
    <div>
      <button
        type="button"
        className={["storybook-button", `storybook-button--${size}`].join(" ")}
        id="button"
        style={backgroundColor && { backgroundColor }}
        {...props}
      >
        {label}
      </button>
    </div>
  );
};
Button.propTypes = {
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
Button.defaultProps = {
  backgroundColor: null,
  size: "medium",
  onClick: undefined,
};
```

```css
/* Button.css */
.storybook-button {
  background: #ff4742;
  border: 1px solid #ff4742;
  border-radius: 6px;
  box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  display: inline-block;
  font-family: nunito, roboto, proxima-nova, "proxima nova", sans-serif;
  font-size: 16px;
  font-weight: 800;
  line-height: 16px;
  min-height: 40px;
  outline: 0;
  padding: 12px 14px;
  text-align: center;
  text-rendering: geometricprecision;
  text-transform: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: middle;
}

.storybook-button:hover,
.storybook-button:active {
  background-color: initial;
  background-position: 0 0;
  color: #ff4742;
}

.storybook-button:active {
  opacity: 0.5;
}

.storybook-button--small {
  transform: scale(0.8);
}

.storybook-button--medium {
  transform: scale(1);
}
.storybook-button--large {
  transform: scale(1.2);
}
```

Este botón, como podéis ver, tendrá variantes de tamaño y una puerta de entrada a modificar diferentes parámetros del botón por props.

Una vez tenemos el componente funcional cons sus estilos creados tendremos que crear la story dentro de su directorio, por lo que vamos a generar un **Button.stories.jsx** dentro de la carpeta stories:

```jsx
import React from "react";
import { Button } from "../components/Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    backgroundColor: { control: "color" },
    onClick: { action: "clicked" },
  },
};
const Template = (args) => <Button {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  label: "Button",
};
```

Gracias a los argumentos de este fichero, Storybook será capaz de acceder a las propiedades, estilos, funcionalidades y variantes del componente, que está importado en el mismo desde su carpeta components.

Si ahora arrancamos Storybook podremos ver nuestro componente en pantalla y podremos interactuar con sus funcionalidades, eventos y estilos, pudiendo tener una muestra interactiva del componente y sus variantes:

![Oct-28-2022 15-09-36.gif](Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de/Oct-28-2022_15-09-36.gif)

**UI Testing**

---

Gracias a un plugin de Storybook podremos comprobar que el DOM renderizado cumple con las reglas consensuadas por la industria de accesibilidad o los parámetros indicados por el departamento de UI. 

Dicho test de accesibilidad de Storybook corre a través de la librería **Axe** en cada una de las stories activas, mostrando los resultados en un panel y señalando todos los nodos del DOM que incumplan con alguna de estas reglas. **Axe** es una de las librerías más utilizadas para este fin dado a su integración con la mayoría de entornos de testing.

Para instalar este plugin ejecutaremos el siguiente código:

```powershell
npm i -D @storybook/addon-a11y
```

Una vez instalada la librería tendremos que añadirla al array de addons dentro del archivo **storybook/main.cjs:**

```powershell
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-a11y",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },
};
```

Ahora que tenemos nuestro addon incluido, si hubiera algún fallo visual, ya sea por contraste, colores permitidos, formas, tamaños, etc…nos saldría una alerta en un apartado en la parte inferior indicándonos cual ha sido exactamente el problema.

![Untitled](Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de/Untitled.webp)

**Automatizando el testing visual con Chromatic**

---

El test visual automatizado verifica que nuestro apartado visual se refleje de manera adecuada según los parámetros indicados. En este caso vamos a utilizar Chromatic para lanzar tests visuales en la nube a alta velocidad.

Antes de configurar Chromatic necesitaremos acceder a la página web, loguearnos y conseguir un token único para poder enlazar nuestra cuenta con el testing del proyecto:

![Untitled](Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de/Untitled.png)

[Automatically review, test, and document Storybook](https://www.chromatic.com/)

Lo primero que haremos, siguiendo las instrucciones que nos indica **Chromatic**, es instalar las dependencias necesarias:

```powershell
npm install --save-dev chromatic
```

Y con la siguiente linea de comando publicaremos en Chromatic nuestro proyecto gracias al token único que nos facilitará. 

Una vez esté todo listo ya podremos ver nuestros componentes, testearlos y volver a “cazar” cualquier cambio que se realice en nuestra aplicación a nivel de UI para detectar si es valido, invalido o crear una linea temporal con el progreso y diferencias que ha sufrido el proyecto a lo largo del tiempo:

![Captura de pantalla 2022-10-31 a las 9.26.37.png](Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de/Captura_de_pantalla_2022-10-31_a_las_9.26.37.png)