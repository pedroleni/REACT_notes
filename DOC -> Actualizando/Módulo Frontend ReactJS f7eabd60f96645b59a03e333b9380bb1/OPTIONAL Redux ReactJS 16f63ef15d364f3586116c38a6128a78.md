# OPTIONAL: Redux ReactJS

**¿Qué es Redux?** 

---

**`Redux`** es una librería de **`JavaScript`** usada para gestionar el estado de las aplicaciones.

En React normalmente se gestiona el estado a nivel de componente tal y como hemos visto en las sesiones anteriores, pero al usar **`Redux`** el estado de la aplicación es gestionado por un único objeto inmutable al que se conectan todos los componentes necesarios.

Cada vez que el estado de Redux se actualiza se genera una copia del estado anterior junto a los cambios realizados.

Redux también tiene sus inconvenientes, como su gran tamaño. Recomendamos usarlo en aplicaciones grandes, ya que en aplicaciones pequeñas el código crecerá más de lo aconsejable.

**Redux DevTools**

---

Recomendamos que para esta sesión y de aquí en adelante tengáis instalada la extensión **`Redux DevTools`** en el navegador. Esta extensión nos permitirá debuguear los cambios de estado de nuestra aplicación.

- Redux DevTools para Chrome: [https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=es](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=es)
- Redux DevTools para Firefox: [https://addons.mozilla.org/es/firefox/addon/reduxdevtools/](https://addons.mozilla.org/es/firefox/addon/reduxdevtools/)

**Instalar Redux en React**

---

Vamos a poner en práctica Redux en una aplicación de React, por lo que antes de nada tenemos que crear un nuevo proyecto:

```jsx
npx create-react-app redux-app // npm create vite@latest
cd redux-app
npm start //npm run dev
```

Una vez tengamos nuestro proyecto listo para trabajara vamos a instalar los siguientes paquetes mediante comandos:

```jsx
npm i redux react-redux redux-thunk redux-devtools-extension react-router-dom
```

Con esta línea en nuestra terminal estamos instalando **`Redux`**, **`React Redux`** (los conectores entre React y Redux), **`Redux Thunk`** (middleware asíncrono para Redux) y **`Redux DevTools`** (la herramienta de depuración para Redux). Además hemos instalado **`React Router`** para conectar nuestras rutas tal y como vimos en su sesión en Concepts.

Una vez tengamos todos los paquetes instalados vamos a crear 4 carpetas dentro de src: **`actions`**, **`reducers`**, **`pages`** y **`components`**.

![Untitled](OPTIONAL%20Redux%20ReactJS%2016f63ef15d364f3586116c38a6128a78/Untitled.png)

Para no quebrarnos la cabeza con los estilos en esta ocasión vamos a usar **`Bootstrap`** en nuestra aplicación. Vamos a sustituir el contenido de nuestro fichero index.css por el contenido del framework de la siguiente ruta:

```jsx
https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css
```

Una vez guardado vamos a pasar a ver los conceptos de Redux antes de comenzar a trabajar con él.

**Conceptos de Redux**

---

- **`Stores`**: el estado de las aplicaciones con Redux se guarda en una **`store`**. Estas stores se inicializan con un reducer y pasarlas a un **`<Provider>`**.
    
    
    **`Provider`** es un componente que incluirá en su interior toda la aplicación, de modo que cualquier componente que se encuentre dentro del Provider tendrá acceso a Redux.
    
    Este es un ejemplo de creación de una store, donde importamos la función **`createStore`**, el **`reducer`** que pasamos a dicha función y el **`Provider`** que anidará nuestra aplicación:
    
    ```jsx
    import {createStore} from 'redux';
    import {Provider} from 'react-redux';
    import reducer from './reducers';
    
    const store = createStore(reducer);
    
    render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root'),
    ```
    

- **`Actions`**: las acciones envían datos desde la aplicación a la store de Redux. Una acción es un objeto con dos propiedades: **`type`** → describirá la acción a realizar, y **`payload`** → los datos que se pasan a la acción.

Como os habréis dado cuenta, esto formaba parte del comportamiento de los **`reducers`**, por lo que va a ser una buena manera de llevarlos a la práctica.

Vamos a poner como ejemplo una acción que borre una tarea y que como payload tenga el id que nos lleve al objeto que queremos borrar.

```jsx
const DELETE_TASK = 'DELETE_TASK';

{
  type: DELETE_TASK,
  payload: id,
}
```

También podemos utilizar un **`creator`**, o creador de acción. Esto no es más que una función que nos devuelve una acción. Vamos a utilizar el mismo ejemplo pero con esta sintaxis. 

```jsx
const deleteTask = (id) => ({type: DELETE_TASK, payload: id});
```

- **`Reducers`**:  un reducer, tal como hemos visto en otras sesiones, es una función que acepta dos parametros → un **`estado`** y una **`acción`**. Estos reducers suelen incluir un switch con diferentes acciones:

```jsx
const initialState = {
  tasks: [
    {id: 1, text: 'Code'},
    {id: 2, text: 'Eat'},
    {id: 3, text: 'Sleep'},
  ],
  errors: false,
  loading: false
}

function taskReducer(state = initialState, action) {
  switch (action.type) {
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      }
    default:
      return state;
  }
}
```

Para que se entienda mejor: los **`componentes`** de la aplicación iniciarán acciones que ejecutan tareas, mientras que los reducers se encargan de modificar el estado de **`Redux`**. 

Vamos a ver como conectar las propiedades de los componentes con el estado de Redux y ver la utilidad real que tiene.

**Componentes en Redux**

---

Para usar un componente con **`Redux`** tenemos que conectarlo mediante la función **`connect()`** que nos facilita **`React Redux`**. Esta función connect mapeará las propiedades de un componente con el estado de Redux.

A los componentes de React que están conectados con Redux se les denomina **`containers`**. Cuando queramos actualizar el estado de Redux en un container usaremos el método **`dispatch()`** de la **`store`** de Redux, este método aceptará un objeto como parámetro:

```jsx
const Component = ({dispatch}) => {
  useEffect(() => {
    dispatch(deleteTask())
  }, [dispatch]);
}
```

**Crear la store de Redux**

---

Vamos a volver a nuestro proyecto y editar nuestro archivo **`index.js`** de la carpeta **`src`** con los siguientes elementos: **`createStore`**, **`applyMiddleware`**, **`Provider`** y **`thunk`**, los cuales hemos instalado al inicio.

También vamos a usar la función **`composeWithDevTools`** para poder inspeccionar los estados de Redux a través de las DevTools que hemos instalado también.

```jsx
import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import App from './App';
import rootReducer from './reducers';

import './index.css';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
```

Como se puede ver en el código, aparte de estos elementos hemos importado también el componente **`App`** y el conjunto de **`reducers`** que aún no hemos utilizado.

A la función **`createStore`** le hemos pasado el conjunto de reducers (**`rootReducer`**) con el objetivo de crear la **`store`**, y a la función **`composeWithDevTools`** le pasamos la función **`applyMiddleware`** con la configuración de **`thunk`**.

Por último agregamos el **`Provider`** que incluirá en su interior el componente **`App`** para que recoja la store que acabamos de crear.

De momento nuestro componente App solo está devolviendo un div con un texto para comprobar su funcionamiento:

```jsx
import './App.css';

function App() {
  return (
    <div className="App">
     React + Redux = Sweet
    </div>
  );
}

export default App;
```

Como habréis comprobado, si intentáis arrancar la aplicación aún nos falta por crear un elemento: los **`reducers`**.

**Creando los reducers de Redux**

---

Vamos a implementar los **`reducers`** en nuestra aplicación. Esta función nos devolverá una copia del estado teniendo en cuenta el cambio realizado.

Podemos agregar múltiples reducers y anidarlos en un único reducer denominado **`rootReducer`**. Para combinarlos usaremos la función **`combineReducers`** tal y como veremos a continuación.

En esta ocasión vamos a crear un blog, por lo que necesitamos un reducer que nos gestione todos los posts, al que vamos a llamar **`postsReducer`**. Por otro lado crearemos otro que nos gestione los datos de un los posts de manera individual al que, siguiendo con el ejemplo, llamaremos **`postReducer`**. Y para terminar crearemos otro que nos gestione los comentarios de los posts al que llamaremos **`commentsReducer`**.

Estos reducers se pueden combinar con los que queramos y denominarlos al gusto, pero recomendamos tener en cuenta usar nombres similares al fin o al endpoint de la API que vayamos a usar.

Vamos a agregar estos reducers a la carpeta **`reducers`** y crear un archivo **`index.js`** con el siguiente código:

```jsx
import { combineReducers } from "redux";

import postsReducer from "./postsReducer";
import postReducer from "./postReducer";
import commentsReducer from "./commentsReducer";

const rootReducer = combineReducers({
  posts: postsReducer,
  post: postReducer,
  comments: commentsReducer,
});

export default rootReducer;
```

De momento hemos creado la estructura principal de nuestro **`rootReducer`**, por lo que vamos a crear individualmente los 3 reducers para importarlos correctamente:

- **`postsReducer`**: crearemos un archivo **`postsReducer.js`** dentro de nuestra carpeta de reducers que contendrá un objeto de estado inicial con el estado de los posts esperando a almacenarlos, uno de errores y otro si están cargados. Como no hemos agregado acciones nos limitaremos a devolver el objeto de manera inmutable de momento:

```jsx
export const initialState = {
  posts: [],
  errors: false,
  loading: false,
};

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
```

- **`postReducer`**: de la misma forma que el anterior, vamos a crear un archivo **`postReducer.js`** que contendrá el estado post con el post que seleccionemos de la lista completa, pese a que inicialmente contenga un objeto vacío. Al igual que postsReducer contemplará el estado de los errores y la carga. Las acciones la agregaremos posteriormente:

```jsx
export const initialState = {
  post: {},
  errors: false,
  loading: true,
};

export default function postReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
```

- **`commentsReducer`**: este reducer ira en el archivo **`commentsReducer.js`** como hemos podido deducir y contendrá la lista de comentarios en un array vacío y el estado de la carga y errores. Al igual que los anteriores contemplaremos las acciones más adelante:

```jsx
export const initialState = {
  comments: [],
  loading: false,
  errors: false,
};

export default function commentsReducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
```

Como podemos ver, la estructura de los reducers es prácticamente la misma, en los próximos pasos daremos la utilidades únicas de cada uno con acciones y propiedades adicionales.

![Untitled](OPTIONAL%20Redux%20ReactJS%2016f63ef15d364f3586116c38a6128a78/Untitled%201.png)

Completado estos pasos podemos comprobar que el navegador nos carga correctamente el texto **`"React + Redux = Sweet"`** que hemos insertado en nuestro componente **`App`** a modo de prueba. 

Además podemos comprobar que los  estados de **`posts`**, **`post`** y **`comments`** están funcionando a través de las **`DevTools`** de Redux en nuestro navegador:

![Untitled](OPTIONAL%20Redux%20ReactJS%2016f63ef15d364f3586116c38a6128a78/Untitled%202.png)

**Creando las acciones de Redux**

---

De la misma manera que hemos creado los reducers vamos a crear individualmente los archivos de las acciones en nuestra carpeta **`actions`** que hemos generado en el directorio **`src`**.

- **`postsActions`**: en nuestro blog necesitamos obtener los posts desde una API, la cual en este caso vamos a usar una que nos mockea una serie de posts, y almacenarlos en el estado de los propios posts.
    
    
    Para obtener estos posts de forma asíncrona usaremos **`Redux Thunk`**, configurado anteriormente en la store. Vamos a crear un archivo llamado **`postsActions.js`** donde agregaremos las acciones referentes a los posts.
    
    En la parte superior de nuestra acción agregaremos los tipos de acción en una serie de constantes que contendrán tanto el nombre como el string correspondiente.
    
    ```jsx
    export const GET_POSTS = 'GET_POSTS';
    export const GET_POSTS_OK = 'GET_POSTS_OK';
    export const GET_POSTS_ERROR = 'GET_POSTS_ERROR';
    ```
    
    Seguidamente añadiremos los ya vistos **`action creators`** que devolverá la acción con un **`tipo`** y un **`payload`**.
    
    ```jsx
    export const GET_POSTS = "GET_POSTS";
    export const GET_POSTS_OK = "GET_POSTS_OK";
    export const GET_POSTS_ERROR = "GET_POSTS_ERROR";
    
    export const actionGetPostsOk = (posts) => ({
      type: GET_POSTS_OK,
      payload: posts,
    });
    
    export const actionGetPostsError = () => ({
      type: GET_POSTS_ERROR,
    });
    ```
    

Y finalmente crearemos la función que englobe las acciones anteriores. Cuando invoquemos a esta función llamará a **`GET_POSTS`** mediante el **`action creator`** para ejecutar la petición a la API. Esta petición la haremos a la API **`JSONPlaceHolder`**, la cual nos devolverá un JSON con posts a modo de test.

El endpoint que utilizaremos es el siguiente:

```jsx
'https://jsonplaceholder.typicode.com/posts'
```

En el interior del try/catch obtendremos los datos y nos lanzara la acción **`GET_POSTS_OK`** a través de **`actionGetPostsOk`** si ha sido correcto o **`GET_POSTS_ERRORS`** a través de **`actionGetPostsError`** si ha fallado dicha petición.

Para llamar a los **`action creators`** usaremos el método **`dispatch`** para actualizar el estado de Redux.

```jsx
export const GET_POSTS = 'GET_POSTS';
export const GET_POSTS_OK = 'GET_POSTS_OK';
export const GET_POSTS_ERROR = 'GET_POSTS_ERROR';

export const actionGetPosts = () => ({
  type: GET_POSTS,
});
  
export const actionGetPostsOk = (posts) => ({
  type: GET_POSTS_OK,
  payload: posts,
});
  
export const actionGetPostsError = () => ({
  type: GET_POSTS_ERROR,
});

export function getPosts() {
  return async (dispatch) => {

    dispatch(actionGetPosts());
  
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      const data = await response.json();
  
      dispatch(actionGetPostsOk(data));
    } catch (error) {
      console.log(error);
      dispatch(actionGetPostsError());
    }
  }
}
```

- **`postActions`**: con esta acción vamos a obtener un post individual de la API, almacenándolo en el estado que hemos generado. Vamos a empezar por crear nuestro archivo **`postActions.js`**.

```jsx
export const GET_POST = "GET_POST";
export const GET_POST_OK = "GET_POST_OK";
export const GET_POST_ERROR = "GET_POST_ERROR";

export const actionGetPost = () => ({
  type: GET_POST,
});

export const actionGetPostOk = (post) => ({
  type: GET_POST_OK,
  payload: post,
});

export const actionGetPostError = () => ({
  type: GET_POST_ERROR,
});

export function getPost(postId) {
  return async (dispatch) => {
    dispatch(actionGetPost());

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${postId}`
      );
      const data = await response.json();

      dispatch(actionGetPostOk(data));
    } catch (error) {
      console.log(error);
      dispatch(actionGetPostError());
    }
  };
}
```

Esta acción es muy similar a la acción que hemos creado para la lista de posts. La única diferencia es que la función recibe el **`postId`** del post como argumento para individualizar la petición, almacenando un solo post.

- **`commentsActions`**: esta acción será también muy similar a las otras que hemos creado, con la diferencia de que irá enfocada a obtener los comentarios  generados en cada uno de los posts en nuestro archivo **`commentsActions.js`**:

```jsx
export const GET_COMMENTS = "GET_COMMENTS ";
export const GET_COMMENTS_OK = "GET_COMMENTS_OK";
export const GET_COMMENTS_ERROR = "GET_COMMENTS_ERROR";

