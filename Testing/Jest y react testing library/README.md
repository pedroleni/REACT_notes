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
