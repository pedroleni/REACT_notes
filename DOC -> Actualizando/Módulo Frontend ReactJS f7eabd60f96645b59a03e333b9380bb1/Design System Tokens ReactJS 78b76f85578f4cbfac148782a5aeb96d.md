# Design System Tokens ReactJS

**Introducción 🧐**

---

Ultimamente en el mundo del desarrollo hemos venido experimentando cambios en la implementación de los estilos, desde una implementación muy acoplada que impedía la escalabilidad y la reutilización de los mismos hasta los famosos Design Systems que se han convertido en en una de las áreas principales del desarrollo web.

Pero hemos empezado a escuchar una serie de nuevos términos relacionados como, Principles, Guidelines, Atomic Design (un punto de unión entre e desarrollo de componentes web y los Design Systems), Dark Mode o Color Mode y uno de los más importantes Design Tokens.

Después de todo el proceso en el que habéis aprendido a generar un Design System y las ventajas que tiene desde el punto de vista de los UX´s vamos a ver porqué es imprescindible para los desarrolladores en la actualidad.

**¿Qué son los Tokens? 🔲**

---

Podemos decir que los Tokens son una metodología que se encarga del manejo de variables en un Design System. Esta metodología nos permite aplicar a una escala menor un estilado en una hoja de estilos dentro de un proyecto web.

Lo primero que tenemos que valorar de los Tokens nos permite eliminar las duplicidades en el código y abstraer los estilos. Dentro de la maquetación vemos lo complicado que es escalar los estilos entre diferentes aplicaciones y mantenerlos. Además vemos como han ido de la mano este termino con la tecnología ya que el uso de Tokens no obliga a enfocarnos en web components sino que nos permite trabajar con ello en diversas arquitecturas de CSS, desde preprocesadores, CSS Modules CSS-inJS o Styled Components.

En definitiva los Design Tokens son en parte una solución para escalar y mantener el CSS, pues ninguna de las metodologías anteriores es explícita sobre el uso y mantenimiento de las variables.

**Custom Properties y variables en CSS**

> En CSS  podemos hacer uso de variables gracias a las Custom Properties sin necesidad de recurrir al uso de preprocesadores. Los Design Tokens no son otra tecnología para integrar variables en CSS. Por el contrario, nos ayudan a que aprovechemos mejor esta característica, independiente de su implementación.
> 

```css
:root {
  --background-color: coral; // Variable
}

<main class="container"></main> // Elemento HTML5

.container {
	background-color: var(--background-color); // Uso de la variable
}
```

**Usos de los Tokens 🤘🏽**

---

La realidad es que no existe una manera o regla específica sobre cómo debemos trabajar con los Tokens, sino que se aplica el sentido común y acuerdos entre el equipo de desarrolladores. Sin embargo, podemos empezar a usar implementaciones sencillas para resolver problemas muy específicos y a medida que avanzamos o se tengan más necesidades veremos su aprovechamos las mismas o debemos implementar otras.

Por ello vamos a hacer un repaso de conceptos básicos para llegar a algunos más complejos o con mayor refinamiento por tiempos o estructuras.

**Choices - Elecciones 🤷🏽‍♂️**

---

El concepto más esencial a la hora de usar los Tokens es la limitación de opciones. Establecer un número ilimitado de opciones en ocasiones produce parálisis y procesos de abstracción que al desarrollador le cuesta asimilar y llevar a cabo.

Si pensamos en el diseño de interfaces de usuario, cuando tenemos muchas opciones de colors, spacing, fonts, etc.  Puede llegar a aturdir o hacer que los desarrollos sean más lentos y por ello los Tokens deben limitar estas opciones para que a partir de ellas podamos construir todo nuestro desing system sin pensar mucho en estas unidades mínimas, pues nuestras opciones van a estar limitadas.

**Limitación de Breackpoints:** Nos ayuda a establecer los puntos de ruptura en base al tamaño de ventana.

```json
{
 "breakpoints": {
   "mobile": 576,
   "tablet": 768,
   "laptop": 992
}
```

**Limitación de profundidad:** No ayuda a establecer la posición dentro de la profundidad del elemento y que queden superpuestos en base a esta.

```json
{
 "zindex": {
   "base": 100,
   "modal": 200,
   "spinner": 300
}
```

**Limitación de colors:** Usamos una gama de colores fija que nos permite abstraernos de lógicas absurdas y repetición de código.

```json
{
 "colors": {
   "moon": "#999999",
   "snow": "#F4F4F4",
   "coal": "#333333"
}
```

**Limitación de fuente:**  Establecemos una fuente única en nuestro proyecto y es transversal a lo largo de nuestra aplicación.

```json
{
  "font": {
    "family": {
      "serif": "Georgia, 'Times New Roman', serif",
      "sans": "Quicksand, Arial, 'sans-serif'",
      "mono": "'Roboto Mono', Consolas, monospace"
    },
    "lineHeight": {
      "none": 1,
      "tight": 1.25,
      "normal": 1.5,
      "loose": 2
    },
    "weight": {
      "thin": 200,
      "light": 300,
      "normal": 400,
      "bold": 700,
      "extrabold": 800,
      "black": 900
    }
  }
}
```

**Decisions - Decisiones 🙇🏽‍♂️**

---

Una vez hemos tomado alguna de nuestras elecciones, podemos empezar a decidir el uso de las mismas. Partimos del mismo punto que con las choices, solo que en esta ocasión debemos tener en cuenta su uso, aplicando nuestra decisión en base al contexto de uso. Es decir un elemento botón se comportará de un modo u otro en base a su contexto por lo que debemos tomar una decisión en base a las posibilidades definidas en las choices pero al limitar los colores, fuentes y tamaños, podemos decidir cuáles de estas elecciones estarán disponibles en nuestros componentes, layouts o utilidades.

