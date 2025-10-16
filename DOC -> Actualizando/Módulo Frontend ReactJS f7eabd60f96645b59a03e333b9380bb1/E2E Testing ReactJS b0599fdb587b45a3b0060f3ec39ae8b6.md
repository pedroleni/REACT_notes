# E2E Testing ReactJS

**Instalación manual**

Este proceso puede hacerse también de forma manual primero instalando cypress como dependencia de desarrollo.

```jsx
npm install -D cypress
```

 

Una vez instalado, en el archivo .eslintrc es importante añadir como “writable” las globales que vamos a usar en los tests.

```jsx
"globals": {
    "describe": "writable",
    "it": "writable",
    "cy": "writable"
  }
```

Por último, en el archivo package.json se puede añadir un script que ejecute cypress como hace Acceleratorjs. Lo que es una buena práctica ya que así más legible.

```jsx
"scripts": {
    "cypress:open": "cypress open"
  }
```

### Test básico

Para crear un nuevo test hay que ejecutar en la terminal el script que hemos preparado antes.

```jsx
npm run cypress:open
```

Al ejecutarlo se abre Cypress y aparece una ventana en la que aparece la opcion de crear un nuevo spec.

![Untitled](E2E%20Testing%20ReactJS%20b0599fdb587b45a3b0060f3ec39ae8b6/Untitled.png)

Clickamos en ahí y creamos el spec. Esto va a crear en nuestro proyecto una carpeta llamada cypress donde dentro tendremos un archivo spec.cy.js con el siguiente contenido:

```jsx
describe('spec.cy.js', () => {
	it('should visit', () => {
		cy.visit('/')
	})
})
```

Este contenido lo vamos a borrar y aquí es donde vamos a programar nuestro test.

Como puedes ver en el test que nos da Cypress por defecto Cypress nos provee de funciones propias como: 

- **describe:** Esta función nos permite dar un nombre al conjunto de tests.
- **it:**  Es la función que crea el test.
- **visit:** Es la función a la que le pasamos la URL de la página a testear.

Para este ejemplo vamos a hacer un test del elemento h1 que tenemos en nuestro componente App. Comprobaremos que efectivamente cuando se renderice la web el texto que aparece en pantalla como h1 será igual al que escribamos en nuestro test.

En el componente App escribimos el siguiente código:

```jsx
const App = () => {
  return (
    <div>
      <h1>Vite + React + Styled-Components + Cypress</h1>
    </div>
  )
}
```

Para testearlo nos vamos a la carpeta e2e en cypress y en el archivo spec.cy.js. borramos el test que viene por defecto.

```jsx
describe('testing', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173/')
    cy.get('h1').should(
      'contain.text',
      'Vite + React + Styled-Components + Cypress'
    )
  })
})
```

Comenzamos definiendo el nombre de nuestro conjunto de test y para ello vamos a utilizar el método **describe** que hemos visto antes.

Dentro de este ejecutamos el método **it** y como primer parámetro le pasaremos un nombre para el test.

Utilizando el método **visit** pasamos la URL donde está levantado nuestro proyecto.

Además de estos 3 métodos utilizaremos 2 que no habíamos visto hasta ahora:

- **get:** Esta función permite seleccionar un elemento especifico de la web.
- **should:** La función should es la que comprueba que lo que le pasamos por parámetro aparece en la web. Esta función recibe 2 parámetros. El primero es el encadenante donde le pasaremos encadenantes como have.class, contain.text, etc. El segundo es el valor que queremos testear.

Para nuestro ejemplo seleccionamos el elemento h1 utilizando **get** y seguido le indicamos con un **should** que debe contener un texto y el texto que tiene que aparecer en pantalla como h1 que en nuestro caso es “Vite + React + Styled-Components + Cypress”.

Pasamos a la fase de ejecutar el test y ver si todo funciona correctamente. Para ello haremos 2 cosas.

- Levantar el proyecto.
- Ejecutar cypress.

