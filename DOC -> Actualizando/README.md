# Módulo: Frontend ReactJS

**Introducción**

---

A lo largo de las diferentes sesiones trabajaremos en detalle las particularidades de esta librería. ReactJS es actualmente la librería más usada y demandada del mercado, siendo una referencia dentro del mundo del desarrollo.

**Qué vamos a aprender**

---

1. Fundamentos ReactJS.
2. ReactJS Hooks.
3. Hooks ReactJS avanzados.
4. Patrones de ReactJS avanzados.
5. ReactJS Performance.
6. ReactJS Testing.
7. ReactJS Suspense.
8. ReactJS UI.
    1. MUI
    2. Chakra
    3. Material - Tailwind → [https://www.material-tailwind.com/](https://www.material-tailwind.com/)
    4. Styled-components
    5. Emotion
    6. Emotion Theme
    7. StoryBook & Chromatic
9. Buenas prácticas → Eslint + Prettier + Vite
10. ReactJS Router.
11. ReactJS Internacionalización.
12. Redux.

**Después del contenido**

---

1. Capacidad de trabajar con la librería ReactJS.
2. Aplicar buenas decisiones y CLEAN code.
3. Mejorar la performance de tu aplicación.
4. Optar por diferentes enfoques UI.
5. Testear tus aplicaciones de ReactJS.

**Contenido**

---

Antes de comenzar a trabajar con ReactJS necesitamos comprobar que cumplimos los requisitos previos, es decir configuración de nuestro equipo.

[Requisitos previos](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Requisitos%20previos%2088df0431b2e849f5a88057f4d35e87f7.md)

Muchos aún carece del conocimiento sobre esta famosa librería y desde aquí queremos tener una visión de dónde venimos y qué nos ofrece ReactJS

[Historia de ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Historia%20de%20ReactJS%202761910b227e4414a8c527d6869def46.md)

El primer contacto con la librería puede ser algo complicado por ello vamos abstraeros de toda la lógica compleja asociada para realizar una pequeña toma de contacto.

[Toma de contacto ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Toma%20de%20contacto%20ReactJS%20a351f4cf5fca4ef9a2561135ac96010b.md)

ReactJS supone un gran esfuerzo a la hora de aprenderlo por el cambio de paradigma, es bueno tener en cuenta sus fundamentos y conocerlos antes de adentrarte en la librería.

[Conceptos ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Conceptos%20ReactJS%202db8e9ea3d204f1ebd37ad87c9feaecc.md)

`JSX` es una extensión de `JavaScript` creada para la librería React que nos permite combinar `JS` y `XML` convirtiendo etiquetas en elementos reactivos, de ahí el nombre JavaScript `XML`.

[JSX ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/JSX%20ReactJS%203531b29a8bd0492aaf8c22671a0f9876.md)

En ReactJS trabajaremos componetizando cada uno de los elementos que componen nuestra aplicación, es por ello que buscamos atomizar los elementos.

[Componentes ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Componentes%20ReactJS%20a8ecb191758a4a848677e29794b2c437.md)

Los `props` de React consisten en delegar lo que un componente va a renderizar a otro componente, es decir, pasar información de un componente padre a un componente hijo. 

[Props ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Props%20ReactJS%2006ffa5014be94bcd99a0b5c1388b1429.md)

Los children, en React, se refieren a la caja genérica cuyo contenido se desconoce hasta que se pasan del componente principal.

[Children ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Children%20ReactJS%20d0f0feb7c2194b79bfc2731764b35f3c.md)

Aunque aún nos queda por ver muchos conceptos de React vamos a realizar un mini-proyecto de ReactJS haciendo uso lo visto hasta ahora y un par de hooks básicos.

[Mini Proyecto ReactJS [1]](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Mini%20Proyecto%20ReactJS%20%5B1%5D%207e05e60899e24ce4a2b562d4a88d2769.md)

[Mini Proyecto ReactJS [2]](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Mini%20Proyecto%20ReactJS%20%5B2%5D%20a011ec9a29a34e28bab53b201a49fb05.md)

[Mini proyecto ReactJS [3]](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Mini%20proyecto%20ReactJS%20%5B3%5D%20601425e980a147a69b0afa49963f5315.md)

Para poder trabajar en aplicaciones webs más completas y con enrutado necesitamos hacer uso de otra librería llamada react-router.

[React Router ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/React%20Router%20ReactJS%200761f556a922490782852bbe8dbeaba9.md)

Los Hooks nos ayudan a interactuar en el ciclo de vida del componente transformando la información e interactuando con el usuario.

[Introducción a Hooks ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Introducci%C3%B3n%20a%20Hooks%20ReactJS%2031862fe417024fa0bf70cb4aed855a78.md)

useState() es una función que crea internamente una variable donde podremos almacenar el estado de nuestro componente. 

[UseState ReactJS[1]](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/UseState%20ReactJS%5B1%5D%202a6b4e5d6ac94792a43d59b4210dc052.md)

[UseState ReactJS[2]](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/UseState%20ReactJS%5B2%5D%20000c14d9fc79495da1a11b8dc18f8526.md)

Te recomendamos que una vez has sido capaz de replicar este proyecto intentar generar una aplicación de React en la que cuando clickas en cada una de las experiencias laborales te lleve a una nueva página en la que describes la posición y algunos datos de interés.

[Proyecto UseState ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Proyecto%20UseState%20ReactJS%20c16d2dda39e74bc4bfbe1212a5990f35.md)

Este Hook nos permite "escuchar" o "engancharnos” a los eventos en el tiempo y poder ejecutar código de forma dinámica.

[UseEffect ReactJS[1]](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/UseEffect%20ReactJS%5B1%5D%20dc913d4423114e8e8a0ab6c5eecd7462.md)

[UseEffect ReactJS[2]](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/UseEffect%20ReactJS%5B2%5D%20d89cb55151cb4c00a83cff7e14737936.md)

[UseEffect ReactJS[3]](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/UseEffect%20ReactJS%5B3%5D%20217ccb6b1c1e4c5b83a6298c0edcfffe.md)

Para alcanzar un conocimiento aceptable con el useEffect e intentar dominarlo os recomendamos realizar el proyecto de los relojes. Una vez lo finalicéis tendremos cierta soltura usando este Hook.

[Proyecto Relojes ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Proyecto%20Relojes%20ReactJS%20961569394a614e70b726e20fc802e689.md)

Vamos a realizar un filtro de búsqueda haciendo uso de useEffect y useState. Además veremos como instalar un paquete de npm para realizar un debounce.

[Fetching data ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Fetching%20data%20ReactJS%20a8b0ce01e96340848e8796d40ac385e9.md)

 

Para afianzar los conocimientos adquiridos os proponemos una práctica de larga duración, a través de esta “guía” podemos construir nuestra propia Pokedex.

[Proyecto Pokedex ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Proyecto%20Pokedex%20ReactJS%2033b42d5c5b4e4991b15068b603c5de13.md)

Este Hook es muy interesante porque es un hook que nos permite almacenar una referencia a casi cualquier cosa con la que necesitemos interactuar 🙉. 

[useRef ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/useRef%20ReactJS%2049c958b8959d442abd5bc8e34f75aaee.md)

Ya te habrás encontrado en bastantes ocasiones la necesidad de no renderizar de nuevo un componente aunque cambie el estado del componente padre.

[Memo ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Memo%20ReactJS%203ca73b30be7646c6a10c9c3f42f6fea3.md)

A veces hay que calcular un valor, ya sea mediante un cálculo complejo o llegando a la base de datos para realizar una consulta costosa o a la red.

[UseMemo ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/UseMemo%20ReactJS%20c7d0f41d46414f7aaba748d5c4545bdc.md)

UseCallback es un hook de React que se encarga de memorizar las funciones y de que no se rerendericen al montarse los componentes. Es muy útil cuando se transfieren funciones a componentes hijos.

[UseCallback ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/UseCallback%20ReactJS%20c62c7b05e9af47a18f55a6468b799a02.md)

React Context es una forma de administrar el estado globalmente. Se puede usar junto con `useState` Hook para compartir el estado entre componentes profundamente anidados más fácilmente que `useState` solo.

[UseContext ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/UseContext%20ReactJS%200cd8b96cf1f54e028ded7e39e4ed5b87.md)

El hook `useReducer` nos permite manejar estados “complejos” por medio de una función reductora. 

[useReducer](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/useReducer%20b6ffe935a8cf47248bc3fcd58df54eaf.md)

Cuanto más practiquemos mejor, por ello es bueno crear muchos proyectos con diferente temática, si os gusta los eventos espaciales disfrutaréis mucho. 

[NASA ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/NASA%20ReactJS%20851999ba45504cad8c860a42d6d48810.md)

Los Custom Hooks son funciones propias, es decir, creadas por ti en tu código, para abstraer y encapsular comportamientos que se relacionen con otros hooks propios de React.

[Custom Hooks ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Custom%20Hooks%20ReactJS%200718c75722f74ce4abe9fca2e307e3b9.md)

Este proyecto no será un proyecto al uso en el que nos centraremos en una sola temática, es tu turno de elegir y aprender a valorar tu alcance tras haber aprendido tantísimo en estos meses.

[Hub Games ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Hub%20Games%20ReactJS%20afba520f3be345dea4afbe02c0e7f232.md)

React Router proporciona una de las API más intuitivas disponibles y permite la carga diferida y la representación del lado del servidor compatible con SEO. Esta última versión de React Router introdujo muchos conceptos nuevos, como <Outlet /> y layout routes, pero la documentación aún es escasa.

[Protected Routes ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Protected%20Routes%20ReactJS%2006fa535712b44312908c06d82af74861.md)

Hoy nos toca ver formularios, algo muy común en todo el mundo web y que a veces se convierte en algo tedioso con lo que trabajar... Aunque vamos a mostrarte una forma de conseguir crear formularios dinámicos de forma muy sencilla. Para ello usaremos la librería `react-hook-form` 🚀

[Formularios ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Formularios%20ReactJS%203b1ff236d3c5476297182f39667ac75a.md)

Cuando trabajamos en equipo es bueno llegar a acuerdos en cuanto a las reglas de lintado, la manera de enfocar los problemas…

[Eslint & Prettier ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Eslint%20&%20Prettier%20ReactJS%2064bb9bad9974491cb6715418946a5328.md)

Para definir un HOC, podríamos decir que se trata de un componente cuya única labor es la de envolver a otro componente y devolverlo de forma consistente, pero añadiendo un comportamiento adicional de forma controlada y esperable.

[HOC ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/HOC%20ReactJS%201d6f265f3abc4b02a218595343a67ab1.md)

Cuando se trata de estilar nuestras aplicaciones de ReactJS nos encontramos con diferentes alternativas y queremos dotarte de un amplio abanico para decidir la opción más cómoda en tus proyectos.

[MUI ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/MUI%20ReactJS%20c447cdcc507e4ba38018bc11a00ea24b.md)

[Chakra ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Chakra%20ReactJS%2079a7919ebbb34087bf1f1e11492d4aea.md)

[Styled components ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Styled%20components%20ReactJS%204f252d68683b48b1ae4a7ab26e6e5650.md)

[Emotion theme ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Emotion%20theme%20ReactJS%202bf80e06c6114732ad71b3a87ec7cb9a.md)

[Storybook & Chromatic ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Storybook%20&%20Chromatic%20ReactJS%208197ff1a932d435e99cf4ca7b19043de.md)

[Design System Tokens ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Design%20System%20Tokens%20ReactJS%2078b76f85578f4cbfac148782a5aeb96d.md)

En ocasiones tenemos la necesidad de introducir el multilenguaje en nuestras aplicaciones y para ello podemos usar algunas librerías que nos agilizan esta tarea.

[React-intl ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/React-intl%20ReactJS%202d33afba926b4b8ead7ae06ebba784e4.md)

`Redux` es una librería de `JavaScript` usada para gestionar el estado de las aplicaciones.

[OPTIONAL: Redux ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/OPTIONAL%20Redux%20ReactJS%2016f63ef15d364f3586116c38a6128a78.md)

Un punto diferencial en cualquier aplicación es el uso de testing dentro de ellas. Nos permite encontrar fallos dentro de ella cuando se realiza un cambio o no se cubre una funcionalidad || caso de uso.

[Unit Testing ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Unit%20Testing%20ReactJS%20aa99738a397f45f49928b4d6b10883e5.md)

[E2E Testing ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/E2E%20Testing%20ReactJS%20b0599fdb587b45a3b0060f3ec39ae8b6.md)

¿Por qué la aplicación web con React se ejecuta lento? La respuesta, a menudo, se encuentra en qué tan frecuentemente tus componentes hacen varias entregas y si estas entregas eran realmente necesarias.

[Performance ReactJS](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Performance%20ReactJS%20530a7ef335d944e3b2f4390ba44a37a3.md)

[**Patterns avanzados ReactJS**](M%C3%B3dulo%20Frontend%20ReactJS%20f7eabd60f96645b59a03e333b9380bb1/Patterns%20avanzados%20ReactJS%20f3b3efbbe74d4e1e83681fe500c7efbe.md)

Una descripción general de 4 patrones React modernos y avanzados, incluidos los códigos de integración, los pros y los contras, y el uso concreto dentro de las bibliotecas.