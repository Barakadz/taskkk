import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const Contact = () => {
    // Define Yup validation schema
    const validationSchema = Yup.object().shape({
        problem: Yup.string().required('Le problème est requis'),
        description: Yup.string().required('La description est requise'),
    });

    // Handle form submission
    const handleSubmit = (values, { resetForm }) => {
        // Make API call here (replace with your actual API endpoint)
        axios.post('your-api-endpoint', values)
            .then(response => {
                // Handle success, e.g., show a success message
                console.log('Data submitted:', response.data);
                resetForm();
            })
            .catch(error => {
                // Handle error, e.g., show an error message
                console.error('Error submitting data:', error);
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
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default Contact;
