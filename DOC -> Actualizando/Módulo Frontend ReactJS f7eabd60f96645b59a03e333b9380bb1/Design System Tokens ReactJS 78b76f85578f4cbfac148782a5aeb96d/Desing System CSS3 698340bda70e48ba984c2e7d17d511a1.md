# Desing System CSS3

**Introducción 🧐**

---

CSS son las siglas en inglés para «hojas de estilo en cascada» (Cascading Style Sheets). Básicamente, es un lenguaje que maneja el diseño y presentación de las páginas web, es decir, cómo lucen cuando un usuario las visita. Funciona junto con el lenguaje HTML que se encarga del contenido básico de las páginas.

Se les denomina hojas de estilo «en cascada» porque puedes tener varias hojas y una de ellas con las propiedades heredadas (o «en cascada») de otras.

**Creación de Choices 🤷🏽‍♂️**

---

Nos vamos a basar en el Design System de [Telefónica](https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/get-started/what-is-mistica) para realizar algunos ejemplos en la implementación de este.

![colours.gif](Desing%20System%20CSS3%20698340bda70e48ba984c2e7d17d511a1/colours.gif)

Si observamos dentro de los fundamentals tenemos todas las choices para generar nuestras variables o tokens dentro de nuestro proyecto. Por ello vamos a  ello:

```css
:root {
  --appBarBackground: #FFFFFF;
  --background: #FFFFFF;
  --backgroundAlternative: #F6F6F6;
  --backgroundBrand: #019DF4;
  --backgroundContainer: #FFFFFF;
  --backgroundFeedbackBottom: #019DF4;
  --backgroundOverlay: rgba(49,50,53, 0.6);
	...
}
```

Lo importante del naming es respetarlo según el Design System ya que pueden agrupar varias marcas y simplemente cambiando el valor de la variable tendremos nuestros elementos con la visualización deseada.

![changeTheme.gif](Desing%20System%20CSS3%20698340bda70e48ba984c2e7d17d511a1/changeTheme.gif)

**Creación de Decisions 🙇🏽‍♂️**

---

Una vez hemos realizado nuestras decisiones debemos crear una serie de decisiones basadas en las elecciones anteriores. Si nos basamos en los botones podemos ver como usando algunas variables llegamos a cubrir los colores.

```css
<button class="button">Primary</button>

:root {
  --backgroundFeedbackBottom: #019df4;
  --textButtonPrimary: #ffffff;
}

.button {
  background-color: var(--backgroundFeedbackBottom);
  border: 1.5px solid transparent;
  border-radius: 4px;
  box-sizing: border-box;
  color: var(--textButtonPrimary);
  height: 35px;
  min-width: 136px;
  overflow: hidden;
}
```

![Captura de Pantalla 2022-11-12 a las 20.18.37.png](Desing%20System%20CSS3%20698340bda70e48ba984c2e7d17d511a1/Captura_de_Pantalla_2022-11-12_a_las_20.18.37.png)

Si tenemos varios caso basados en nuestros botones podemos hacer uso de modificadores para los botones, es decir tomamos como base el botón y añadimos los estilos asociados a dicha variante.

```css
<button class="button">Primary</button>
<button class="button button--secondary">Secondary</button>

:root {
  --backgroundFeedbackBottom: #019df4;
  --backgroundSecondaryBottom: #ffffff;
  --textButtonPrimary: #ffffff;
  --textButtonSecondary: #019df4;
}

.button {
  background-color: var(--backgroundFeedbackBottom);
  border: 1.5px solid transparent;
  border-radius: 4px;
  box-sizing: border-box;
  color: var(--textButtonPrimary);
  height: 35px;
  min-width: 136px;
  overflow: hidden;
}

.button--secondary {
  background-color: var(--backgroundSecondaryBottom);
  border: 1.5px solid var(--backgroundFeedbackBottom);
  color: var(--textButtonSecondary);
}
```

![Captura de Pantalla 2022-11-12 a las 20.23.35.png](Desing%20System%20CSS3%20698340bda70e48ba984c2e7d17d511a1/Captura_de_Pantalla_2022-11-12_a_las_20.23.35.png)

**Platforms - Dispositivos 📲**

---

En el caso de cambios según dispositivos tenemos que ver las particularidades del navegador o si fuese una aplicación nativa pero por no ahondar en el tema y verlo con un ejemplo más claro, veremos que usando las medias queries para provocar los saltos entre dispositivos sería suficiente (siempre eligiendo mobile first o desktop first según su uso).

```css
@media screen and (min-width: 768px) {
  .button {
    height: 40px;
    min-width: 160px;
  }
}

@media screen and (min-width: 1024px) {
  .button {
    height: 45px;
    min-width: 180px;
  }
}
```

![medias.gif](Desing%20System%20CSS3%20698340bda70e48ba984c2e7d17d511a1/medias.gif)

Si nos fijamos el comportamiento del botón es el mismo pero cambian las medidas en base a los dispositivos asociados.

**Tema 🧮**

---

La definición de temas en CSS3 queda muy limitada y en ocasiones tenemos que hacer uso de Javascript para leer los Tokens que nos genera Figma en formato Json para incluirlos vía in-line a nuestro fichero html. Esto hace ganar en dinamismo pero añade complejidad y la visualización de los elementos no es inmediata puesto que depende de la carga de JS.

Por ello en ocasiones se opta por preprocesadores de CSS3 como SAAS o SCSS e incluso si nos apoyamos en alguna librería o Framework para el desarrollo podemos optar por alternativas como los Styled-Components.