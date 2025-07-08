# ✅ Validaciones en React con Yup

[Yup](https://github.com/jquense/yup) es una librería de validación de esquemas para JavaScript. Es muy útil para validar formularios en React, especialmente junto con librerías como **Formik** o **React Hook Form**.

> 🎯 ¿Para qué sirve Yup?  
> Para definir reglas claras y reutilizables de validación de datos (como formularios), de forma declarativa.

---

## 🧱 Instalación

```bash
npm install yup
```

## ✍️ Ejemplo básico (React + React Hook Form + Yup)

```js
// Formulario.jsx
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// 1. Esquema de validación
const schema = yup.object().shape({
  nombre: yup.string().required("El nombre es obligatorio"),
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  edad: yup.number().positive().integer().required("Edad requerida"),
});

function Formulario() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("Datos validados:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nombre:</label>
        <input {...register("nombre")} />
        <p>{errors.nombre?.message}</p>
      </div>

      <div>
        <label>Email:</label>
        <input {...register("email")} />
        <p>{errors.email?.message}</p>
      </div>

      <div>
        <label>Edad:</label>
        <input type="number" {...register("edad")} />
        <p>{errors.edad?.message}</p>
      </div>

      <button type="submit">Enviar</button>
    </form>
  );
}

export default Formulario;
```

## 🛠️ Validaciones comunes con Yup

| Validación Yup                       | Descripción                    |
| ------------------------------------ | ------------------------------ |
| `yup.string().required()`            | Campo obligatorio              |
| `yup.string().email()`               | Email válido                   |
| `yup.string().min(6)`                | Mínimo de 6 caracteres         |
| `yup.string().matches(/regex/, msg)` | Validación con regex           |
| `yup.number().positive().integer()`  | Solo números enteros positivos |
| `yup.date().max(new Date())`         | Fecha no futura                |
| `yup.boolean().oneOf([true], msg)`   | Checkbox obligatorio           |

# 📝 Formularios en React con Formik

[Formik](https://formik.org/) es una librería para manejar formularios en React de manera más limpia, organizada y escalable. Reduce el código repetitivo y facilita la validación, el manejo de errores y el envío de formularios.

---

## 🚀 ¿Por qué usar Formik?

✅ Maneja el estado del formulario automáticamente  
✅ Validación fácil (con o sin Yup)  
✅ Soporte para errores y mensajes  
✅ Limpio, legible y declarativo

---

## 📦 Instalación

```bash
npm install formik
# opcional (para validación con Yup)
npm install yup

```

```js
// Formulario.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

function Formulario() {
  return (
    <Formik
      initialValues={{ nombre: "", email: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.nombre) errors.nombre = "Requerido";
        if (!values.email) {
          errors.email = "Requerido";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = "Email inválido";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        console.log("Datos enviados:", values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label>Nombre:</label>
            <Field type="text" name="nombre" />
            <ErrorMessage name="nombre" component="p" />
          </div>

          <div>
            <label>Email:</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="p" />
          </div>

          <button type="submit" disabled={isSubmitting}>
            Enviar
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default Formulario;
```

## 🧠 Componentes principales de Formik

| Componente     | Descripción                               |
| -------------- | ----------------------------------------- |
| `Formik`       | Componente raíz que controla todo         |
| `Form`         | Reemplaza a `<form>` estándar             |
| `Field`        | Input controlado automáticamente          |
| `ErrorMessage` | Muestra errores específicos de cada campo |
| `useFormik`    | Hook si preferís una solución más manual  |
