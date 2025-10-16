# 🌀 Gifs App — Buscador de GIFs con Historial

**03-Gifs-App** es una aplicación web desarrollada con **React** y **Vite** que permite a los usuarios **buscar y visualizar GIFs animados** de forma rápida y sencilla.  
La aplicación utiliza **Axios** para conectarse a una API externa de GIFs y ofrece un **historial de búsqueda persistente**, lo que permite acceder fácilmente a búsquedas recientes sin tener que reescribirlas.

Este proyecto está enfocado en practicar conceptos modernos de **React**, como el manejo del estado, componentes funcionales, hooks personalizados y consumo de APIs.  
Además, integra un entorno de desarrollo optimizado con **Vite**, pruebas automáticas con **Vitest** y un flujo de trabajo limpio con **TypeScript** y **ESLint**.

---

## ✨ Funcionalidades Principales

- 🔍 **Búsqueda de GIFs** en tiempo real.
- 🧠 **Historial de búsqueda** que se mantiene entre sesiones.
- ⚡ **Interfaz moderna y reactiva** gracias a **Vite** y **React 19**.
- 📡 **Consumo de API externa** con **Axios**.
- 🧪 **Pruebas unitarias y de componentes** con **Vitest** y **Testing Library**.
- 🧹 **Linting y buenas prácticas** con **ESLint** y **TypeScript**.

---

## 🧱 Tecnologías Utilizadas

| Categoría    | Herramientas             |
| ------------ | ------------------------ |
| Framework    | React 19                 |
| Bundler      | Vite                     |
| HTTP Cliente | Axios                    |
| Lenguaje     | TypeScript               |
| Testing      | Vitest, Testing Library  |
| Linter       | ESLint                   |
| Empaquetado  | @vitejs/plugin-react-swc |

---

## ⚙️ Scripts Disponibles

Dentro del proyecto puedes ejecutar los siguientes comandos:

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Ejecuta las pruebas, compila TypeScript y genera la build de producción
npm run preview      # Previsualiza la aplicación compilada
npm run test         # Ejecuta los tests con Vitest
npm run test:ui      # Abre la interfaz de pruebas de Vitest
npm run lint         # Ejecuta ESLint para revisar el código
```

## 🧪 Pruebas

El proyecto incluye configuraciones para **Vitest** y **Testing Library**, permitiendo realizar pruebas unitarias y de componentes **React**.

Para ejecutar todas las pruebas:

```bash
npm run test

```

---

## 🧑‍💻 Objetivo del Proyecto

El propósito de esta aplicación es practicar el desarrollo con **React + Vite**, reforzando:

- La creación de componentes reutilizables.
- El uso de hooks personalizados.
- La comunicación con APIs externas.
- El manejo de estados y persistencia local.
- La integración de herramientas de testing y linting modernas.

---

## ⚙️ Configuración de React con Vite y ESLint

Esta plantilla proporciona una configuración mínima para trabajar con **React** en **Vite**, con **Hot Module Replacement (HMR)** y algunas reglas básicas de **ESLint**.

Actualmente hay dos plugins oficiales disponibles:

- [**@vitejs/plugin-react**](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)
  → utiliza **Babel** para el _Fast Refresh_.
- [**@vitejs/plugin-react-swc**](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc)
  → utiliza **SWC** para el _Fast Refresh_ (más rápido y moderno).

---

### 🔧 Ampliando la configuración de ESLint

Si estás desarrollando una aplicación para producción, se recomienda actualizar la configuración de ESLint para habilitar reglas de linting con reconocimiento de tipos de **TypeScript**:

```jsx
export default tseslint.config({
  extends: [
    // Sustituye ...tseslint.configs.recommended por esta versión
    ...tseslint.configs.recommendedTypeChecked,
    // Alternativamente, puedes usar esta para reglas más estrictas
    ...tseslint.configs.strictTypeChecked,
    // Opcionalmente, añade esta para reglas de estilo
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // otras opciones...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

También puedes instalar los plugins

[**eslint-plugin-react-x**](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) y

[**eslint-plugin-react-dom**](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom)

para incluir reglas específicas de **React**:

```jsx
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Añadir los plugins react-x y react-dom
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // otras reglas...
    // Activar las reglas recomendadas para TypeScript
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```
