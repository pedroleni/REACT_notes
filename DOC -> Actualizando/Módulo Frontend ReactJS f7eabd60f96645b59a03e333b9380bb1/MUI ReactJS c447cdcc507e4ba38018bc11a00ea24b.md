# MUI ReactJS

**Introducción**

---

**MUI** (Material-UI) es una librería open-source de componentes para React potenciada por Google. 

Estos componentes prefabricados pueden ser incorporados en cualquiera de nuestros proyectos desarrollados con dicha librería y agilizar los tiempos tanto de maquetación como de funcionalidad interna de los mismos.

![Captura de Pantalla 2022-10-11 a las 14.34.53.png](MUI%20ReactJS%20c447cdcc507e4ba38018bc11a00ea24b/Captura_de_Pantalla_2022-10-11_a_las_14.34.53.png)

Algunas de las aplicaciones más famosas hacen uso de esta librería, véase Spotify, Amazon, Netflix, etc…

[MUI: The React component library you always wanted](https://mui.com/)

**Instalando MUI**

---

Para hacer uso de la librería MUI tendremos que instalar las dependencias necesarias para utilizar según qué componentes, ya que muchos de ellos nos pedirán ciertos requisitos o dependencias a la hora de utilizarlos.

El **bundle básico** para poder utilizar MUI incluye **material** y **emotion**, dos de las dependencias que se utilizan transversalmente en la librería:

```powershell
npm install @mui/material @emotion/react @emotion/styled
```

Por defecto, Material utiliza **emotion**, pero si queremos utilizar la librería **styled-componentes** tendremos que ejecutar el siguiente bundle:

```powershell
npm install @mui/material @mui/styled-engine-sc styled-components
```

Además de estos paquetes, MUI tiene su propia librería de **iconos**, los cuales se utilizan en diversos componentes como podréis ver más adelante.

Para incluir dicho conjunto de iconos ejecutaremos el siguiente comando:

```powershell
npm install @mui/icons-material
```

**Implementando componentes de MUI en React**

---

Una vez tengamos implementadas las dependencias en nuestro proyecto con React podemos pasar a crear componentes en los cuales utilizaremos código de la galería **Components** de MUI.

En nuestro caso estamos trabajando con JS, por lo que siempre que recuperemos un **snippet** tendremos que tener activada la pestaña pertinente en el mismo:

![Captura de Pantalla 2022-10-11 a las 15.01.39.png](MUI%20ReactJS%20c447cdcc507e4ba38018bc11a00ea24b/Captura_de_Pantalla_2022-10-11_a_las_15.01.39.png)

![Captura de Pantalla 2022-10-11 a las 15.01.54.png](MUI%20ReactJS%20c447cdcc507e4ba38018bc11a00ea24b/Captura_de_Pantalla_2022-10-11_a_las_15.01.54.png)

Vamos a probar a añadir componentes a nuestro proyecto.

**App Bar with responsive menu**

---

[App bar React component - Material UI](https://mui.com/material-ui/react-app-bar/)

En nuestra carpeta **components** vamos a crear un componente Navigator en el cual insertaremos el código que nos facilita la libreria con el mismo nombre:

```jsx
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
```

Si leemos detenidamente podemos ver como importa todas las dependencias y partes de las librerías necesaria para completar el componente, ya sea la tipografía, los iconos y las diferentes secciones que lo componen.

En nuestro caso podemos personalizarla para cambiar el texto, para cambiar los diferentes links y, además, que respondan siendo links de react-router-dom. Estos componentes pueden ser personalizados de cualquier forma, teniendo como traba el theming (el cual se puede modificar de una forma más avanzada).

Veamos como quedaría:

```jsx
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ComputerIcon from "@mui/icons-material/Computer";
import { Link } from "react-router-dom";

const pages = ["Gallery", "Ingredients", "Cart"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xxl">
        <Toolbar disableGutters>
          <ComputerIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MATERIAL UI
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link to={page.toLowerCase()}>
                    <Typography textAlign="center">{page}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <ComputerIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            MATERIAL UI
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                <Link to={page.toLowerCase()}>{page}</Link>
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Memy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
```

De esta forma tendremos una barra de navegación completamente responsive y con menús desplegables (que forman parte aislada de los componentes que podemos utilizar en esta librería:

![Captura de Pantalla 2022-10-11 a las 17.19.49.png](MUI%20ReactJS%20c447cdcc507e4ba38018bc11a00ea24b/Captura_de_Pantalla_2022-10-11_a_las_17.19.49.png)

**Image list**

---

[Image list React component - Material UI](https://mui.com/material-ui/react-image-list/)

Como primera página de nuestra aplicación, vamos a probar con una galería de imágenes responsive con un grid pre-fabricado. Para ello recuperaremos el código del componente llamado **Quilted image list** y lo aplicaremos en nuestro nuevo componente llamado, por ejemplo, Gallery, el cual se renderizará en cuanto accedamos al ruta gracias al React-Router-Dom:

```jsx
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function QuiltedImageList() {
  return (
    <ImageList
      
      variant="quilted"
      cols={4}
      rowHeight={121}
    >
      {itemData.map((item) => (
        <ImageListItem key={item.img} cols={item.cols || 1} rows={item.rows || 1}>
          <img
            {...srcset(item.img, 121, item.rows, item.cols)}
            alt={item.title}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
    author: '@arwinneil',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
    rows: 2,
    cols: 2,
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  },
  {
    img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
    title: 'Bike',
    cols: 2,
  },
];
```

Lo único que hemos customizado en este caso ha sido el width por defecto que tenía un valor absoluto en pixeles y lo hemos dejado adaptarse al ancho de la pantalla, causando una colocación adaptativa de los elementos y generando una galería en la que los elementos se reparten de manera personalizada entre filas y columnas.

![Captura de Pantalla 2022-10-19 a las 9.41.02.png](MUI%20ReactJS%20c447cdcc507e4ba38018bc11a00ea24b/Captura_de_Pantalla_2022-10-19_a_las_9.41.02.png)

Según las instrucciones de este componente, tendremos que cumplimentar un array de imágenes ya dado con el origen del fichero de la imagen y el espacio que va a ocupar cada una de ellas. Este componente se encargará una vez implementados todos los datos de realizar la colocación de los elementos sin necesidad de definir un “grid” por defecto, con la posibilidad de personalizar la forma en la que se posicionan cada uno de ellos.

**Table**

---

[React Table component - Material UI](https://mui.com/material-ui/react-table/)

El componente Table se encargará de hacer un display de datos en forma de tabla el cual hace uso del componente DataGrid para disponer los datos de una forma ordenada y estructurada en filas y columnas. En este ejemplo vamos a usar la básica que nos indica la documentación sin ningún tipo de personalización. 

Este componente DataGrid no puede ser personalizado con una cuenta básica o de invitado de MUI, por lo que hay 2 o 3 funcionalidades que no podremos alterar tanto como en otros componentes.

En este caso haremos un componente página llamado **Ingredients** donde haremos un display de una serie de ingredientes y sus características:

```jsx
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function Ingredients() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Dessert (100g serving)</TableCell>
            <TableCell align="right">Calories</TableCell>
            <TableCell align="right">Fat&nbsp;(g)</TableCell>
            <TableCell align="right">Carbs&nbsp;(g)</TableCell>
            <TableCell align="right">Protein&nbsp;(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
```

Como se puede ver en el código, la función recoge el set de columnas y elementos a disponer en la tabla y mediante los TableCell y TableRow iremos colocando cada uno de los elementos en su correspondiente posición. 

Además de esto, estas tablas son responsive siempre y cuando quepan en pantalla el número de columnas, intentando ocupar el máximo de espacio en pantalla disponible rellenándola con las columnas de la tabla.

![Captura de Pantalla 2022-10-19 a las 9.49.13.png](MUI%20ReactJS%20c447cdcc507e4ba38018bc11a00ea24b/Captura_de_Pantalla_2022-10-19_a_las_9.49.13.png)

**Transition Group**

---

[React Transition component - Material UI](https://mui.com/material-ui/transitions/)

En el apartado **Utils** encontraremos varias utilidades que implementar en nuestros componentes, entre ellas encontraremos animaciones y transiciones “suaves” al renderizar o eliminar elementos en nuestra aplicación.

Una de ellas es Transition Group, que aplica una transición al aparecer y desaparecer elementos en el navegador, y en la demostración del componente nos implementa una cesta de la compra en la cual podemos añadir elementos de un array y eliminarlos con un botón. Vamos a aplicar esto a nuestro componente página llamado **Cart**.

```jsx
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import { TransitionGroup } from "react-transition-group";

const FRUITS = [
  "🍏 Apple",
  "🍌 Banana",
  "🍍 Pineapple",
  "🥥 Coconut",
  "🍉 Watermelon",
];

function renderItem({ item, handleRemoveFruit }) {
  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          title="Delete"
          onClick={() => handleRemoveFruit(item)}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemText primary={item} />
    </ListItem>
  );
}

export default function Cart() {
  const [fruitsInBasket, setFruitsInBasket] = React.useState(
    FRUITS.slice(0, 3)
  );

  const handleAddFruit = () => {
    const nextHiddenItem = FRUITS.find((i) => !fruitsInBasket.includes(i));
    if (nextHiddenItem) {
      setFruitsInBasket((prev) => [nextHiddenItem, ...prev]);
    }
  };

  const handleRemoveFruit = (item) => {
    setFruitsInBasket((prev) => [...prev.filter((i) => i !== item)]);
  };

  const addFruitButton = (
    <Button
      variant="contained"
      disabled={fruitsInBasket.length >= FRUITS.length}
      onClick={handleAddFruit}
      sx={{ mt: 4 }}
    >
      Add fruit to basket
    </Button>
  );

  return (
    <div>
      {addFruitButton}
      <Box sx={{ mt: 1 }}>
        <List>
          <TransitionGroup>
            {fruitsInBasket.map((item) => (
              <Collapse key={item}>
                {renderItem({ item, handleRemoveFruit })}
              </Collapse>
            ))}
          </TransitionGroup>
        </List>
      </Box>
    </div>
  );
}
```

Con este componente, y viendo al array que accede para dar la funcionalidad propuesta por la demostración, podremos crear una especie de carrito de la compra o TODO list dinámico con transiciones en los elementos.

![Oct-19-2022 15-20-11.gif](MUI%20ReactJS%20c447cdcc507e4ba38018bc11a00ea24b/Oct-19-2022_15-20-11.gif)

**Card**

---

[React Card component - Material UI](https://mui.com/material-ui/react-card/)

Por último vamos a probar el componente **Card** que nos permitirá tener una carta interactiva con contenido tanto de tipo texto, imagen o linkear a más información o enlaces externos.

En la documentación de este componente tendremos diferentes ejemplos con diferentes disposiciones de contenido, pero en este ejemplo implementaremos la carta principal con los estilos y configuración por defecto dentro de un componente llamado **Card.**

```jsx
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Card() {
  return (
    <Card sx={{ maxWidth: 345, mt: 2 }}>
      <CardMedia
        component="img"
        height="140"
        image="https://picsum.photos/536/354"
        alt="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
```

Este componente esta compuesto por tipografía y acciones con botones que lanzaran la funcionalidad que queramos. En otros ejemplos tendremos diferentes mini-componentes en estas cartas que nos mostrarán más contenido de la carta principal o lanzarán diferentes funciones.

![Captura de Pantalla 2022-10-19 a las 17.19.16.png](MUI%20ReactJS%20c447cdcc507e4ba38018bc11a00ea24b/Captura_de_Pantalla_2022-10-19_a_las_17.19.16.png)