**Decisión de la fuente**: Nuestro elemento va estar definido en base a las elecciones que hemos ido escogiendo → De tal modo la decisión sobre title esta basado en ellas.

```json
{
    "title": {
      "fontFamily": choices.font.family.sans,
      "fontWeight": choices.font.weight.normal,
      "fontSize": {
        "1": choices.size.font["3xl"],
        "2": choices.size.font["2xl"],
        "3": choices.size.font.lg,
        "4": choices.size.font.xs
      },
      "color": choices.color.base.gray[900]
    }
}
```

**Decision de botones**: Nuestro elemento estará acotado en base a las elecciones que definimos → Por ello la decisión de los botones se fundamentarán en las choices.

```json
{
    "button": {
		 "borderRadius": choices.size.borderRadius.md,
		 "fontFamily": choices.font.family.sans,
	   "fontWeight": choices.font.weight.normal,
     "fontSize": {
        "sm": choices.size.font.xs,
        "lg": choices.size.font.lg
      },
      "padding": {
		    "sm": `${choices.size.spacing[4]} ${choices.size.spacing[6]}`,
        "lg": `${choices.size.spacing[8]} ${choices.size.spacing[10]}`
      }
      "success": {
				"color": choices.color.base.green[900],
			},
			"warning": {
				"color": choices.color.base.yellow[900],
			},
			"error": {
				"color": choices.color.base.red[900],
			}
    }
}
```

Una vez que lo hemos decidido todos los elementos relacionados con los títulos o botones esta metodología nos permite cambiar colores o tamaños con solo apuntar a nuestras decisiones.

**Platforms - Dispositivos 📲**

---

Cuando pensamos en aplicaciones web habitualmente tenemos que tener en cuenta varios dispositivos, gracias a nuestros Tokens podemos abstraer ciertas variables [choices], no en todos los casos, y ayudar a definir las decisions para facilitar nuestro trabajo en las diferentes plataformas.

Si volvemos a nuestro ejemplo de botones, supongamos que necesitamos crear un botón en cada una de las plataformas. Lo normal sería especificar qué choices usar.  El problema vendría a la hora de actualizar nuestro contenido puesto que debemos hacerlo en cada una de ellas. En cambio, si lo definimos como una decision, solo lo aplicamos una única vez.

```json
{
    "button": {
		 "borderRadius": choices.size.borderRadius.md,
		 "fontFamily": choices.font.family.sans,
	   "fontWeight": choices.font.weight.normal,
     "fontSize": {
        "sm": choices.size.font.xs,
        "lg": choices.size.font.lg
      },
      "padding": {
		    "sm": `${choices.size.spacing[4]} ${choices.size.spacing[6]}`,
        "lg": `${choices.size.spacing[8]} ${choices.size.spacing[10]}`
      }
      "success": {
				"color": choices.color.base.green[900],
			},
			"warning": {
				"color": choices.color.base.yellow[900],
			},
			"error": {
				"color": choices.color.base.red[900],
			}
    }
}
```

Si cambiamos el borderRadius de nuestra aplicación será transversal a todas las plataformas en las que hagamos uso de las mismas.

El problema viene dado a la hora de trabajar con diferentes unidades de medida. En una web al uso podemos trabajar con em, rem, vh… pero si realizamos una aplicación mobile con React Native solo podemos hacer uso de pixeles. Existen librerías que nos permiten generar Tokens a partir de un fichero de configuración. De esta manera, podemos generar una versión de nuestros Choices con medidas relativas como lo son rem y otra versión con medidas absolutas como px.

[https://github.com/salesforce-ux/theo](https://github.com/salesforce-ux/theo)

[Style Dictionary - Style once, use everywhere. A build system for creating cross-platform styles.](https://amzn.github.io/style-dictionary/#/)

**Tema 🧮**

---

El uso de Tokens ayuda a afrontar esta tarea, pues, debido a que ya tenemos toda una estructura de tokens, lo único que debemos hacer es duplicar esta estructura reemplazando los valores para el nuevo tema.

**¿Cómo empezamos? 🌟**

---

Mi recomendación es tomar como inspiración la implementación de algún sistema de diseño que sea similar a nuestras necesidades. Sin embargo, es importante evitar complicar la implementación. Por ello vamos a tomar como referencia el Design System de Telefónica para mostrar las opciones de implementación.

[Mística - Digital Design System](https://brandfactory.telefonica.com/d/iSp7b1DkYygv/n-a#/get-started/what-is-mistica)

**Design Systems CSS 🖍**

---

Las limitaciones de uso vía CSS son numerosas pero una breve introducción nos ayuda a entender la implementación en base a los conceptos tratados con anterioridad.

[Desing System CSS3](Design%20System%20Tokens%20ReactJS%2078b76f85578f4cbfac148782a5aeb96d/Desing%20System%20CSS3%20698340bda70e48ba984c2e7d17d511a1.md)

**Design Systems Styled-Components 💅🏽**

---

Para los desarrolladores el uso de librerías o frameworks son aceleradores a la hora de crear cierta funcionalidad propuesta pero según ha ido pasando el tiempo también ha salpicado los procesos de adaptación de un Design System.

[Desing System Styled-Components](Design%20System%20Tokens%20ReactJS%2078b76f85578f4cbfac148782a5aeb96d/Desing%20System%20Styled-Components%20a88b2c54110f470c8103fcb1913c1e70.md)