export const actionGetComments = () => ({
  type: GET_COMMENTS,
});

export const actionGetCommentsOk = (comments) => ({
  type: GET_COMMENTS_OK,
  payload: comments,
});

export const actionGetCommentsError = () => ({
  type: GET_COMMENTS_ERROR,
});

export function getComments(postId) {
  return async (dispatch) => {
    dispatch(actionGetComments());

    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
      );
      const data = await response.json();

      dispatch(actionGetCommentsOk(data));
    } catch (error) {
      console.log(error);
      dispatch(actionGetCommentsError());
    }
  };
}
```

Una vez creadas las acciones vamos a editar los **`reducers`** e implementárselas a cada uno de ellos.

**Implementado las acciones** 

---

- **`postsReducer`**: lo primero que tenemos que hacer es importar las acciones en la parte superior de nuestro archivo **`postsReducer.js`** para su posterior uso.

```jsx
import * as actions from '../actions/postsActions';
```

Una vez importadas vamos a agregar una sentencia **`case`** por cada acción en un **`switch`** que nos devuelva el estado completo junto a los cambios efectuados.

Para la acción **`GET_POSTS`** definiremos el valor de **`loading`** como **`true`**, indicando que se iniciará la llamada a la API:

```jsx
import * as actions from "../actions/postsActions";

