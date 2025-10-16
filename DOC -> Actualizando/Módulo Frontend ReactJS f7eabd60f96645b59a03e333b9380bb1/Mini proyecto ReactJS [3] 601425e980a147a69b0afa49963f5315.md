# Mini proyecto ReactJS [3]

### Crear una nueva aplicación de React sobre nuestros HOBBIES

Instrucciones de la práctica:

- crear proyecto llamado my-hobbies
- limpiar el código de info y config por defecto.
- crear dentro de src una carpeta componentes.
- dentro de src también, crear una carpeta HOBBIES que tendrá un archivo js llamado HOBBIES.js en el que mockearemos la información que vayamos a usar. Os dejo un ejemplo.

```jsx
export const HOBBIES = {
  read: {
		title: ""
    authorName: "",
    authorSurname: "",
    genre: "",
    dateOfPublication: "",
    authorBirthDate: "29/05/1970",
    bookImage: "",
    otherBooks: [
      {
        info: "",
      },
      {
        info: "",
      },
      {
        info: "",
      },
      {
        info: "",
      },
    ],
  },
  sports: [
    {
      name: "Football",
      indoor: false,
      favoriteTeam: "",
    },
    {
      name: "",
      indoor: false,
      favoriteTeam: "",
    },
    {
      name: "Football",
      indoor: true,
      favoriteTeam: "",
    },
  ],
  movies: [
    {
      name: "",
      type: "Movie/Serie",
      genre: "",
      vote: 9,
    },
   {
      name: "",
      type: "Movie/Serie",
      genre: "",
      vote: 0,
    },
  ],
  languages: {
    language: "English",
    wrlevel: "Native",
    splevel: "Native",
  },
  songsHeard: [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  
};
```

En el mock de ejemplo hemos almacenado los datos en arrays, objetos y arrays de objetos. Tened esto en cuenta a la hora de querer mostrar los datos (tener en cuenta si podemos hacer un map o tenemos que acceder primero a la propiedad…)

- Así, los componentes que tendréis que crear serán Read, Sports, Movies, Languages y SongsHeard, que representarán cada uno de las propiedades de la constante HOBBIES.
- Además, todos estos componentes tendrán que ser hijos del componente App que se os creará por defecto en el proyecto.

```jsx
const Read = () => {
	return(
		<>
			<Author/>
			<Books/>
			</>
)

}
```