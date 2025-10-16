# Eslint & Prettier ReactJS

**Introducción**

---

Todo proyecto que se precie debe tener una configuración previa en la que indique al resto de los integrantes del equipo de desarrollo cómo deben indentar el código o beutificación de este. Por ello vamos a construir un Boilerplate.

**Proyecto Vite**

---

El primer paso como no podía ser otro será crear un proyecto con Vite, tal y como hemos ido haciendo hasta ahora.

```bash
npm create vite@latest
```

**Instalación de dependencias**

---

Vamos a instalar una serie de paquetes en nuestro proyecto que nos ayude en nuestro día a día como desarrolladores. Todas ellas son dependencias de desarrollo es decir `dev-dependencies`.

```bash
npm i -D eslint eslint-config-prettier eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-react eslint-plugin-simple-import-sort pre-commit prettier
```

![Captura de Pantalla 2022-10-13 a las 11.22.01.png](Eslint%20&%20Prettier%20ReactJS%2064bb9bad9974491cb6715418946a5328/Captura_de_Pantalla_2022-10-13_a_las_11.22.01.png)

**Modificación package.json**

---

En nuestro fichero encargado de gestionar las dependencias tenemos que añadir los scripts de ejecución y además indicar que queremos tener antes del commit lanzar el lint.

```json
{
  "name": "react-eslint-prettier",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview",
    "lint:fix": "eslint ./src --ext .jsx,.js, --quiet --fix --ignore-path ./.gitignore",
    "lint:format": "prettier  --loglevel warn --write \"./**/*.{js,jsx,css,md,json}\" ",
    "lint": "npm run lint:format && npm run lint:fix "
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.17",
    "@types/react-dom": "^18.0.6",
    "@vitejs/plugin-react": "^2.1.0",
    "eslint": "^8.8.0",
    "eslint-config-prettier": "^8.3.0",
    "eslint-plugin-import": "^2.25.4",
    "eslint-plugin-jsx-a11y": "^6.5.1",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-react": "^7.28.0",
    "eslint-plugin-simple-import-sort": "^7.0.0",
    "pre-commit": "^1.2.2",
    "prettier": "^2.5.1",
    "vite": "^3.1.0"
  },
  "pre-commit": "lint",
  "license": "MIT"
}
```

**eslintrc**

---

Es una herramienta de software que revisa y "observa" tu código en busca de errores que puedan afectar tu código. Algunos "linteres" incluso pueden darte sugerencias de como arreglar el error o incluso arreglarlo ellos mismos.

En nuestro caso a la altura de nuestra raíz generamos un fichero `.eslintrc.js` y le damos el formato que queramos, en nuestro caso.

```jsx
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx'],
      },
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended', // Make sure this is always the last element in the array.
  ],
  plugins: ['simple-import-sort', 'prettier'],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react/prop-types': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
  },
};
```

Y después definimos en un fichero qué carpetas o ficheros queremos ignorar y no pasar nuestro lintado. Para ello creamos un `.eslintignore`

```bash
node_modules
.DS_Store
dist
dist-ssr
*.local
node_modules/*
```

**prettierrc**

---

Prettier es un formateador automático de código. Es decir al trabajar en un proyecto de código que incluya a más de una persona estas discusiones sobre como debería escribirse o no el código (guía de estilo) pueden mermar la productividad del equipo enfrascándose en nimiedades que pueden tornarse bastante molestas, por ejemplo, al revisar un pull-request. Las diferencias de estilo se mostrarán como cambios que en efecto no son parte del real desarrollo que se intenta lograr.

Por ello vamos a crear un fichero `.prettierrc.js`

```bash
module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 90,
  tabWidth: 2,
  endOfLine: 'auto',
};

// {
//   "arrowParens": "always",
//   "bracketSpacing": true,
//   "embeddedLanguageFormatting": "auto",
//   "htmlWhitespaceSensitivity": "css",
//   "insertPragma": false,
//   "jsxBracketSameLine": false,
//   "jsxSingleQuote": false,
//   "proseWrap": "preserve",
//   "quoteProps": "as-needed",
//   "requirePragma": false,
//   "semi": true,
//   "singleQuote": false,
//   "tabWidth": 2,
//   "trailingComma": "es5",
//   "useTabs": false,
//   "vueIndentScriptAndStyle": false,
//   "printWidth": 100
// }
```

También vamos a crear un fichero indicando las carpetas o documentos que queremos ignorar. `.prettierignore`

```bash
node_modules
.DS_Store
dist
dist-ssr
*.local
node_modules/*
```

**Puesta a punto**

---

![prettier-eslint.gif](Eslint%20&%20Prettier%20ReactJS%2064bb9bad9974491cb6715418946a5328/prettier-eslint.gif)

> Recordad eliminar el type: module del package.json
>