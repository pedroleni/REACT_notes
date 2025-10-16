# Chakra ReactJS

**Introducción**

---

[Chakra UI](https://chakra-ui.com/) es una librería de componentes simple, modular y accesible (a11y) que te da las bases para construir tus aplicaciónes React.

**Que hace a Chakra UI tan interesante?**

---

Teniendo tantas librerías de componentes dando vueltas es difícil pensar que una tenga algo especial que destaque entre el resto, estas son algunas de las cosas que nos llaman la atención.

**Style props**

---

Algo que nos encontramos con la mayoría de las librerías de estilos es lo siguiente, vamos a suponer que tenemos un formulario, con un botón de submit debajo:

```jsx
const ContactForm = () => (
  <Form>
    <Fields />
    <Button *type*="submit">Submit</Button>
  </Form>);
```

El botón es un componente separado del formulario pero en la UI no hay espacio entre ambos, basado en la librería que implementemos la solución sería algo así: **CSS o similares**

```jsx
.submit {
  margin-top: 12px;
}

import './styles.css';

const ContactForm = () => (
  <Form >
    <Fields />
    <Button *className*="submit" *type*="submit">Submit</Button>
  </Form>);
```

**CSS / SCSS modules**

```jsx
.submit {
  margin-top: 12px;
}

import styles from './styles.css';

const ContactForm = () => (
  <Form>
    <Fields />
    <Button *className*={styles.submit} *type*="submit">Submit</Button>
  </Form>);
```

**Styled components / Emotion**

```jsx
import styled from 'styled-components';

const StyledButton = styled(Button)
  margin-top: 12px;

const ContactForm = () => (
  <Form>
    <Fields />
    <StyledButton *type*="submit">Submit</StyledButton>
  </Form>);
```

**Chakra UI**

```jsx
const ContactForm = () => (
  <Form>
    <Fields />
    <Button *marginTop*={6} *type*="submit">Submit</Button>
  </Form>);
```

Todos los componentes de Chakra UI pueden recibir style props, las cuales tienen los mismos nombres que las propiedades de CSS (y sus abreviaciones, marginTop también es mt). Extender los estilos de nuestros componentes para hacerlos mas flexibles, no romper la reusabilidad y evitar crear componentes de más, es super fácil con Chakra UI.

**Responsive styles**

---

Este es probablemente uno de los mejores features de Chakra UI. Hoy en día es poco probable que creemos una aplicación web que `NO` sea responsive. Personalmente, escribir media queries nunca fue mi fuerte y tener que escribir una para cambiar el `direction` de un div con display `flex` me da una fiaca terrible.

Más arriba vimos las `Style props`. Todas las Style props además de recibir un valor, pueden recibir un objeto (u array) con distintos valores dependiendo el tamaño del viewport:

```jsx
import {Text} from "@chakra-ui/react"

<Text *fontSize*={{base: 'xl', sm: '2xl', md: '3xl'}}>
  Soy un título
</Text>
```

Ahora, en mobile vamos a tener un texto tamaño `xl`, en dispositivos chicos `2xl` y en los medianos `3xl`.

**Theming**

---

El theming en Chakra UI sigue la [Styled System Theme Specification](https://system-ui.com/theme/), por lo que la manera de definir espacios, colores, etc, es bastante estandar.

En nuestro theme podemos definir muchas cosas, como las `fonts`, `font sizes`, `font weights`, `line heights`, `colors` y mucho más.

Es más, se acuerdan de las `Style props`? Depende del tipo de prop que sea, en vez de tomar el valor literal, va a mapear el valor que le pasemos al valor que corresponda, por ejemplo, en vez de: `<Text *color*="#FFF5F7">Mi texto es rosa</Text>`

Podríamos hacer: `<Text *color*="pink.50">Mi texto es rosa</Text>`

Obviamente podemos crear nuestros propios colores, como `brand`, `primary` o lo que queramos y usar esos colores en nuestros componentes. Así que actualizar el color de la identidad de una marca sería cambiar una linea de código.

**Componentes simples**

---

Probamos muchísimas librerías que tenian infinidad de componentes incluidos, como [Antd](https://ant.design/), probamos librerías en las que tenemos que hacer todo, como [Tailwind](https://tailwindcss.com/). Chakra UI trae varios componentes, muy flexibles, simples y útiles. Por lo que no terminas instalando dependencias extras o agregando librerías innecesarias. Algunos de los componentes que mas me gustan son.

[Stack](https://chakra-ui.com/docs/layout/stack): Un div con display flex que deja separación entre todos los elementos hijos.

```jsx
<Stack *direction*={{base: "column", sm: "row"}} *spacing*="24px">
  <Box *w*="40px" *h*="40px" *bg*="yellow.200">
    1
  </Box>
  <Box *w*="40px" *h*="40px" *bg*="tomato">
    2
  </Box>
  <Box *w*="40px" *h*="40px" *bg*="pink.100">
    3
  </Box>
</Stack>
```

[Button](https://chakra-ui.com/docs/form/button): Botón simple con varios modificadores como  `size`,  `colorScheme`,  `variant`,  `isLoading` , `icon`, etc.

[Skeleton](https://chakra-ui.com/docs/feedback/skeleton): Componente de carga que permite disminuir la transición entre un estado de carga y el estado de cargado.

**Como se compara a <inserte solución de estilos aquí>**

---

Si bien cada librería es un mundo, voy a intentar de marcar algunos puntos muy breves para las librerías que use.

- [Tailwind](https://tailwindcss.com/): Me parece excelente y creo que al usar CSS por debajo es una gran solución si tenés un equipo que desarrolle el style system y tiempo para llevarlo a cabo. Creo que Chakra UI da muy buenos estandares sin tanto trabajo, mientras mantiene una filosofía bastante parecida a los estilos atómicos que plantea Tailwind.
- [CSS / SCSS modules](https://github.com/css-modules/css-modules): Un poco lo mismo que cualquier solución que implique no tener bases, necesitas desarrollar todo por tu cuenta, incluyendo estilos, contrastes, estandares, a11y, etc. Con la ventaja de performance que puede implicar usar una solución CSS contra una CSS-in-JS.
- [Antd](https://ant.design/) / [MaterialUI](https://material-ui.com/es/): Son soluciones muy completas que también traen un costo muy alto, no solo en su peso sino en la flexibilidad de la UI, si bien son extensibles su diseño es bastante reconocido y estándar, lo que puede hacer complejo intentar despegarse de lo que proponen.
- [Styled components](https://styled-components.com/) / [Emotion](https://emotion.sh/docs/introduction): En realidad Chakra UI esta construido sobre emotion (cuya api es casi idéntica a la de styled components), por lo que podemos extender todos los componentes de Chakra UI usando emotion.

```jsx
import styled from "@emotion/react";
import {Text} from "@chakra-ui/react";

const GreenText = styled(Text)`
  color: green;
`
```

Podemos pensar a Chakra UI como una capa de simplicidad puesta sobre emotion / styled components.

**Aun hay más**

---

Recién estamos rascando la superficie de las cosas que realmente tiene Chakra UI, otras cosas interesantes para leer pueden ser [la prop `sx`](https://chakra-ui.com/docs/features/the-sx-prop), el [color mode](https://chakra-ui.com/docs/features/color-mode), [transitions](https://chakra-ui.com/docs/components/transitions) y más.

Para ello vamos a probar a construir una mini-aplicación web con Vite y React implementando Chakra UI.

[Installation](https://chakra-ui.com/getting-started)

Si seguimos la documentación, lo primero que nos pedirá Chakra UI es la instalación de la librería en nuestro proyecto a través del siguiente comando:

```jsx
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

Como veis, esta librería es dependiente de **emotion**, **styled** y **framer-motion** tal y como hemos ido observado en los conceptos principales, siendo una librería bastante pesada para solamente utilizarla puntualmente.

Vamos a conformar un layout sencillo con componentes de Chakra combinados para tener un ejemplo de qué se puede llegar a obtener haciendo uso de esta librería.

Para poder utilizar los elementos de Chakra tendremos que envolver nuestra aplicación dentro del componente **ChakraProvider**, pudiendo de esta manera inyectar los estilos que nos trae la librería:

```jsx
function App() {
  return (
    <ChakraProvider>
      <El resto de la aplicación />
    </ChakraProvider>
  );
}

export default App;
```

Os dejamos algunos ejemplos de uso de usos combinados de componentes para conformar los elementos de nuestra aplicación.

![Nov-03-2022 11-04-01.gif](Chakra%20ReactJS%2079a7919ebbb34087bf1f1e11492d4aea/Nov-03-2022_11-04-01.gif)

```jsx
//Avatars.jsx
import { Wrap, WrapItem, Avatar, Center, Heading } from "@chakra-ui/react";

const Avatars = () => {
  return (
    <Center mt={10}>
      <Heading size="md" mb={4} px={10} pt={3}>
        También podemos generar avatares
      </Heading>
      <Wrap>
        <WrapItem>
          <Avatar
            name="Iron Man"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUv7bL0uY1-zX_zbADPYgrxaEL7tkJkraWcw&usqp=CAU"
          />
        </WrapItem>
        <WrapItem>
          <Avatar
            name="Spiderman"
            src="https://sm.ign.com/t/ign_es/screenshot/default/spiderman_16eh.h720.jpg"
          />
        </WrapItem>
        <WrapItem>
          <Avatar
            name="Ant-Man"
            src="https://i.pinimg.com/originals/22/d1/54/22d1547bef12349c1d31801168a99da3.jpg"
          />
        </WrapItem>
        <WrapItem>
          <Avatar
            name="Thor"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRg2rK3xJY9AG8Q_Ij-pycib7BEup16jiYC10RHA5bElQldHewVtfT22gl1PajJC7idEUc&usqp=CAU"
          />
        </WrapItem>
        <WrapItem>
          <Avatar
            name="Thanos"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSOU27FCLa9QaA5Zk08zcIozoYxlICCysn1Q&usqp=CAU"
          />
        </WrapItem>
        <WrapItem>
          <Avatar
            name="Black Panther"
            src="https://www.history.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTU3ODc4NjgzNTEwMTg3NzQz/mcdblpa_ec092-1-2.jpg"
          />
        </WrapItem>
        <WrapItem>
          <Avatar
            name="Loki"
            src="https://infoliteraria.com/wp-content/uploads/2020/12/Loki-1280x720.jpg"
          />
        </WrapItem>
      </Wrap>
    </Center>
  );
};

export default Avatars;
```

```jsx
//CodeEx.jsx
import { Stack, Code } from "@chakra-ui/react";

const CodeEx = () => {
  return (
    <Stack direction="row" my={5} px={10}>
      <Code children="console.log('Incluso podemos insertar fragmentos de código')" />
      <Code colorScheme="red" children="var chakra = 'awesome!'" />
      <Code colorScheme="yellow" children="npm install chakra" />
    </Stack>
  );
};

export default CodeEx;
```

```jsx
//CollapseEx.jsx
import { Button, Collapse, Box, useDisclosure, Center } from "@chakra-ui/react";

const CollapseEx = () => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <>
      <Center mt={10}>
        <Button onClick={onToggle}>Abrir colapsable</Button>
      </Center>
      <Collapse in={isOpen} animateOpacity>
        <Box
          p="40px"
          color="white"
          mt="4"
          bg="red.600"
          rounded="md"
          shadow="md"
        >
          Además, podemos crear elementos colapsables animados gracias a Framer
          Motion
        </Box>
      </Collapse>
    </>
  );
};

export default CollapseEx;
```

```jsx
//DrawerEx.jsx
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  Stack,
  Box,
  Input,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Textarea,
  Select,
  DrawerFooter,
  useDisclosure,
  Center,
} from "@chakra-ui/react";

import React from "react";

const DrawerEx = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = React.useRef();

  return (
    <>
      <Center>
        <Button colorScheme="red" onClick={onOpen} mb={10}>
          Y tener formularios desplegables con el componente Drawer
        </Button>
      </Center>
      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Create a new account
          </DrawerHeader>

          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="username">Name</FormLabel>
                <Input
                  ref={firstField}
                  id="username"
                  placeholder="Please enter user name"
                />
              </Box>

              <Box>
                <FormLabel htmlFor="url">Url</FormLabel>
                <InputGroup>
                  <InputLeftAddon>http://</InputLeftAddon>
                  <Input
                    type="url"
                    id="url"
                    placeholder="Please enter domain"
                  />
                  <InputRightAddon>.com</InputRightAddon>
                </InputGroup>
              </Box>

              <Box>
                <FormLabel htmlFor="hero">Select Superhero</FormLabel>
                <Select id="hero" defaultValue="tony">
                  <option value="tony">Iron-Man</option>
                  <option value="spidey">Spider-Man</option>
                </Select>
              </Box>

              <Box>
                <FormLabel htmlFor="desc">Description</FormLabel>
                <Textarea id="desc" />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DrawerEx;
```

```jsx
//GridEx.jsx
import { Center, Grid, GridItem, Heading } from "@chakra-ui/react";

const GridEx = () => {
  return (
    <>
      <Center>
        <Heading size="md" p={3}>Y construir grids</Heading>
      </Center>
      <Grid
        h="200px"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(5, 1fr)"
        gap={4}
      >
        <GridItem rowSpan={2} colSpan={1} bg="tomato" />
        <GridItem colSpan={2} bg="papayawhip" />
        <GridItem colSpan={2} bg="papayawhip" />
        <GridItem colSpan={4} bg="tomato" />
      </Grid>
    </>
  );
};

export default GridEx;
```

```jsx
//Hero.jsx
import { Heading, Highlight } from "@chakra-ui/react";

const Hero = () => {
  return (
      <Heading lineHeight="tall" align="center" mt="10" px="10">
        <Highlight
          query={["Chakra", "Highlight"]}
          styles={{ px: "4", py: "2", rounded: "full", bg: "red.600"}}
        >
          Con Chakra podemos destacar palabras concretas con el componente Highlight
        </Highlight>
      </Heading>
  );
};

export default Hero;
```

```jsx
//Media.jsx
import { Heading, Center, Image } from "@chakra-ui/react";

const Media = () => {
  return (
    <>
      <Center>
        <Heading size="md" px={15} mt={10}>
          Podemos insertar elementos media y definir su Aspect Ratio
        </Heading>
      </Center>
      <Center p={5} mx={"30%"}>
        <Image
          src="https://bit.ly/naruto-sage"
          alt="naruto"
          objectFit="cover"
        />
      </Center>
    </>
  );
};

export default Media;
```

```jsx
//App.jsx
import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import Avatars from "./components/Avatars";
import CollapseEx from "./components/CollapseEx";
import Hero from "./components/Hero";
import Media from "./components/Media";
import GridEx from "./components/GridEx";
import CodeEx from "./components/CodeEx";
import DrawerEx from "./components/DrawerEx"

function App() {
  return (
    <ChakraProvider>
      <Hero />
      <CollapseEx />
      <Avatars />
      <Media />
      <GridEx />
      <CodeEx />
      <DrawerEx />
    </ChakraProvider>
  );
}

export default App;
```

Como podéis ver, no hace falta tener ninguna hoja de estilos, ya que por defecto, y gracias a **ChakraProvider,** nos implementará la hoja de estilos por defecto haciendo uso de la paleta, fuentes y tamaños definidos por la librería, siendo posible customizar todos ellos a través de las Style Props y el theming:

[Style Props](https://chakra-ui.com/docs/styled-system/style-props)