export const initialState = {
  posts: [],
  errors: false,
  loading: false,
};

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_POSTS:
      return { ...state, loading: true };
    default:
      return state;
  }
}
```

De la misma forma, mediante la acción **`GET_POSTS_OK`** setearemos el estado **`loading`** como **`false`**, ya que hemos obtenido los posts exitosamente, devolviendo la variable de estado posts. 

A través de la acción **`GET_POSTS_ERROR`** estableceremos el estado de **`loading`** como **`false`** y el valor de **`errors`** como **`true`**.

```jsx
import * as actions from "../actions/postsActions";

export const initialState = {
  posts: [],
  errors: false,
  loading: false,
};

export default function postsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_POSTS:
      return { ...state, loading: true };
    case actions.GET_POSTS_OK:
      return { posts: action.payload, loading: false, errors: false };
    case actions.GET_POSTS_ERROR:
      return { ...state, loading: false, errors: true };
    default:
      return state;
  }
}
```

Con esto ya tendríamos listo nuestro reducer, por lo que nos faltaría hacer exactamente lo mismo con **`postReducer`** y conectar los componentes que vayan a usar las acciones correspondientes. 

Más adelante crearemos estos componentes pero vamos a editar nuestro **`commentsReducer`** para aplicarle las acciones que hemos creado previamente.

- **`commentsReducer`**: vamos a editar nuestro archivo **`commentsReducer.js`** importando sus acciones y agregándolas para obtener los comentarios de un post a través de un **`switch`** de manera similar a lo que hemos hecho con postsReducer:

```jsx
import * as actions from "../actions/commentsActions";

