# Performance ReactJS

**Introducción**

---

Uno de los puntos más importantes que tenemos que tener en cuenta cuando desarrollamos aplicaciones web es la **optimización**, es decir, conseguir responder lo más rápido posible a cualquier petición del usuario.

De hecho, la velocidad de carga de una página [sigue una relación con la tasa de rebote](https://www.section.io/blog/page-load-time-bounce-rate/) y conseguir retener al usuario por el mayor tiempo posible incrementará nuestras posibilidades de terminar convirtiéndole en “cliente”.

Por eso, en este artículo quiero hablaros de algunas de las herramientas que nos proporciona **React** “out of the box” así como un par de librerías que nos ayudarán a **mejorar el rendimiento de nuestras aplicaciones.**

**Lazy loading**

---

La carga asíncrona de elementos es una de las herramientas más potentes que podemos emplear para mejorar el rendimiento de nuestra página. De hecho, suele ser ya algo “obligado” en cualquier página web seria que las imágenes por debajo del *viewport* se carguen de esta forma de cara a aligerar la carga inicial de la página.

Desde la versión [16.6 de React podemos emplear React.lazy](https://es.reactjs.org/blog/2018/10/23/react-v-16-6.html) para realizar la carga asíncrona de componentes combinándolo junto a `suspense` lo cual favorece la separación del código de cara a que sólo carguemos lo que necesitemos en cada momento.

Para emplear esta funcionalidad, basta con envolver la importación dinámica de un componente con React.lazy de modo que podamos *renderearlo* sin preocuparnos de si su código ya se ha traído desde el servidor:

```jsx
// LazyComponent.jsx
export default () => (<div>Lazy Component</div>)

// App.jsx
import React, {lazy} from 'react'

const LazyComponent = lazy(()=>import('./components/LazyComponent.jsx'))

const App = () => {
	return(
		<LazyComponent/>
	)
}

```

Esto mejora además si combinamos **React.lazy** con **Suspense,** un componente que nos permite mostrar un “fallback” mientras **React.lazy** recupera el componente desde el servidor y así evitar que el usuario vea partes vacías mientras se cargan:

```jsx
// LazyComponent.jsx
export default () => (<div>Lazy Component</div>)

// App.jsx
import React, {lazy} from 'react'

const LazyComponent = lazy(()=>import('./components/LazyComponent.jsx'))

const App = () => {
	return(
		<Suspense fallback={<div>Loading...</div>}>
			<LazyComponent/>
		<Suspense/>
	)
}

```

Como veis, es una API muy sencilla de emplear pero que trae grandes beneficios tanto a nivel de interfaz como a la hora de mantener y reutilizar nuestro código (ya que facilita separarlo en trozos pequeños a los que recurriremos gracias a React.lazy).

**React.memo || useMemo**

---

Dos funciones primas - hermanas que nos proporciona React para cachear elementos de nuestras aplicaciones.

Por un lado, `useMemo` es un *hook* que nos permite *cachear* el resultado de operaciones costosas de modo que obtengamos siempre el mismo resultado siempre y cuando sus dependencias no cambien (muy al estilo del hook `useEffect` ).

Imaginad que tenemos el siguiente componente:

```jsx
const MyComponent = ({foo, bar}) => {
	const doHeavyTask(element) => value

	const value = doHeavyTask(foo)
	
	return(
		<>
			<p>value: {value}</p>
			<p>bar: {bar}</p>
		</>
	)
}
```

Como podéis ver, pasamos a la función `doHeavyTask` la propiedad `foo` para realizar un cálculo costoso y obtener `value`. El problema es que si sólo cambia la propiedad `bar` realizaremos el mismo cálculo con `foo` aunque vayamos a obtener el mismo resultado. Gracias a `useMemo` podemos memorizar este valor hasta el momento en que `foo` cambie:

```jsx
const MyComponent = ({foo, bar}) => {
	const doHeavyTask(element) => value

	const value = useMemo(()=> doHeavyTask(foo), [foo]);
	
	return(
		<>
			<p>value: {value}</p>
			<p>bar: {bar}</p>
		</>
	)
}
```

Gracias a esto sólo realizaremos ese cálculo pesado cuando cambie la propiedad `foo` .

Por otra parte, **React.memo** nos permite cachear componentes funcionales de modo que no se *reenderen* de nuevo si sus propiedades no han cambiado (un comportamiento muy similar al que obteníamos cuando creábamos un componente de clase extendiendo de `PureComponent` ).

Por ejemplo, supongamos el siguiente caso:

```jsx
const MyComponent = ({value}) => (<div>{value}</div>)

const App = ({value}) => {
	const [count, setCount] = useState(0)
	return(
		<button onClick={()=>setCount(count++)}>+</button>
		<p>Count: {count}</p>
		<MyComponent value={value}>
	)
}
```

Al componente `MyComponent` le estamos pasando la propiedad `value` recibida en `App` . Además, cada vez que se pulse el botón se actualizará la variable `count` provocándose un *rerender* en todo el componente pero sin que `MyComponent` haya sufrido ningún cambio (porque el valor de `value` no habrá cambiado). Esto provoca que estemos *rendereando* el componente en vano desperdiciando el tiempo que tarde en volverse a pintar.

Esto podemos evitarlo gracias a **React.memo:**

```jsx
const MyComponent = ({value}) => (<div>{value}</div>)
const MemoMyComponent = React.memo(MyComponent)

const App = ({value}) => {
	const [count, setCount] = useState(0)
	return(
		<button onClick={()=>setCount(count++)}>+</button>
		<p>Count: {count}</p>
		<MemoMyComponent value={value}>
	)
}
```

Gracias a `React.memo(MyComponent)` , React memorizará el componente y mientras que sus propiedades no cambien devolverá siempre el resultado que tiene cacheado.

**useCallback**

---

Y hablando de cachear cosas también tenemos a nuestra disposición el *hook* `useCallback` *.*

Este *hook* es, de hecho, una versión específica de `useMemo` tal y como se explica en la [documentación de React:](https://react.dev/reference/react/useCallback)

> useCallback(fn, deps) is equivalent to useMemo(() => fn, deps).
> 

y nos permite memorizar declaraciones de funciones de modo que evitamos *rerenders* innecesarios provocados por la creación de la misma función una y otra vez. Vamos a verlo con un ejemplo:

```jsx
const MyComponent = ({onClick, value})=>(
	<>
		<p>value: {value}</p>
		<button onClick={onClick}>+</button>
	</>
)

const MemoMyComponent = React.memo(MyComponent)

const App = () => {
	const [count, setCount] = useState(0)
	return(
		<MemoMyComponent onClick={()=>setCount(count++)} value={count}>
			+
		</MemoMyComponent>
	)
}
```

Como veis, estamos memorizando el componente `MyComponent` del mismo modo que antes pero ahora el problema es el siguiente. Cada vez que `App` sufra un *render* estamos creando una nueva función `onClick` para pasarle a `MyComponent` que aunque haga lo mismo poseerá una referencia distinta y por tanto React.memo será incapaz de devolver el resultado que tenía cacheado (la comparación la realiza por referencia, no por valor).

Es aquí donde podemos emplear el *hook* `useCallback` **que nos permitirá obtener la misma función para la propiedad `onClick` una y otra vez mientras que sus dependencias no cambien:

```jsx
const MyComponent = ({onClick, value})=>(
	<>
		<p>value: {value}</p>
		<button onClick={onClick}>+</button>
	</>
)

const MemoMyComponent = React.memo(MyComponent)

const App = () => {
	const [count, setCount] = useState(0)
	const onClick = useCallback(()=> setCount(count++), [count])
	return(
		<MemoMyComponent onClick={onClick} value={count}/>
	)
}
```

**Reselect**

---

Aunque **Redux** haya perdido “popularidad” en favor de los *hooks* (no quiero decir que se use menos, pero si ha perdido ese efecto *Wow!* que tuvo al principio) también existen algunas librerías que nos permiten mejorar el rendimiento a la hora de recuperar información de la *store.*

Una de ellas es **reselect:**

[https://github.com/reduxjs/reselect](https://github.com/reduxjs/reselect)

la cual nos permite escribir “selectores” para nuestra *store* que memoricen los resultados. De este modo, si por ejemplo estamos obteniendo un valor de la *store* y aplicándole un cálculo al recuperarlo, podemos emplear la librería **Reselect** para memorizar el resultado del cálculo de modo que siempre que el valor no cambie obtengamos el mismo resultado sin necesidad de calcularlo (del mismo modo que hace el hook `useMemo` ).

Un ejemplo muy sencillo para ilustrar el uso que podemos darle a la librería **Reselect** lo podemos obtener de su propia documentación:

```jsx
import {createSelector} from 'reselect'

const shopItemsSelector = state => state.shop.items;

const subtotalSelector = createSelector(
	shopItemsSelector,
	items => items.reduce((acc, item) => acc, item.value, 0)
)
```

Suponiendo que tenemos un array de items en nuestra *store,* podemos crear un selector memorizado mediante la función `createSelector` que calcule el subtotal de la compra y que devuelva siempre el mismo resultado siempre y cuando los `items` no cambien ( `createSelector` recibe dos argumentos: el primero es un selector para recuperar el elemento sobre el cual realizaremos el cálculo y el segundo el cálculo propiamente dicho).

**Listas virtualizadas**

---

Abandonando un poco ya el tema de *cachear* resultados, una librería muy interesante de cara a lograr un buen rendimiento de nuestra interfaz es **React Window**.

[https://github.com/bvaughn/react-window](https://github.com/bvaughn/react-window)

Esta librería permite *renderear* únicamente la parte de una lista que está visible en el *viewport* de modo que se reduzca el tiempo inicial de carga así como la memoria empleada.

Su uso es bastante sencillo tal y como podéis ver:

```jsx
import React from 'react'
import {FixedList as List} from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'

const Row = ({index, style})=>(
	<div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
		Row {index}
	</div>
)

const Example = () => (
	<AutoSizer>

	{({height, width})=> (
		<List
			className='List'
			height={height}
			itemCount={1000}
			itemSize={35}
			width={width}
		>
			{Row}
		</List>
	)}
	</AutoSizer>
)
```

y entre algunas de sus características se encuentran la posibilidad de cargar de forma asíncrona los datos de la lista así como de situar de forma “sticky” sus elementos.

Os recomiendo echarle un ojo tanto a esta librería como a su hermana mayor:

[https://github.com/bvaughn/react-virtualized](https://github.com/bvaughn/react-virtualized)

ya que os ayudarán a lidiar con problemas de rendimiento en grandes conjuntos de datos.

**Conclusiones**

---

Esta serie de trucos que os he presentado tan sólo representan la punta del iceberg de todo lo que podemos hacer para lograr optimizar nuestras aplicaciones escritas con React.

A partir de aquí os animo a leer acerca de los Web workers, una de las técnicas que si bien no está 100% soportada, sí que empieza a cobrar importancia a la hora de mejorar el rendimiento de las aplicaciones, ya que “solventan” el problema de la ejecución de Javascript en un único hilo.

[Optimizing React App performance using Web Workers](https://medium.com/prolanceer/optimizing-react-app-performance-using-web-workers-79266afd4a7)

[React Worker DOM](https://web-perf.github.io/react-worker-dom/)

**Artículo original**

---

[React. 5 trucos para mejorar el rendimiento de tus aplicaciones](https://latteandcode.medium.com/react-5-trucos-para-mejorar-el-rendimiento-de-tus-aplicaciones-25afc379bfa7)