Como te habrás dado cuenta, antes cuando hemos escrito el test hemos utilizado **visit** para pasarle al test la URL donde se levantará nuestro proyecto y esque es muy importante que levantemos el proyecto antes de hacer el test o si no este fallará ya que no puede encontrar y renderizar la página.

  una vez levantado nuestro proyecto ejecutamos el comando que utilizamos antes para ejecutar cypress: 

```jsx
npm run cypress:open
```

Nos aparecerá la siguiente pantalla con 2 opciones y entraremos en E2E Testing.

![Untitled](E2E%20Testing%20ReactJS%20b0599fdb587b45a3b0060f3ec39ae8b6/Untitled%201.png)

Una vez dentro elegiremos el navegador en el que queremos realizar el test y hacemos click en Start E2E Testing como vemos a continuación.

![Untitled](E2E%20Testing%20ReactJS%20b0599fdb587b45a3b0060f3ec39ae8b6/Untitled%202.png)

Por último solo nos queda entrar en nuestro test llamado spec.cy.js.

![Screenshot 2022-12-19 003256.png](E2E%20Testing%20ReactJS%20b0599fdb587b45a3b0060f3ec39ae8b6/Screenshot_2022-12-19_003256.png)

Si todo ha ido correcto te aparecerá la siguiente pantalla con un mensaje en verde.

![Untitled](E2E%20Testing%20ReactJS%20b0599fdb587b45a3b0060f3ec39ae8b6/Untitled%203.png)

## Test de GET data y renderizado

---

A veces la aplicación requiere de la data que proporciona una API para renderizar ciertos componentes o elementos. Este proceso también se puede testear con cypress comprobando que efectivamente se ha renderizado un elemento que depende de esa data.

### Preparación

Para esta guía tenemos un json-server simulando ser la API con la data de 2 películas.

```jsx
{
  "movies": [
    {
      "id": "1",
      "title": "harry potter"
    },
    {
      "id": "2",
      "title": "The Lord of the Rings"
    }
  ]
}
```

En el archivo App.jsx hay un estado que por defecto es un array vacío pero que una vez cargue la data de la API será un array de películas. Por último, una vez existan las películas, el titulo de estas se renderizará como un listado.

```jsx
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { getMovies} from './api/services'
const App = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    getMovies().then((res) => setData(res))
  }, [])

  return (
    <StyledApp>
      <ul>
        {data && data.map((movie) => <li key={movie.id}>{movie.title}</li>)}
      </ul>
    </StyledApp>
  )
}

export default App

const StyledApp = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #242424;
  color: #6b43b2;
`
```

Además de App.jsx y el json-server el proyecto también contiene una carpeta api con un archivo llamado services.js donde está la función que hace el fetch a la API.

```jsx
const getMovies = async () => {
  const rawData = await fetch('http://localhost:8080/movies')
  const data = await rawData.json()

  return data
}

export { getMovies, postMovie }
```

Ahora que el json-server y la app están ejecutándose ya se pueden testear.

### Programación del test

La idea es programar un test que que compruebe si se ha renderizado un li con el titulo de la película “*The Lord of the Rings”.* Si este elemento li contiene ese texto significa que ha hecho fetch a la API y ha obtenido la data correctamente.

Para ello nos ubicamos en el archivo spec.cy.js dentro de la carpeta e2e en cypress. 

Para empezar, con el método **describe** damos un nombre al conjunto de test. Después utilizamos **it** para crear el test.

Dentro del test escribimos **cy.visit(url)** para indicarle la dirección URL a la que tiene que navegar para hacer el test. Una vez el test haya entrado en la web queremos  apuntar a los elementos li por lo que hacemos un **cy.get(’li’)** y este debería contener el texto ****“*The Lord of the Rings”* y por eso utilizamos should(’contain.text’, ‘The Lord of the Rings’*)*

Aquí abajo te dejo un ejemplo con código⬇️

```jsx
describe('HTTP example', () => {
  it('test list content', () => {
    cy.visit('http://localhost:5173/')
    cy.get('li').should('contain.text', 'The Lord of the Rings')
  })
})
```

Para probar que el test funciona ejecutamos en la terminal cypress.

```jsx
npm run cypress:open
```

Elegimos la opción E2E Testing, en nuestro caso elegimos Chrome como navegador y ejecutamos el test clickando en el. Como resultado obtendremos un test exitoso.

![Untitled](E2E%20Testing%20ReactJS%20b0599fdb587b45a3b0060f3ec39ae8b6/Untitled%204.png)

## Test de POST data y renderizado

---

Para este ejemplo utilizaremos el código del proyecto anterior con el json-server, el App.jsx y el archivo services de la carpeta api.

Nos ubicamos en App.jsx haciendo algunos cambios y añadiendo un formulario para hacer el post con un input y un botón.

```jsx
import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { getMovies, postMovie } from './api/services'
const App = () => {
  const [data, setData] = useState([])
  const [title, setTitle] = useState('')

  const handleSubmit = (movie) => {
    postMovie(movie)
  }

  useEffect(() => {
    getMovies().then((res) => setData(res))
  }, [])

  return (
    <StyledApp>
      <StyledForm onSubmit={async () => await handleSubmit({ title })}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          name="title"
          placeholder="Title"
        />
        <button type="submit">Add movie</button>
      </StyledForm>
      <ul>
        {data && data.map((movie) => <li key={movie.id}>{movie.title}</li>)}
      </ul>
    </StyledApp>
  )
}