export const initialState = {
  comments: [],
  loading: false,
  errors: false,
};

export default function commentsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_COMMENTS:
      return { ...state, loading: true };
    case actions.GET_COMMENTS_OK:
      return {
        ...state,
        comments: action.payload,
        loading: false,
        errors: false,
      };
    case actions.GET_COMMENTS_ERROR:
      return { ...state, loading: false, errors: true };
    default:
      return state;
  }
}
```

La lógica es exactamente igual que **`postsReducer`**, seteando los valores de **`state`** y **`loading`** según la acción y almacenando los comentarios obtenidos en la variable **`comments`**.

**Configuración de rutas v15 (Deprecated)**

---

Como hemos visto al principio de la configuración de nuestra aplicación estamos usando **`React Router`**, por lo que necesitaremos una ruta que usaremos a modo de inicio, una que liste los posts y otra que muestre cada post de manera individual.

Ya que no lo hemos hecho hasta ahora vamos a crear dentro de nuestra carpeta **`pages`** los archivos **`Home.jsx`**, **`Posts.jsx`** y **`PostPage.jsx`**. A esta última la hemos llamado así para diferenciarla del componente.

De momento vamos a limitarnos a crearlos con un texto para identificarlas una vez renderizadas:

```jsx
import React from 'react'

function Home() {
    return (
        <div>
            Home    
        </div>
    )
}

