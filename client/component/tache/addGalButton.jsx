import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoProjectRoadmap } from "react-icons/go";
import { MdOutlineDateRange } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useRouter } from 'next/router';
import { FaRegStar } from "react-icons/fa";

const animatedComponents = makeAnimated();

const AddGalButton = () => {
  const router = useRouter();
  const [optionsPartic, setOptionsPartic] = useState([]);
  const [optionsProjet, setOptionsProjet] = useState([]);

  const fetchOptionsProjet = async () => {
    try {
      const response = await fetch('http://localhost:8800/api/projet/projetmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail: 'ibrahim.baraka@groupe-hasnaoui.com' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const options = data.map(item => ({
        value: item.titre_projet,
        label: item.titre_projet
      }));

      setOptionsProjet(options);
    } catch (error) {
      console.error('There was an error fetching the options!', error);
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get('https://api.ldap.groupe-hasnaoui.com/get/users/group/GSHA?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbiI6IkZvciBEU0kiLCJVc2VybmFtZSI6ImFjaG91cl9hciJ9.aMy1LUzKa6StDvQUX54pIvmjRwu85Fd88o-ldQhyWnE');
        const options = response.data.members.map(member => ({
          value: member,
          label: member
        }));
        setOptionsPartic(options);
      } catch (error) {
        console.error('There was an error fetching the options!', error);
        toast.error("Error fetching user data.");
      }
    };

    fetchOptions();
    fetchOptionsProjet();
  }, []);

  const initialValues = {
    titreTache: '',
    dateDebut: '',
    dateFin: '',
    projet: [],
    participant: [],
    description: '',
    etat: '',
    niveau:''
  };

  const validationSchema = Yup.object().shape({
    niveau: Yup.string().required('Il faut remplir votre Niveau de Tache'),
    titreTache: Yup.string().required('Il faut remplir votre Titre de Tache'),
    dateDebut: Yup.date().required('Il faut remplir Votre Date de début de projet').max(new Date(), "La date de début ne peut pas être dans le futur"),
    dateFin: Yup.date().required('Il faut remplir Votre Date de fin de projet').min(Yup.ref('dateDebut'), 'La date de fin ne peut pas être avant la date de début'),
     projet: Yup.array()
    .test('unique', 'Vous ne pouvez sélectionner qu\'un seul chef de projet', (value) => {
      return value.length <= 1;
    })
    .min(1, 'Il faut remplir votre Chef de Projet')
    .required('Il faut remplir votre Chef de Projet'),
    participant: Yup.array().min(1, 'Il faut remplir votre participant de Projet').required('Il faut remplir votre participant de Projet'),
    description: Yup.string().required('Il faut remplir votre description de Projet'),
    etat: Yup.string().required("Il faut remplir votre Etat d'avancement de Projet"),
  });

  const onSubmit = (values, { resetForm }) => {
    const ParticipantAll = values.participant.map(item => item.value).join('-');
    const ProjetAll = values.projet.map(item => item.value).join('-');

    const apiUrl = 'http://localhost:8800/api/tache/add';
    const requestData = {
      level: values.niveau,

      titre_tache: values.titreTache,
      description: values.description,
      etat: values.etat,
      date_debut: values.dateDebut,
      date_fin: values.dateFin,
      equipe: ParticipantAll,
      tache: '0',
      mail: 'ibrahim.baraka@groupe-hasnaoui.com'
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
        toast.success('La Tache à été bien Ajouté');
        setTimeout(() => {
          window.location.href = '';
        }, 3000);
      })
      .catch(error => {
        toast.error(`An error occurred: ${error.message}`);
      });
  };

  const handleCloseModalClick = () => {
    const modal = document.getElementById('exampleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  };

  const CustomSelect = ({ field, form, options, isMulti }) => {
    return (
      <Select
        {...field}
        options={options}
        isMulti={isMulti}
        components={animatedComponents}
        onChange={option => form.setFieldValue(field.name, option)}
        value={field.value}
      />
    );
  };

  return (
    <>
      <center>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Ajouter Tache</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModalClick}></button>
              </div>
              <div className="modal-body">
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} validateOnMount>
                  {({ setFieldValue }) => (
                    <Form>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="titreTache" style={{ float: 'left' }}>Titre de Tache <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><GoProjectRoadmap /></span>
                              <Field type="text" id="titreTache" name="titreTache" className="form-control" placeholder="Titre de tache" />
                            </div>
                            <ErrorMessage name="titreTache" component="div" className="text-danger" />
                          </div>
                        </div>
                        <div className="col-lg-6">
                        <div className="form-group">
                          <label htmlFor="niveau" style={{ float: 'left' }}>Niveau <span className='text-danger'>*</span>:</label>
                          <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1"><FaRegStar /></span>
                            <Field as="select" id="niveau" name="niveau" className="form-select">
                              <option value="">--choisir le niveau de projet--</option>
                              {['1', '2', '3', '4', '5'].map((state) => (
                                <option key={state} value={state}>
                                  {state}
                                </option>
                              ))}
                            </Field>
                          </div>
                          <p  ><ErrorMessage name="niveau"component="div" className="text-danger" /></p>
                        </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="dateDebut" style={{ float: 'left' }}>Date début <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><MdOutlineDateRange /></span>
                              <Field type="date" id="dateDebut" name="dateDebut" className="form-control" placeholder="Date début" />
                            </div>
                            <ErrorMessage name="dateDebut" component="div" className="text-danger" />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="dateFin" style={{ float: 'left' }}>Date Fin <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><MdOutlineDateRange /></span>
                              <Field type="date" id="dateFin" name="dateFin" className="form-control" placeholder="Date Fin" />
                            </div>
                            <ErrorMessage name="dateFin" component="div" className="text-danger" />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <label htmlFor="projet" style={{ float: 'left' }}>Projet <span className='text-danger'>*</span></label>
                          <br />
                          <Field
                            name="projet"
                            component={CustomSelect}
                            options={optionsProjet}
                            isMulti={true}
                          />
                          <ErrorMessage name="projet" component="div" className="text-danger" />
                        </div>
                        <div className="col-lg-6">
                          <label htmlFor="participant" style={{ float: 'left' }}>Equipe <span className='text-danger'>*</span></label>
                          <br />
                          <Field
                            name="participant"
                            component={CustomSelect}
                            options={optionsPartic}
                            isMulti={true}
                          />
                          <ErrorMessage name="participant" component="div" className="text-danger" />
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="etat" style={{ float: 'left' }}>Etat avancement <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><GoProjectRoadmap /></span>
                              <Field type="number" id="etat" name="etat" max="100" className="form-control" placeholder="Etat de Avancement" />
                            </div>
                            <ErrorMessage name="etat" component="div" className="text-danger" />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group">
                            <label htmlFor="description" style={{ float: 'left' }}>Description <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><TbFileDescription /></span>
                              <Field as="textarea" id="description" name="description" className="form-control" placeholder="Description" rows="4" />
                            </div>
                            <ErrorMessage name="description" component="div" className="text-danger" />
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary">Enregistrer</button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
        <button type="button" className="btn btn-success projet-step m-2" data-bs-toggle="modal" data-bs-target="#exampleModal">
          <i className="fa fa-plus"></i> Ajouter une tache
        </button>
        <ToastContainer />
      </center>
    </>
  );
}

export default AddGalButton;
