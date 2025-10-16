# Styled components ReactJS

**Introducción**

---

Es una librería que nos permite dar estilos a nuestros componentes de React, la particularidad es que nos crea un componente en el cual definimos sus estilos y podemos usarlos en varios puntos wrappeando o envolviendo nuestros componentes funcionales.

Estos componentes podemos condicionarlos a las propiedades o lógica que queramos, provocando un gran dinamismo a la hora de definir los elementos visuales de nuestra aplicación de React. Además nos deja crear clases automáticas para cada uno de los componentes, de este modo no se pisan nuestros estilos.

En caso de necesitar clases en vez de componentes esta librería te da la opción de gestionar tu estilos a través de su método tradicional, lo vamos a ver aunque la gracia es trabajar con componentes.

**Proyecto React con Styled-Component** 

---

Creamos un proyecto de React y añadimos la librería de `styled-components`.

```bash
npm create vite@latest styled-components

cd styled-components

npm i styled-components
```

Si estáis trabajando con VsCode es interesante añadir el paquete de `vscode-styled-components` aunque es totalmente opcional, solo nos facilita la visualización con colores.

**Basic Component**

---

Al igual que generamos una carpeta de los componentes funcionales, normalmente bajo el nombre de `components`, es bueno generar otra para los componentes de estilos. Existen varias formar de organizar un proyecto aunque nosotros nos gusta tener una carpeta `ui` en la que los guardamos.

Ok, vamos a crear un componente muy sencillo. Queremos tener un componente de estilo para los botones.

```tsx
import styled from 'styled-components';

const ButtonStyled = styled.button`
	background-color: skyblue;
	color: white;
	font-size: 20px;
	border: 0;
	color: white;
	font-size: 20px;
	border: 0;
  padding: 10px 20px;
  cursor: pointer;
`;
```

¿Pero qué sucede si tengo tres colores para nuestros botones? Pues como es un componente de React le podemos indicar mediante las props qué estilo debe aplicar.

```jsx

import styled from 'styled-components';

const ButtonStyled = styled.button`
	background-color: ${props => props.backgroundColor ==='coral'? 'coral': 'skyblue'};
	color: white;
	font-size: 20px;
	border: 0;
  padding: 10px 20px;
  cursor: pointer;
`;
```

Ahora podemos usar nuestro `styled component` o componente de estilo en cualquier parte de nuestra aplicación.

```tsx
<ButtonStyled backgroundColor="coral">SEND</ButtonStyled>
```

**Ternarios & props**

---

Vamos a ver algún ejemplo más antes de avanzar en el uso de la librería, por ello vamos a crear un componente de estilo para los textos de nuestra aplicación. Creamos un componente con `styled components` para usarlo en otro punto de nuestra aplicación.

```jsx
import React from 'react'
import styled from 'styled-components';

const TextStyled = styled.text`
	background-color: ${props => props.backgroundColor === 'coral' ? 'coral' : 'skyblue'};
	color: red;
	font-size: 10px;
	border: 0;
`;

const TextComponent = ({ children, backgroundColor }) => {
	return <TextStyled backgroundColor={backgroundColor}>{children}</TextStyled>
}

export default TextComponent
```

Una vez lo tenemos en nuestra carpeta de componentes de estilo , en nuestro caso `ui`, podemos usarlo en el punto que queramos.

```jsx
import { ButtonStyled } from "./components/styles/ButtonStyled"
import TextComponent from "./components/styles/TextStyled"

const App = () => {
  return (
    <div >
      <h1>Styled Components</h1>
      <div>
        <ButtonStyled backgroundColor="coral">SEND</ButtonStyled>
        <TextComponent backgroundColor="default">Hello Students</TextComponent>
      </div>
    </div>
  )
}

export default App
```

Genial! poco a poco vamos viendo cómo funcionan y el uso que podemos llegar a dar a este tipo de componentes en nuestra aplicación, ¿no? Seguimos ✔️

**Variant & Props**

---

En los styled components podemos indicar que se disparen unos estilos u otros en base a la propiedad que le estamos pasando. Vamos a crear un sencillo ejemplo para ver otra de las bondades.

```jsx
import React from 'react'
import styled, { css } from 'styled-components';

const TitleStyled = styled.h1`
  color: black;
	font-size: 20px;
	border: 0;
	${({ primary }) =>
    primary && css`
                background-color: indianred;
                border: 1px solid skyblue;
                font: 20px;
            `
  }
    &:hover {
        background-color: mediumseagreen;
    }
