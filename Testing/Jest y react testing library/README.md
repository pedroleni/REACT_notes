# 🧪 Proyecto de Testing con Jest y React Testing Library

Este proyecto tiene como objetivo demostrar cómo implementar pruebas en aplicaciones React utilizando **Jest** y **React Testing Library (RTL)**. Es ideal para aprender y aplicar pruebas unitarias y de integración en componentes React.

## 🧰 Tecnologías usadas

- **React**
- **Jest** – Framework de testing por defecto en proyectos de React (CRA).
- **React Testing Library (RTL)** – Librería centrada en pruebas basadas en la experiencia del usuario.

---

## ✅ Beneficios de usar Jest + RTL

### Jest

- Rápida ejecución de pruebas.
- Mocking integrado.
- Cobertura de código (`--coverage`).
- Soporte nativo en Create React App.
- Snapshot testing.

### React Testing Library

- Promueve pruebas centradas en el usuario.
- Interacción realista con el DOM (como el usuario lo haría).
- API simple y expresiva.
- Compatible con hooks, context, async components, etc.

---

## 🔍 Métodos comunes en React Testing Library

| Método               | Descripción                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| `render()`           | Renderiza un componente para probarlo.                                         |
| `screen.getByText()` | Busca un nodo por su texto visible.                                            |
| `screen.getByRole()` | Busca un elemento por su rol accesible.                                        |
| `fireEvent.click()`  | Simula un evento como `click`, `change`, etc.                                  |
| `waitFor()`          | Espera a que se cumpla una condición de forma asíncrona.                       |
| `userEvent`          | Simula interacciones de usuario más realistas (recomendado sobre `fireEvent`). |

---

## 🚀 Cómo ejecutar las pruebas

1. Instalar dependencias con `npm install`
2. Ejecutar todas las pruebas con `npm run test`
3. Ver la cobertura de código con `npm test -- --coverage`

---

## 📜 Scripts disponibles

En el archivo `package.json`, estos scripts están configurados:

- `npm run dev`: Inicia el servidor de desarrollo usando Vite
- `npm run build`: Genera una versión optimizada para producción
- `npm run preview`: Sirve localmente la versión construida
- `npm run test`: Ejecuta las pruebas usando Jest en modo observación (`--watchAll`)

> Asegúrate de tener instalados Vite, Jest y las dependencias necesarias.

---

## 🧠 Recomendaciones

- Escribe pruebas que reflejen cómo el usuario usará el componente
- Evita pruebas demasiado acopladas al DOM interno
- Usa `getByRole` siempre que sea posible por accesibilidad

---

## 📚 Recursos útiles

- [Documentación de Jest](https://jestjs.io/docs/getting-started)
- [Documentación de React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