export default App

const StyledApp = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #242424;
  color: #6b43b2;
`

const StyledForm = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`
```

En el archivo services.js añadimos la siguiente función que es una petición POST.

```jsx
const postMovie = (movie) => {
  fetch('http://localhost:8080/movies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: movie.title,
      year: movie.year
    })
  })
}
```

Lo siguiente que haremos es crear un nuevo test. Para ello ejecutamos cypress haciendo **npm run cypress:open.** Seleccionamos la opción E2E Testing y el navegador. En el dashboard de cypress hacemos click en new spec y seguimos los pasos que hicimos en el test básico. En nuestro caso a este test lo hemos llamado post.cy.js.

![Screenshot 2022-12-19 214632.png](E2E%20Testing%20ReactJS%20b0599fdb587b45a3b0060f3ec39ae8b6/Screenshot_2022-12-19_214632.png)

Nos situamos en el archivo post.cy.js para programar el nuevo test. Para este test la idea es abrir la página, escribir el titulo de una película en el input y clickar en el botón de submit para postear la película en el json-server. Una vez posteado comprobamos que la nueva película aparece renderizada.

Aquí código para este test ⬇️

```jsx
describe('empty spec', () => {
  it('passes', () => {
		cy.visit('http://localhost:5173/')
    cy.wait(3000)
    cy.get('input').type('Jurassic Park')
    cy.contains('Add movie').click()
    cy.get('li').should('contain.text', 'Jurassic Park')
  })
})
```

Para este caso como puedes ver arriba utilizamos diferentes métodos.

- it: Es la función que crea el test.
- wait: Esta función espera el tiempo que le indiquemos para seguir ejecutando el test.
- get: Es un selector. En este caso selecciona el elemento input del html.
- type: Esta función nos permite simular que el usuario escribe un texto.
- contains: Es otro Selector aunque este selecciona los elementos que contengan el texto que le indicamos.
- click: Es la función que simula un click del usuario.
- should: Es la función encargada de comprobar el resultado esperado.

Si ejecutamos cypress y probamos el test, este lo que hará es entrar en la página, esperar 3 segundos y despues seleccionar el input donde escribirá *“Jurassic Park”.*

Una vez escrito seleccionará el botón que contenga el texto *“Add movie”* lo que hará el submit del formulario ejecutando la petición post para guardar la película en el servidor. Al hacer submit la página se refresca por lo que volverá a ejecutarse el useEffect haciendo un fetch al servidor y ahora renderizando los títulos anteriores y el de *“Jurassic park”*. 

Por lo tanto el test selecciona los elementos li y comprueba que alguno de ellos contenga el texto “Jurassic Park”. Como efectivamente el el texto del li y el texto que el test espera coinciden el el test pasa satisfactoriamente.

![Untitled](E2E%20Testing%20ReactJS%20b0599fdb587b45a3b0060f3ec39ae8b6/Untitled%205.png)