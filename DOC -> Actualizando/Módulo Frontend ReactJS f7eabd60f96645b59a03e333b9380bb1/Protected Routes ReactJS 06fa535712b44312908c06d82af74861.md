# Protected Routes ReactJS

**Introducción**

---

React Router v6 es una biblioteca de enrutamiento popular y poderosa para aplicaciones React. Proporciona un enfoque declarativo basado en componentes para el enrutamiento y maneja las tareas comunes de manejo de parámetros de URL, redireccionamientos y carga de datos.

React Router proporciona una de las API más intuitivas disponibles y permite la carga diferida y la representación del lado del servidor compatible con SEO. Esta última versión de React Router introdujo muchos conceptos nuevos, como <Outlet /> y layout routes, pero la documentación aún es escasa.

Vamos a ver  cómo crear rutas protegidas y agregar autenticación con React Router v6.

**Empezando**

---

Vamos a crear nuestro proyecto de React e instalar las dependencias necesarias para la navegación.

```bash
npm create vite@latest react-auth
cd react-auth
npm install
npm install react-router-dom
```

Una vez que tenemos nuestras dependencias instaladas tenemos que modificar nuestro main.jsx, Import `BrowserRouter` desde `react-router-dom` y wrappear el `<App/>` component con `<BrowserRouter/>` .

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

Genial! Ahora, estamos preparados para usar React Router y los hooks asociados en cualquier lugar de nuestra app.

Ahora podemos continuar reemplazando el código repetitivo del archivo App.js con algunas rutas.

**Enrutado básico**

---

React Router proporciona los componentes <Routes /> y <Route /> que nos permiten renderizar componentes en función de su ubicación actual.

```jsx
import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'

import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
```

**Enrutado básico con `<route/>`**

---

`<Route />` proporciona el mapeo entre rutas en la aplicación y diferentes componentes de React. Por ejemplo, para representar el componente LoginPage cuando alguien navega a `/login`, solo necesitamos proporcionar la `<Route />`, así.

```jsx
<Route path="/login" element={<LoginPage />} />
```

El componente `<Route />` se puede considerar como una declaración if; actuará sobre una ubicación de URL con su elemento solo si coincide con la ruta especificada.

**Enrutado básico con `<routes/>`**

---

El componente `<Routes />` es una alternativa al componente `<Switch />` de React Router v5. Para usar `<Routes />`, primero crearemos los archivos `Login.jsx` y `Home.jsx` dentro del directorio de páginas con el siguiente contenido.

```jsx
// Login.jsx
export const LoginPage = () => (
  <div>
    <h1>This is the Login Page</h1>
  </div>
);

// Home.jsx
export const HomePage = () => (
  <div>
    <h1>This is the Home Page</h1>
  </div>
);
```

A continuación, ejecutaremos este comando para iniciar la aplicación.

```bash
npm run dev
```

Genial! vamos por buen camino, el resultado debería ser algo parecido a lo que vemos a continuación.

![basic-routing.gif](Protected%20Routes%20ReactJS%2006fa535712b44312908c06d82af74861/basic-routing.gif)

En el navegador, vemos el componente HomePage por defecto. Si vamos a la ruta `/login`, veremos el componente LoginPage en la pantalla.

Alternativamente, podemos usar un objeto de JavaScript simple para representar las rutas en nuestra aplicación usando el enlace `useRoutes`. Este es un enfoque funcional para definir rutas y funciona de la misma manera que la combinación de los componentes `<Routes/>` y `<Route/>`.

```bash
export default function App() {
  const routes = useRoutes([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/login",
      element: <LoginPage />
    }
  ]);
  return routes;
}
```

De este modo obtenemos un resultado similar al anterior, podéis escoger la vía que os parezca más cómoda.

![basic-routing.gif](Protected%20Routes%20ReactJS%2006fa535712b44312908c06d82af74861/basic-routing%201.gif)

Ahora que se completó la configuración básica, veamos cómo podemos crear rutas protegidas para que los usuarios no autenticados no puedan acceder a cierto contenido en nuestra aplicación.

**Creando rutas protegidas**

---

Antes de crear la ruta protegida, creemos un hook personalizado que manejará el estado del usuario autenticado usando la API del contexto y el hook useContext.

```jsx
import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data) => {
    setUser(data);
    navigate("/profile");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
```

Con el hook useAuth, estamos exponiendo el estado del usuario y un par de métodos para el inicio y cierre de sesión del usuario. Cuando el usuario cierra la sesión, lo redireccionamos a la página de inicio usando el hook useNavigate de React Router.

Para mantener el estado del usuario incluso en la actualización de la página, usaremos el hook useLocalStorage que sincronizará el valor del estado en el  local.storage del navegador.

```jsx
import { useState } from "react";

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) { }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};
```

El componente `<ProtectedRoute />` simplemente verificará el estado actual del usuario desde el enlace useAuth y luego lo redirigirá a la pantalla de inicio si el usuario no está autenticado.

Para redirigir al usuario, usamos el componente `<Navigate />`. El componente `<Navigate />` cambia la ubicación actual cuando lo representa el componente principal. Utiliza el enlace useNavigate internamente.