export default Home
```

Una vez creados nuestros tres componentes vamos a editar el componente principal **`App`** importando **`Router`**, **`Switch`**, **`Route`** y **`Redirect`** desde **`react-router-dom`** y las diferentes páginas tal y como vimos en la sesión de **`Router React`**:

```jsx
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import PostPage from "./pages/PostPage";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/posts" component={Posts} />
        <Route exact path="/posts/:postId" component={PostPage} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
```

Ya tenemos las rutas creadas, por lo que vamos a darle contenido a cada uno de nuestros componentes y añadir unos nuevos para poder conectar toda nuestra aplicación al completo.

**Componentes**

---

- **`Menu`**: vamos a agregar un menú a nuestra aplicación utilizando Bootstrap que nos lleve tanto al componente Home como a Posts y sus rutas correspondientes. Para ello vamos a crear un archivo llamado **`Menu.jsx`** en la carpeta componentes:

```jsx
import React from "react";
import { Link } from "react-router-dom";

export const Menu = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
    <div className="container">
      <ul className="navbar-nav">
        <li className="nav-item ">
          <Link className="nav-link" to="/">
            Inicio
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/posts">
            Posts
          </Link>
        </li>
      </ul>
    </div>
  </nav>
);
```

Una vez creado nuestro componente vamos a importarlo en App e insertarlo justo antes del <Switch> para mostrarlo desde todas las rutas:

```jsx
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Post from "./pages/Post";
import { Menu } from "./components/Menu";

