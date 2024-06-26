import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Evaluation = () => {
  const initialValues = {
    rating: '',
    commentaires: '',
    suggestions: ''
  };

  const validationSchema = Yup.object().shape({
    rating: Yup.string().required('La note de l\'application est requise'),
    commentaires: Yup.string().required('Les commentaires sont requis'),
    suggestions: Yup.string().required('il faut remplir la suggestion'),
  });

  const handleSubmit = (values, { resetForm }) => {
    // Here you can handle the form submission logic, e.g., send data to an API
    console.log(values); // For demonstration, logging form values to console
    resetForm(); // Reset the form after submission
  };

  return (
    <>
      <div className="p-4">
        <h3 className="text-center">Evaluation</h3>
        
 
            <h5 className=" projet-step">Merci de remplir ce formulaire, votre avis nous intéresse</h5>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ errors, touched }) => (
                <Form>
                  <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Note de l'application :</label>
                    <Field as="select" id="rating" name="rating" className={`form-select ${errors.rating && touched.rating ? 'is-invalid' : ''}`} aria-label="Note de l'application" required>
                      <option value="">Sélectionnez une note</option>
                      <option value="1">1 - Très mauvais</option>
                      <option value="2">2 - Mauvais</option>
                      <option value="3">3 - Moyen</option>
                      <option value="4">4 - Bon</option>
                      <option value="5">5 - Excellent</option>
                    </Field>
                    <ErrorMessage name="rating" component="div" className="invalid-feedback" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="commentaires" className="form-label">Commentaires :</label>
                    <Field as="textarea" id="commentaires" name="commentaires" className={`form-control ${errors.commentaires && touched.commentaires ? 'is-invalid' : ''}`} rows="4" required />
                    <ErrorMessage name="commentaires" component="div" className="invalid-feedback" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="suggestions" className="form-label">Suggestions :</label>
                    <Field as="textarea" id="suggestions" name="suggestions" className="form-control" rows="4" />
                  </div>
                  <button type="submit" className="btn btn-primary">Envoyer</button>
                </Form>
              )}
            </Formik>
          </div>
 
    </>
  );
};

export default Evaluation;
