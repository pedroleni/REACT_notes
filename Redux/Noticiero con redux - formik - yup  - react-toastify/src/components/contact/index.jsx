import { useFormik } from "formik";
import * as Yup from "yup";
import { Alert } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { sendMessage } from "../../store/utils/thunks";

import { toast } from "react-toastify";

const Contact = () => {
  const dispatch = useDispatch();
  /**
   * Formik es una librería que nos ayuda a manejar formularios en React de manera sencilla.
   * Permite manejar el estado del formulario, validaciones y envío de datos.
   */
  const formik = useFormik({
    initialValues: { email: "", firstname: "", lastname: "", message: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Sorry, email is required")
        .email("This email is invalid"),
      firstname: Yup.string().required("Sorry, firstname is required"),
      lastname: Yup.string().required("Sorry, lastname is required"),
      message: Yup.string()
        .required("Sorry,a message is required")
        .max(500, "Sorry, the message is to long"),
    }),

    /**
     * onsubmit es una función que se ejecuta cuando el formulario se envía.
     * En este caso, se utiliza para enviar un mensaje a través de una acción de Redux
     * y mostrar un mensaje de éxito o error al usuario.
     * @param {*} values
     * @param {*} param1
     */
    onSubmit: (values, { resetForm }) => {
      dispatch(sendMessage(values))
        .unwrap()
        .then((response) => {
          resetForm();
          toast.success("Thank you, we will contact you back", {
            position: "bottom-right",
          });
        })
        .catch((err) => {
          toast.error("Sorry, try again later", {
            position: "bottom-right",
          });
        });
    },
  });

  return (
    <>
      <h1>Contact us</h1>
      <form className="mt-3" onSubmit={formik.handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            placeholder="email@example.com"
            {...formik.getFieldProps("email")}
          />
          {formik.errors.email && formik.touched.email ? (
            <Alert variant="danger">{formik.errors.email}</Alert>
          ) : null}
        </div>
        <div className="form-group">
          <label htmlFor="firstname">First name</label>
          <input
            type="text"
            className="form-control"
            name="firstname"
            placeholder="Enter your name"
            {...formik.getFieldProps("firstname")}
          />
          {formik.errors.firstname && formik.touched.firstname ? (
            <Alert variant="danger">{formik.errors.firstname}</Alert>
          ) : null}
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last name</label>
          <input
            type="text"
            className="form-control"
            name="lastname"
            placeholder="Enter your lastname"
            {...formik.getFieldProps("lastname")}
          />
          {formik.errors.lastname && formik.touched.lastname ? (
            <Alert variant="danger">{formik.errors.lastname}</Alert>
          ) : null}
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            className="form-control"
            name="message"
            rows={3}
            {...formik.getFieldProps("message")}
          />
          {formik.errors.message && formik.touched.message ? (
            <Alert variant="danger">{formik.errors.message}</Alert>
          ) : null}
        </div>

        <button type="submit" className="btn btn-primary mt-2">
          Send message
        </button>
      </form>
    </>
  );
};

export default Contact;
