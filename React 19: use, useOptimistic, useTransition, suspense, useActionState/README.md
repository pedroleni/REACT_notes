# React 19 y el uso de `use()` con `Suspense`

## 🚀 Novedades de React 19

React 19 introduce varias mejoras importantes relacionadas con la asincronía, el manejo de estado optimista y el uso de `Suspense`.

### ✨ Nuevos hooks

- `use()` — permite leer directamente una promesa dentro del render y suspender la ejecución hasta que se resuelva.
- `useActionState()` — diseñado para manejar formularios y acciones asíncronas con estado.
- `useOptimistic()` — facilita el manejo de estados optimistas.
- `useTransition()` — mejora el control de actualizaciones concurrentes y permite diferenciar entre acciones urgentes y no urgentes.

---

## 🧩 ¿Qué es `use()`?

El nuevo hook `use()` permite que un componente suspenda mientras espera que una promesa se resuelva.

```jsx
import { use } from "react";

function User({ promise }) {
  const user = use(promise); // suspende el render hasta que la promesa se resuelva
  return <h1>{user.name}</h1>;
}

<Suspense fallback={<Loading />}>
  <User promise={fetchUser()} />
</Suspense>;
```

# 🧩 React 19 – `useActionState()`

El hook `useActionState()` permite manejar el estado derivado de una acción asincrónica, como el envío de un formulario, sin tener que usar múltiples `useState`.

Es una de las novedades más potentes de React 19 para simplificar lógica relacionada con formularios y acciones.

---

## 📌 ¿Qué es `useActionState()`?

`useActionState()` gestiona:

- El **estado previo y nuevo** de una acción.
- El **estado de carga** (con `isPending`).
- Una **función que puedes usar como action de formulario**.

---

## ⚙️ Sintaxis

```jsx
const [state, formAction, isPending] = useActionState(actionFn, initialState, permalink?)
```

# 🪄 React 19 – `useOptimistic()`

El hook `useOptimistic()` permite aplicar actualizaciones optimistas a la UI, mostrando cambios inmediatamente antes de que finalice una acción asíncrona (por ejemplo, una llamada a la API), y revertir los cambios si hay un fallo.

---

## 📌 ¿Qué es?

- Proporciona una **UI sensible y rápida**, mostrando el resultado esperado inmediatamente.
- Si la operación falla, React **revierte automáticamente** al estado original sin código manual de rollback :contentReference[oaicite:1]{index=1}.
- Ideal para formularios, likes, comentarios, etcétera.

---

## ⚙️ Sintaxis

```js
const [optimisticState, applyOptimistic] = useOptimistic(
  baseState,
  (currentState, newValue) => {
    // merge lógico
    return updatedState;
  }
);
```

# ⏳ React 19 – `useTransition()`

El hook `useTransition()` permite marcar actualizaciones de estado como transiciones no bloqueantes, mejorando la fluidez de la UI y evitando bloqueos durante operaciones caras o asincrónicas.

---

## 📦 ¿Qué hace?

- Devuelve `[isPending, startTransition]`.
  - `isPending`: booleano que indica si una transición está en curso.
  - `startTransition(fn)`: envuelve una función para que sus `setState` sean no urgentes :contentReference[oaicite:1]{index=1}.
- En React 19, puedes pasar funciones `async` directamente a `startTransition`, simplificando su uso :contentReference[oaicite:2]{index=2}.

---

## ⚙️ Sintaxis básica

```js
import { useTransition } from "react";

const [isPending, startTransition] = useTransition();
```