En el archivo `App.jsx`, podemos envolver el componente de la página con el componente `<ProtectedRoute />`. Por ejemplo, a continuación, estamos envolviendo los componentes `<SettingsPage />` y `<ProfilePage />` con `<ProtectedRoute />`. Ahora, cuando los usuarios no autenticados intenten acceder a `/profile` o `/settings` path, serán redirigidos a la página de inicio.

```jsx
import { Routes, Route } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { SignUpPage } from './pages/SignUpPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'

import { ProtectedRoute } from './components/ProtectedRoute'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App
```

Bueno, el enfoque anterior funciona bien si hay un número limitado de rutas protegidas, pero si hay varias de esas rutas, tendríamos que envolver cada una, lo cual es tedioso.

En su lugar, podemos usar la función de ruta anidada de React Router v6 para envolver todas las rutas protegidas en un solo layout.

**Usando rutas anidades y `<Outlet />`**

---

Una de las funciones más potentes de React Router v6 son las rutas anidadas. Esta característica nos permite tener una ruta que contiene otras rutas secundarias. La mayoría de nuestros diseños están acoplados a segmentos en la URL, y React Router lo admite por completo.

Por ejemplo, podemos agregar un componente principal `<Route />` a las rutas `<HomePage />` y `<LoginPage />`, así. [Es un ejemplo sin implementar, mostramos la sintaxis y lo abordamos poco a poco].

```jsx
import { ProtectedLayout } from './components/ProtectedLayout'
import { HomeLayout } from './components/HomeLayout'
// ...

export default function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
```

El componente principal `<Route />` también puede tener una ruta y es responsable de mostrar el componente secundario `<Route />` en la pantalla.

Cuando el usuario navega a `/dashboard/profile`, el enrutador representará `<ProfilePage />`. Para que esto ocurra, el elemento de ruta principal debe tener un componente `<Outlet />` para representar los elementos secundarios. El componente Outlet permite que la interfaz de usuario anidada sea visible cuando se representan las rutas secundarias.

El elemento de ruta principal también puede tener una lógica empresarial común adicional y una interfaz de usuario. Por ejemplo, en el componente `<ProtectedLayout />` hemos incluido la lógica de ruta privada y también una barra de navegación común que estará visible cuando se representen las rutas secundarias.

```jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const ProtectedLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <nav>
        <Link to="/settings">Settings</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  )
};
```

En lugar del componente `<Outlet />`, también podemos optar por usar el hook useOutlet que tiene el mismo propósito.

```jsx
import { Link, Navigate, useOutlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <nav>
        <Link to="/settings">Settings</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      {outlet}
    </div>
  );
};
```

De forma similar a las rutas protegidas, no queremos que los usuarios autenticados accedan a la ruta `/login`. Manejemos eso en el componente `<HomeLayout />`.

```jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const HomeLayout = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard/profile" />;
  }

  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
      </nav>
      <Outlet />
    </div>
  )
};
```

En nuestro fichero `App.jsx` podemos wrappear nuestras páginas en los diferentes layouts creados.

```jsx
import { Routes, Route } from 'react-router-dom'

import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { SignUpPage } from './pages/SignUpPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'

import { ProtectedLayout } from './components/ProtectedLayout'
import { HomeLayout } from './components/HomeLayout'

import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App
```

**Definiendo nuestro proyecto paso a paso**

---

Vamos a comenzar con un pequeño refactor para hacer funcionar nuestra aplicación con todos los conceptos que hemos ido trabajando. Para ello revisaremos todo nuestro código a la vez que crearemos algunos componentes que nos ayuden a mejorar y completar este ejemplo.

**src/components**

---

Vamos a definir todos los componentes que vamos a necesitar, desde los dos componentes que funcionan como layout hasta un par de ellos para realizar un component de navegación y otro de estilado de páginas.

`ProtectedLayout.jsx` ⇒ Es un componente Layout que envuelve las páginas protegidas de nuestra aplicación. [El AppBar aún no lo hemos creado pero será un componente que recibe un objeto para definir la navegación].

```jsx
import { Navigate, useOutlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppBar } from './AppBar';

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to='/' />;
  }

  return (
    <div>
      <AppBar
        pages={[
          { label: 'Settings', path: 'settings' },
          { label: 'Profile', path: 'profile' }
        ]}
      />
      {outlet}
    </div>
  );
};
```

`HomeLayout.jsx` ⇒ Es un componente Layout que envuelve las páginas **no** protegidas de nuestra aplicación. [El AppBar aún no lo hemos creado pero será un componente que recibe un objeto para definir la navegación].

```jsx
import { Navigate, useOutlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppBar } from './AppBar'

export const HomeLayout = () => {
  const { user } = useAuth()
  const outlet = useOutlet()

  if (user) {
    return <Navigate to='/dashboard/profile' replace />
  }

  return (
    <div>
      <AppBar
        pages={[
          { label: 'Home', path: '/' },
          { label: 'Login', path: '/login' }
        ]}
      />
      {outlet}
    </div>
  )
}
```