function App() {
  return (
    <Router>
      <Menu />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/posts" component={Posts} />
        <Route exact path="/posts/:postId" component={Post} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
```

De esta manera ya podemos comprobar que las rutas están funcionando correctamente y que cualquier ruta que marquemos que no se corresponda a **`posts`** nos redirigirá a **`Home`** gracias a **`<Redirect/>`**:

![Animation2.gif](OPTIONAL%20Redux%20ReactJS%2016f63ef15d364f3586116c38a6128a78/Animation2.gif)

- **`Post`**: este componente nos mostrará cada uno de los posts en la ruta **`/posts/postId`**. Adicionalmente este componente mostrará los posts en la lista de posts del blog, usando para ello una propiedad llamada **`summary`** que nos muestre un resumen del post si el valor es **`true`**. Si el valor es **`false`** nos mostrará el contenido completo del post.

Vamos a crearlo dentro de nuestra carpeta componentes:

```jsx
import React from 'react';
import {Link} from 'react-router-dom';

export const Post = ({post, summary = false}) => (
  <article>
    {summary ? <h2>{post.title}</h2> : <h1>{post.title}</h1>}
    <hr/>
    <p>{summary ? post.body.substring(0, 100) : post.body}</p>

    {summary && (
      <Link to={`/posts/${post.id}`} className="btn btn-primary">
        View Post
      </Link>
    )}
    <hr/>
  </article>
);
```

- **`Comments`**: como hemos indicado en el concepto general de nuestra aplicación también tenemos que crear un componente que muestre los comentarios de cada post. Los comentarios que obtendremos se compondrán de un título, una dirección de e-mail y el cuerpo del mensaje:

```jsx
import React from "react";

export const Comment = ({ comment }) => (
  <div className="d-flex text-muted pt-3">
    <p className="pb-3 mb-0 small lh-sm border-bottom">
      <strong className="d-block text-gray-dark">{comment.title}</strong>
      <strong className="d-block text-gray-dark">{comment.email}</strong>
      {comment.body}
    </p>
  </div>
);
```

Dado que estos componentes serán elementos visuales en las páginas que previamente hemos creado vamos a insertarlos en ellas y darles contenido.

**Páginas**

---

- **`Home`**: esta es la página principal de nuestra aplicación y constará de un enlace al los posts de la página.

```jsx
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h1>Home</h1>
          <p>This is the Home Page</p>

          <Link to="/posts" className="btn btn-primary">
            Read Posts
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
```

- **`Posts`**: en esta página usaremos la función **`connect`** de **`react-redux`** para conectar React a Redux. Esta función conectara la **`store`** a un componente de React.
    
    
    Una vez conectados pasaremos un parámetro llamado **`mapStateToProps`** que usará el estado que queramos de la store y lo pasará a las propiedades del componente. En este caso solo usaremos las propiedades **`posts`**, **`errors`** y **`loading`** que mapearemos con el estado del reducer **`postReducer`**:
    
    ```jsx
    import React from "react";
    import { connect } from "react-redux";
    
    function Posts() {
      return (
        <div className="container">
          <h1 className="mb-4">Posts</h1>
        </div>
      );
    }
    
    const mapStateToProps = (state) => ({
      posts: state.posts.posts,
      errors: state.posts.errors,
      loading: state.posts.loading,
    });
    
    export default connect(mapStateToProps)(Posts);
    ```
    
    Ya tenemos la conexión realizada y los estados adquiridos, por lo que vamos a incluir la función **`getPosts`** desde la acción **`postsActions`**.
    
    Mediante **`useEffect`** ejecutaremos dicha función y el **`dispatch`** definido en **`getPosts`** con sus diferentes acciones estarán disponibles en nuestro componente. Además de esto pasaremos a nuestra página **`Posts`** todas las funcionalidades de **`getPosts`** para poder usarlas:
    
    ```jsx
    import React, {useEffect} from "react";
    import { connect } from "react-redux";
    import {getPosts} from '../actions/postsActions';
    
    const Posts = ({dispatch, posts, loading, errors}) => {
        useEffect(() => {
        dispatch(getPosts());
      }, [dispatch]);
    
      return (
        <div className="container">
          <h1 className="mb-4">Posts</h1>
        </div>
      );
    }
    
    const mapStateToProps = (state) => ({
      posts: state.posts.posts,
      errors: state.posts.errors,
      loading: state.posts.loading,
    });
    
    export default connect(mapStateToProps)(Posts);
    ```
    
    Solo nos falta importar el componente **`Post`** y crear la función **`showPosts`** que nos mostrará la lista, el mensaje de carga o el error según los estados de la aplicación:
    
    ```jsx
    import React, {useEffect} from 'react';
    import {connect} from 'react-redux';
    
    import {getPosts} from '../actions/postsActions';
    import {Post} from '../components/Post';
    
    const Posts = ({dispatch, posts, loading, errors}) => {
    
      useEffect(() => {
        dispatch(getPosts());
      }, [dispatch]);
    
      const showPosts = () => {
    
        if (loading) return <p>Loading posts...</p>
        if (errors) return <p>There has been an error.</p>
    
        return posts.map((post) => <Post key={post.id} post={post} summary={true} />);
      }
    
      return (
        <div className="container">
          <h1 className="mb-4">Posts</h1>
          <hr/>
          {showPosts()}
        </div>
      );
    }
    
    const mapStateToProps = (state) => ({
      posts: state.posts.posts,
      errores: state.posts.errors,
      cargando: state.posts.loading,
    });
    
    export default connect(mapStateToProps)(Posts);
    ```
    
    Si arrancamos nuestra aplicación podemos ver a través de las **`DevTools`** cómo se modifica el estado a medida que va recogiendo la información de la API: 
    
    ![Untitled](OPTIONAL%20Redux%20ReactJS%2016f63ef15d364f3586116c38a6128a78/Untitled%203.png)
    
    **`PostPage`**: la última pagina que queda por completar es **`PostPage`** , ya que nos mostrará cada post junto a sus comentarios al pulsar el botón **`View Post`**. 
    
    Como habréis visto en el componente Post, incluimos este botón de la siguiente forma:
    
    ```jsx
     <Link to={`/posts/${post.id}`} className="btn btn-primary">
            View Post
          </Link>
    ```
    
    De esta manera nos llevará a la ruta **`posts/`** + la **`id`** que recoja de la variable **`post`**, permitiéndonos acceder de forma individual a cada post mapeado con su respectivo id recopilado en la ruta del botón:
    
    ![Animation3.gif](OPTIONAL%20Redux%20ReactJS%2016f63ef15d364f3586116c38a6128a78/Animation3.gif)
    
    Por lo tanto vamos a ir a nuestra página **`PostPage`** y agregaremos el componente que nos muestra el post completo y sus comentarios. Una vez añadidos ejecutaremos **`getPost`** en su **`useEffect`**, siguiendo la misma lógica que para la lista completa. 
    
    La única diferencia es que obtendremos el parámetro **`postId`** de la ruta actual que encontraremos en el objeto **`match.params`**. Esta ruta la pasaremos por **`getPost`**. 
    
    Al igual que con la lista completa tenemos que crear una función **`showPost`** que mostrará la carga y los errores si fuera necesario.
    
    ```jsx
    import React, {useEffect} from 'react';
    import {connect} from 'react-redux';
    
    import {getPost} from '../actions/postActions';
    import {Post} from '../components/Post';
    
    const PostPage = ({ match, dispatch, post, errors, loading }) => {
    
      useEffect(() => {
        const { postId } = match.params;
        dispatch(getPost(postId));
      }, [dispatch, match]);
    
      const showPost = () => {
        if (loading.post) return <p>Loading post...</p>
        if (errors.post) return <p>There has been an error.</p>
    
        return <Post post={post} summary={false} />
      }
    
      return (
        <div className="container">
          {showPost()}
      
        </div>
      )
    }
    
    const mapStateToProps = state => ({
      post: state.post.post,
      errors: { post: state.post.errors },
      loading: { post: state.post.loading },
    });
    
    export default connect(mapStateToProps)(PostPage);
    ```
    
    El estado realizará una comprobación de que el **`postId`** es correcto y nos pintará en pantalla el post individual y completo: 
    
    ![Animation4.gif](OPTIONAL%20Redux%20ReactJS%2016f63ef15d364f3586116c38a6128a78/Animation4.gif)
    
    Al haberse establecido **`summary`** como false nos imprimirá todos los campos de texto completos, pero aún nos falta una sección por terminar: los comentarios.
    
    **Comentarios**
    
    ---
    
    Tenemos que mostrar los comentarios en los post. Para ello vamos a modificar un poco más nuestra **`PostPage.jsx`** e importar la acción **`getComments`** y el componente **`Comments`**.
    
    Una vez importados añadiremos los comentarios a la función **`mapStateToProps`** y la función **`showComments`** que nos permita mostrarlo por pantalla de manera similar a como hemos hecho las otras dos funciones **`showPost`** y **`showPosts`**.
    
    Solo nos quedaría iniciar la acción de **`getComments`** mediante un **`dispatch`** y tendríamos el siguiente código en PostPage:
    
    ```jsx
    import React, { useEffect } from "react";
    import { connect } from "react-redux";
    
    import { getPost } from "../actions/postActions";
    import { Post } from "../components/Post";
    
    import { getComments } from "../actions/commentsActions";
    import { Comment } from "../components/Comment";
    
    const PostPage = ({ match, dispatch, post, errors, loading, comments }) => {
      useEffect(() => {
        const { postId } = match.params;
        dispatch(getPost(postId));
        dispatch(getComments(postId));
      }, [dispatch, match]);
    
      const showPost = () => {
        if (loading.post) return <p>Loading post...</p>;
        if (errors.post) return <p>There has been an error.</p>;
    
        return <Post post={post} summary={false} />;
      };
    
      const showComments = () => {
        if (loading.comments) return <p>Loading comments...</p>;
        if (errors.comments) return <p>There has been an error.</p>;
    
        return comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ));
      };
    
      return (
        <div className="container">
          {showPost()}
          <h2>Comments</h2>
          {showComments()}
        </div>
      );
    };
    
    const mapStateToProps = (state) => ({
      post: state.post.post,
      comments: state.comments.comments,
      errors: { post: state.post.errors },
      loading: { post: state.post.loading },
    });
    
    export default connect(mapStateToProps)(PostPage);
    ```
    
    De esta forma, tanto como con las **`DevTools`** como el propio navegador podemos comprobar que nuestra aplicación está corriendo perfectamente y sin ningún tipo de problema, manejando los estados tal y como le hemos definido:
    
    ![Animation5.gif](OPTIONAL%20Redux%20ReactJS%2016f63ef15d364f3586116c38a6128a78/Animation5.gif)
    
    ![Animation6.gif](OPTIONAL%20Redux%20ReactJS%2016f63ef15d364f3586116c38a6128a78/Animation6.gif)