`;

const TitleComponent = ({ children, primary }) => {
  return <TitleStyled primary={primary}>{children}</TitleStyled>
}

export default TitleComponent
```

De este modo podemos invocar a nuestro componente e indicarle la propiedad `primary` para usar los estilos definidos. 

```jsx
import './App.css';
import TitleComponent from './components/ui/TitleComponent';

function App() {
  return (
    <div className="App">
      <TitleComponent primary>Styled Components</TitleComponent>
    </div >
  );
}

export default App;
```

**Simple** **Layouting**

---

Como ya os habéis imaginado la versatilidad que podemos alcanzar con estos componentes es increíble, por ello os vamos a dejar un ejemplo de cómo usarlos a modo de layouting, y lo sencillo que puede llegar a ser.

Creamos un `styled component` que se comportará como un div y le indicamos el posicionamiento de elementos. Es decir será un contenedor o un `div` con unos estilos predefinidos.

```jsx
import React from 'react';
import styled from 'styled-components';

const StyleDiv = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const FlexContainer = ({ children }) => {
  return (
    <StyleDiv>
      {children}
    </StyleDiv>
  )
}

export default FlexContainer
```

Y ahora tenemos un `div` contenedor con flex en el que poder wrappear o envolver todos los elementos que queramos, en nuestro caso serán todos los componentes generados con anterioridad.

```jsx
import { ButtonStyled } from "./components/styles/ButtonStyled"
import FlexContainer from "./components/styles/FlexContainer"
import TextComponent from "./components/styles/TextComponent"
import TitleComponent from "./components/styles/TitleComponent"

const App = () => {
  return (
    <FlexContainer >
      <TitleComponent primary>Styled Components</TitleComponent>
      <ButtonStyled backgroundColor="coral">SEND</ButtonStyled>
      <TextComponent backgroundColor="default">Hello Students</TextComponent>
    </FlexContainer >
  )
}

export default App
```

**Layouting props**

---

Vamos a configurar nuestro "layout" en base algunas propiedades que le indicamos desde el componente en el que le estamos usando de este modo veremos la facilidad de uso de este tipo de componentes. 

```jsx
import React from 'react';
import styled from 'styled-components';

const StyleDiv = styled.div`
    display: flex;
    flex-direction: ${props => props.direction === 'row' ? 'row' : 'column'};
    justify-content: center;
    align-items: center;
`

const FlexContainer = ({ children, direction }) => {
  return (
    <StyleDiv direction={direction}>
      {children}
    </StyleDiv>
  )
}

export default FlexContainer
```

Ahora vamos a ver qué podemos hacer usando este componente dentro de nuestro `App`, recordad que son ejemplos sencillos que os proponemos para que descubráis las virtudes de los `styled components`.

```jsx
import { ButtonStyled } from "./components/styles/ButtonStyled"
import FlexContainer from "./components/styles/FlexContainer"
import TextComponent from "./components/styles/TextComponent"
import TitleComponent from "./components/styles/TitleComponent"

const App = () => {
  return (
    <FlexContainer direction={"column"}>
      <TitleComponent primary>Styled Components</TitleComponent>
      <ButtonStyled backgroundColor="coral">SEND</ButtonStyled>
      <TextComponent backgroundColor="default">Hello Students</TextComponent>
    </FlexContainer >
  )
}

export default App
```

**Media queries**

---

En caso de necesitar alguna media para que tus componentes se comporten a nivel visual como te lo pide el diseño podemos definir nuestros styled en base a una variable que haga saltar nuestro componente. Creams un fichero dentro de la carpeta constants.

```jsx
export desktopStartWidth = 996;
export const desktop = `@media (min-width: ${desktopStartWidth}px)`;
export const mobile = `@media (max-width: ${desktopStartWidth}px)`;

```

Y ahora cuando importemos la medias en nuestros componentes podemos hacer uso de las mismas.

```jsx
import React from 'react'
import styled, { css } from 'styled-components';

import { mobile } from '../../constants/mediasqueries';

const TitleStyled = styled.h1`
  color: black;
	font-size: 20px;
	border: 0;
	${({ primary }) =>
    primary && css`
                background-color: indianred;
                border: 1px solid skyblue;
                font: 20px;
            `
  }
    &:hover {
        background-color: mediumseagreen;
    }
    ${mobile} {
      font-size: 15px;
	}
`;

const TitleComponent = ({ children, primary }) => {
  return <TitleStyled primary={primary}>{children}</TitleStyled>
}

export default TitleComponent
```