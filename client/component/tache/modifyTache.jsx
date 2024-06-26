import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { GoProjectRoadmap } from "react-icons/go";
import { MdOutlineDateRange } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const animatedComponents = makeAnimated();

const ModifyTache = ({ id, titretach, niveau, DateDebut, dateFin, proj, equi, av, Descript }) => {
    const router = useRouter();
    const user = useSelector((state) => state.user);

    const [optionsPartic, setOptionsPartic] = useState([]);
    const [optionsProjet, setOptionsProjet] = useState([]);

    useEffect(() => {
        axios.get('https://api.ldap.groupe-hasnaoui.com/get/users/group/GSHA?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbiI6IkZvciBEU0kiLCJVc2VybmFtZSI6ImFjaG91cl9hciJ9.aMy1LUzKa6StDvQUX54pIvmjRwu85Fd88o-ldQhyWnE')
            .then(response => {
                const options = response.data.members.map(member => ({
                    value: member,
                    label: member
                }));
                setOptionsProjet(options);
                setOptionsPartic(options);
            })
            .catch(error => {
                console.error('There was an error fetching the options!', error);
                toast.error("Error fetching user data.");
            });
    }, []);
    const initialValues = {
        titre_tache: titretach ? titretach.replace(/"/g, '') : '',
        dateDebut: DateDebut ? new Date(DateDebut).toISOString().split('T')[0] : '',
        dateFin: dateFin ? new Date(dateFin).toISOString().split('T')[0] : '',
      
        porjet: proj ? proj.split('-').map(ch => ({ value: ch, label: ch })) : [],
        niveau: niveau ||'' ,
         participant: equi ? equi.split('-').map(p => ({ value: p, label: p })) : [],
        description: Descript ? Descript.replace(/"/g, '') : '',
        avance:av ? av.replace(/"/g, '') : '',
    };

    const validationSchema = Yup.object().shape({
        titre_tache: Yup.string().required('Il faut remplir votre Titre de tache'),
        avance: Yup.string().required('Il faut remplir votre avance avancement'),

        dateDebut: Yup.date().required('Il faut remplir Votre Date de début de projet').max(new Date(), "La date de début ne peut pas être dans le futur"),
        dateFin: Yup.date().required('Il faut remplir Votre Date de fin de projet').min(Yup.ref('dateDebut'), 'La date de fin ne peut pas être avant la date de début'),
        porjet: Yup.array().test('unique', 'Vous ne pouvez sélectionner qu\'un seul chef de projet', (value) => value.length <= 1)
            .min(1, 'Il faut remplir votre Chef de Projet')
            .required('Il faut remplir votre Chef de Projet'),
         participant: Yup.array().min(1, 'Il faut remplir votre participant de Projet').required('Il faut remplir votre participant de Projet'),
        description: Yup.string().required('Il faut remplir votre description de Projet'),
    });

    const onSubmit = (values, { resetForm }) => {
        const DirectionAll = values.direction.map(item => item.value).join('-');
        const FilialeAll = values.filiale.map(item => item.value).join('-');
        const ParticipantAll = values.participant.map(item => item.value).join('-');
        const ChefProjetAll = values.chefProjet.map(item => item.value).join('-');

        const apiUrl = `http://localhost:8800/api/projet/${id}`;
        const requestData = {
            titre_projet: values.titreProjet,
            description: values.description,
            chef_projet: ChefProjetAll,
            date_debut: values.dateDebut,
            date_fin: values.dateFin,
            departement: DirectionAll,
            filiale: FilialeAll,
            participant: ParticipantAll,
           
        };

        fetch(apiUrl, {
            method: 'PUT',
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
                toast.success('Le Projet à été bien Modifié');
                resetForm();
            })
            .catch(error => {
                toast.error('An error occurred:', error);
            });
    };

    const handleCloseModalClickk = () => {
        const modal = document.getElementById('exampleModall');
        if (modal) {
            modal.classList.remove('show');
            modal.style.display = 'none';
        }
    };

    const handleCloseModalClick = () => {
        const modal = document.getElementById('exampleModall');
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
        />
    );

    return (
        <>
             <center>
                <div className="modal fade" id="exampleModall" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Modifier Projet</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModalClickk}></button>
                            </div>
                            <div className="modal-body">
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
                                    {({ values, setFieldValue }) => (
                                        <Form className="row g-3">
                                      <div className="col-lg-4">
                                                <label htmlFor="titre_tache" className="form-label">Titre Tache <b className='text-danger'>*</b><GoProjectRoadmap size={30} style={{ marginLeft: "10px" }} /></label>
                                                <Field type="text" className="form-control" id="titre_tache" name="titre_tache" />
                                                <ErrorMessage name="titre_tache" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-lg-4">
                                                <label htmlFor="dateDebut" className="form-label">Date Début <b className='text-danger'>*</b> <MdOutlineDateRange size={30} style={{ marginLeft: "10px" }} /></label>
                                                <Field type="date" className="form-control" id="dateDebut" name="dateDebut" />
                                                <ErrorMessage name="dateDebut" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-lg-4">
                                                <label htmlFor="dateFin" className="form-label">Date Fin <b className='text-danger'>*</b><MdOutlineDateRange size={30} style={{ marginLeft: "10px" }} /></label>
                                                <Field type="date" className="form-control" id="dateFin" name="dateFin" />
                                                <ErrorMessage name="dateFin" component="div" className="text-danger" />
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
                                                <div className="form-group">
                                                    <label htmlFor="niveau" style={{ float: 'left' }}>Niveau <span className='text-danger'>*</span>:</label>
                                                    <div className="input-group mb-3">
                                                        <span className="input-group-text" id="basic-addon1"> </span>
                                                        <Field as="select" id="niveau" name="niveau" className="form-select">
                                                            <option value="">--choisir le niveau de tâche--</option>
                                                            {['1', '2', '3', '4', '5'].map((state) => (
                                                                <option key={state} value={state}>
                                                                    {state}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                    </div>
                                                    <ErrorMessage name="niveau" component="div" className="text-danger" />
                                                </div>
                                            </div>
                      
                            <div className="col-l-12">
                                                <label htmlFor="participant" className="form-label">Participant <b className='text-danger'>*</b></label>
                                                <Field name="participant" options={optionsPartic} component={CustomSelect} isMulti={true} />
                                                <ErrorMessage name="participant" component="div" className="text-danger" />
                                            </div> 


                                            <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="avance" style={{ float: 'left' }}>Etat avancement <span className='text-danger'>*</span></label>
                            <div className="input-group mb-2">
                              <span className="input-group-text"><GoProjectRoadmap /></span>
                              <Field type="number" id="avance" name="avance" max="100" className="form-control" placeholder="Etat de Avancement" />
                            </div>
                            <ErrorMessage name="avance" component="div" className="text-danger" />
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
                    
                        <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModalClick}>Fermer</button>
                                                <button type="submit" className="btn btn-primary">Enrigistré</button>
                                            </div>
                                        </Form>
                            )}
                        </Formik>  </div>
                           
                        </div>
                    </div>  
                </div>
                <ToastContainer />
            </center>
        </>
    );
};

export default ModifyTache;
