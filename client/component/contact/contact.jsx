import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Contact = () => {
    const dispatch = useDispatch();
  const user = useSelector((state) => state.user);  
    // Define Yup validation schema
    const validationSchema = Yup.object().shape({
        problem: Yup.string().required('Le problème est requis'),
        description: Yup.string().required('La description est requise'),
    });

    // Handle form submission
    const handleSubmit = (values, { resetForm }) => {
       

    
    const apiUrl = 'https://task.groupe-hasnaoui.com/api/contact/add';
    const requestData = {
        problem:values.problem,
        description:values.description,
       mail:user.mail
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
 toast.success(`Nous essayons de résoudre le problème et nous vous contacterons une fois qu'il sera réglé. Merci pour votre compréhension.`)
 resetForm(initialValues); // Reset form fields

        })
      .catch(error => {
       });
  

    };

    return (
        <div className="p-4">
            <h3 className="text-center">Contact</h3>
            <h5 className="card-title projet-step">
                Merci de remplir ce formulaire ; la DSI est là pour vous aider.
            </h5>

            <Formik
                initialValues={{ problem: '', description: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div className="mb-3">
                            <label htmlFor="problem" className="form-label">
                                Problem : <b className="text-danger">*</b>
                            </label>
                            <Field
                                type="text"
                                name="problem"
                                id="problem"
                                className={`form-control problem-step ${
                                    touched.problem && errors.problem ? 'is-invalid' : ''
                                }`}
                            />
                            <div className="invalid-feedback">
                                {touched.problem && errors.problem}
                            </div>
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="description"
                                className="form-label"
                            >
                                Description :{' '}
                                <b className="text-danger">*</b>
                            </label>
                            <Field
                                as="textarea"
                                name="description"
                                id="description"
                                rows={10}
                                className={`form-control ${
                                    touched.description && errors.description
                                        ? 'is-invalid'
                                        : ''
                                }`}
                            />
                            <div className="invalid-feedback">
                                {touched.description && errors.description}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Envoyer
                        </button>        <ToastContainer />

                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Contact;
