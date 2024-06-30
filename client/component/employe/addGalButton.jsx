import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoProjectRoadmap } from "react-icons/go";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const animatedComponents = makeAnimated();

const AddGalButtonEmploye = () => {
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [iofg, setEmp] = useState([]);
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://api.ldap.groupe-hasnaoui.com/get/users/group/GSHA-NEW?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbiI6IkZvciBEU0kiLCJVc2VybmFtZSI6ImFjaG91cl9hciJ9.aMy1LUzKa6StDvQUX54pIvmjRwu85Fd88o-ldQhyWnE');
        const options = response.data.members.map(member => ({
          value: member,
          label: member
        }));
        setEmp(options);
      } catch (error) {
        console.error('There was an error fetching the options!', error);
        toast.error("Error fetching user data.");
      }
    };

    fetchUsers();
  }, []);

  const initialValues = {
    salaireEm: '',
    employe: [],
  };

  const validationSchema = Yup.object().shape({
    salaireEm: Yup.string().required('Il faut remplir le salaire'),
    employe: Yup.array()
      .test('unique', 'Vous ne pouvez sélectionner qu\'un employé', value => value.length <= 1)
      .min(1, 'Il faut remplir votre Chef de Projet')
      .required('Il faut remplir votre Chef de Projet'),
  });

  const onSubmit = async (values, { resetForm }) => {
 
    const employeAll = values.employe.map(item => item.value).join('-');
    const apiUrl = 'https://task.groupe-hasnaoui.com/api/employe@groupe/add';
    const requestData = {
      salaire: values.salaireEm,
      username: employeAll,
      trimestre:'trimestre 2'

    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data);
      }

      resetForm();
      toast.success('Employé a été bien Ajouté');
      setTimeout(() => {
        window.location.href = '';
      }, 3000);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error(`Error: ${JSON.stringify(error.message)}`);
    } finally {
     }
  };

  const handleCloseModalClick = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  };

  const CustomSelect = ({ field, form, options, isMulti }) => (
    <Select
      {...field}
      options={options}
      isMulti={isMulti}
      components={animatedComponents}
      onChange={option => form.setFieldValue(field.name, option)}
      value={field.value}
      onBlur={() => form.setFieldTouched(field.name, true)}
    />
  );

  return (
    <>
      <center>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Ajouter un Employé</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModalClick}></button>
              </div>
              <div className="modal-body">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} validateOnMount>
                  {({ isValid }) => (
                    <Form>
                      <div className="row">
                        <div className="col-lg-6">
                          <label htmlFor="employe" style={{ float: 'left' }}>Nom et Prénom de l'employé <span className='text-danger'>*</span></label>
                          <br />
                          <Field
                            name="employe"
                            component={CustomSelect}
                            options={iofg}
                            isMulti={true}
                          />
                          <ErrorMessage name="employe" component="div" className="text-danger" />
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="salaireEm" style={{ float: 'left' }}>Salaire <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><GoProjectRoadmap /></span>
                              <Field type="number" id="salaireEm" name="salaireEm" className="form-control" placeholder="Salaire" />
                            </div>
                            <ErrorMessage name="salaireEm" component="div" className="text-danger" />
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ marginTop: '250px' }}  >
                        Enregistrer
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-success projet-step m-2 addproject-step"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          <i className="fa fa-plus"></i> Ajouter un Employé
        </button>

        <ToastContainer />
      </center>
    </>
  );
}

export default AddGalButtonEmploye;
