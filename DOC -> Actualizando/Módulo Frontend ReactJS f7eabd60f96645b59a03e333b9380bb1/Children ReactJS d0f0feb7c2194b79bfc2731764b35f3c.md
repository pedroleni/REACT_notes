# Children ReactJS

**Introducción**

---

Los children, en React, se refieren a la caja genérica cuyo contenido se desconoce hasta que se pasan del componente principal.

¿Qué significa esto? Simplemente significa que el componente mostrará lo que esté incluido entre las etiquetas de apertura y cierre al invocar el componente. El componente normalmente se invocaría desde el componente de la aplicación.

**Uso Children**

---

Puedes usar props.children en React para acceder y utilizar lo que coloca dentro de las etiquetas de apertura y cierre cuando crea una instancia de un componente.

Por ejemplo, si tengo un componente `Button`, puedo crear una instancia como esta: `<Button>HI!<Button>` y luego dentro del componente `Button`, podría acceder a ese texto con `props.children`. También puede usar esto para crear componentes que envuelvan otros componentes, por ejemplo, `<Container><Button /></Container>`.

```jsx
const Button = (props) => <button>{props.children}</button> 
```

Luego podemos crear una instancia del componente con `<Button>Click Me!</Button>` y así aparece un botón con el texto click me en la página. Para un ejemplo así, podemos hacer algo como…

```jsx
const Container =  ({ children }) => <div style={{ maxWidth: 800px, margin: 0 auto }}>{children}</div>

```

En este ejemplo, estoy desestructurando el objeto `props`, por lo que puedo usar `children` directamente. Y luego podemos instanciarlo.

```jsx
<Container>
  <h1>Welcome to my App</h1>
  <p>Hello, hi, this is my paragraph</p>
</Container>
```

Normalmente, para pasar props de un componente a otro, debemos hacer `<Button label="hello" />` y luego usar props.label en el componente, pero React children es más flexible y le permite reflejar HTML dentro su JSX.

**Mini-ejercicio**

---

Ha llegado el momento de ponerse a trabajar con ReactJS, para ello os proponemos una pequeña práctica que os ayude afianzar el concepto de children.

1. Crea una aplicación de ReactJS con vite → name: components-props—basics.
2. Crea tu carpeta de `components` dentro de `src`.
3. Realizamos algunos componentes de ReactJS:
    1. Componente Title ⇒ Crea un componente Title que retorne un `<h1>` con un texto recibido por props.
    2. Componente SubTitle ⇒ Crea un componente que retorne un `<h2>` con un texto recibido por props.
    3. Componente Image ⇒ Crea un componente que retorne un `<image>` con un src y alt recibido por props || además también recibirá el with y el height.
    4. Componente Paragraph ⇒Crea un componente que retorne un `<p>` con un texto recibido por props.
    5. Componente Header ⇒ Crea un componente que reciba como children el componente Title y retorne un `<header> + Children`.
    6. Componente Main ⇒ Crea un componente que reciba como children los algunos componentes creados y retorne un `<main> + Children`.
    7. Componente Footer ⇒ Crea un componente que reciba como children los algunos componentes creados y retorne un `<footer> + Children`.
4. Estila cada uno de ellos haciendo uso de CSS Modules → hoja de estilo asociada al componente.
5. Exporta los componentes en un `index.js` e importalos en `App.jsx`.
6. Puedes usar los componentes tantas veces como quieras pero siempre bajo la estructura de los componentes `<Header>` || `<Main>` || `<Footer>`.
7. Comprueba que la visualización es correcta.