`BasicPage.jsx` ⇒ Es un componente que recibe un título y descripción por props y los renderiza con los estilos predefinidos de la aplicación de Vite + React.

```jsx
export const BasicPage = ({ title, description }) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};
```

`AppBar.jsx` ⇒ Es nuestra barra de navegación, en cada Layout usará un objeto con el path y el label a definir.  Debemos tener en cuenta si el usuario está loggeado o no para renderizar el botón de logout. [Esto lo sabemos gracias a nuestro contexto].

```jsx
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const AppBar = ({ pages }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <nav>
      <span>React Router Auth</span>
      {pages?.map((page) => (
        <button
          key={page.label}
          onClick={() => handleNavigate(page.path)}
        >
          {page.label}
        </button>
      ))}
      {!!user && (
        <button key={"logout"} onClick={logout}> Logout </button>
      )}
    </nav>

  );
};
```

**src/hooks**

---

`AuthContext.jsx` ⇒ Es nuestro contexto para manejar la información del usuario. Tenemos tres elementos clave que manejará nuestro context [login(function), logout(function) y user(state)]. Usamos el useMemo para memorizar añadiendo como dependencia el state de user.

```jsx
import { createContext, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from './useLocalStorage'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null)
  const navigate = useNavigate()

  const login = async (data) => {
    setUser(data)
    navigate("/dashboard/profile", { replace: true })
  }

  const logout = () => {
    setUser(null)
    navigate("/", { replace: true })
  }

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
```

`useLocalStorage.jsx` ⇒ Gestiona el guardado del usuario en el local.storage de tal modo no tenemos que repetir la funcionalidad en los diferentes componentes.

```jsx
import { useState } from 'react'

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName)
      if (value) {
        return JSON.parse(value)
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue))
        return defaultValue
      }
    } catch (err) {
      return defaultValue
    }
  })
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue))
    } catch (err) { }
    setStoredValue(newValue)
  }
  return [storedValue, setValue]
}
```

**src/pages**

---

`HomePage.jsx` ⇒ Es la página inicial, usamos el componente `Basicpage` para envolver el contenido.

```jsx
import { BasicPage } from '../components/BasicPage'

export const HomePage = () => {
  return <BasicPage title="Home Page" description="Welcome to Auth || Routing" />;
};
```

`Login.jsx` ⇒ Es la página de login, un formulario básico que cuando introducimos cualquier email y pass nos permite acceder a las páginas protegidas pero antes realiza la navegación pertinente.

```jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const LoginPage = () => {
  const { login } = useAuth();
  const [userLogin, setUserLogin] = useState('');

  const handleInput = (ev) => {
    const { name, value } = ev.target;
    setUserLogin({ ...userLogin, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login(userLogin);
  };

  return (
    <div>
      <h1>This is the Login Page</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">
          <input type="email" name="email" id="email" required value={userLogin.name} onChange={handleInput} />
        </label>
        <label htmlFor="password">
          <input type="password" name="password" id="password" required value={userLogin.name} onChange={handleInput} />
        </label>
        <button type="submit">Login In!</button>
      </form>
      <Link to="/register">

        {"Don't have an account? Sign Up"}

      </Link>
    </div >
  )
}
```

`ProfilePage.jsx` ⇒ Es una página que carece de funcionalidad, es protegida solamente tendrán acceso los usuarios loggeados.

```jsx
import { BasicPage } from '../components/BasicPage'

export const ProfilePage = () => {
  return <BasicPage title="Profile Page" description="Welcome to Profile - Protected Route" />;
}
```

`SettingPage.jsx` ⇒  Es una página que carece de funcionalidad, es protegida solamente tendrán acceso los usuarios loggeados.

```jsx
import { BasicPage } from '../components/BasicPage'

export const SettingsPage = () => {
  return <BasicPage title="Setting Page" description="Welcome to Settings - Protected Route" />;
}
```

`SignUpPage.jsx` ⇒ Es una página que carece de funcionalidad, es pública solamente tendrán acceso los usuarios desde el login.

```jsx
import { BasicPage } from '../components/BasicPage'

export const SignUpPage = () => {
  return <BasicPage title="SignUp Page" description="WIP SignUp - Protected Route" />;
}
```

**/src**

---

`App.jsx` ⇒ Definimos nuestras rutas para establecer la navegación predeterminada tal y como hemos visto a lo largo de todo este proceso.

```jsx
import { Routes, Route } from 'react-router-dom'

import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { SignUpPage } from './pages/SignUpPage'
import { ProfilePage } from './pages/ProfilePage'
import { SettingsPage } from './pages/SettingsPage'

import { ProtectedLayout } from './components/ProtectedLayout'
import { HomeLayout } from './components/HomeLayout'

import './App.css'

function App() {
  return (
    <Routes>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
      </Route>

      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App
```

`main.jsx` ⇒ Debemos añadir nuestro contexto para tener acceso en los componentes de nuestra aplicación.

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

Guay! Hemos llegado a la parte en la que nos toca probar nuestro desarrollo y observar que tenemos nuestra navegación definida.

![login.gif](Protected%20Routes%20ReactJS%2006fa535712b44312908c06d82af74861/login.gif)