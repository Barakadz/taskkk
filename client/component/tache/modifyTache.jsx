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
import { useSelector } from 'react-redux';

const animatedComponents = makeAnimated();

const ModifyTache = ({ id, titretach, niveau, DateDebut, dateFin, proj, equi, av, Descript }) => {
    const user = useSelector((state) => state.user);

    const [optionsPartic, setOptionsPartic] = useState([]);
    const [optionsProjet, setOptionsProjet] = useState([]);

    useEffect(() => {
        axios.get('https://api.ldap.groupe-hasnaoui.com/get/users/group/GSHA-NEW?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJUb2tlbiI6IkZvciBEU0kiLCJVc2VybmFtZSI6ImFjaG91cl9hciJ9.aMy1LUzKa6StDvQUX54pIvmjRwu85Fd88o-ldQhyWnE')
            .then(response => {
                const options = response.data.members.map(member => ({
                    value: member,
                    label: member
                }));
                setOptionsPartic(options);
                fetchOptionsProjet();
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                toast.error("Error fetching user data.");
            });
    }, []);

    const fetchOptionsProjet = async () => {
        try {
            const response = await fetch('https://task.groupe-hasnaoui.com/api/projet/projetmail', {
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
            console.error('Error fetching project options:', error);
            toast.error(`An error occurred: ${error.message}`);
        }
    };

    const removeQuotesAndBackslashes = (str) => str.replace(/["\\]/g, '');

    const initialValues = {
        titre_tache: titretach ? titretach.replace(/"/g, '') : '',
        dateDebut: DateDebut ? new Date(DateDebut).toISOString().split('T')[0] : '',
        dateFin: dateFin ? new Date(dateFin).toISOString().split('T')[0] : '',
        porjet: proj ? proj.split('-').map(ch => ({ value: removeQuotesAndBackslashes(ch), label: removeQuotesAndBackslashes(ch) })) : [],
        niveau: niveau || '',
        participant: equi ? equi.split('-').map(p => ({ value: removeQuotesAndBackslashes(p), label: removeQuotesAndBackslashes(p) })) : [],
        description: Descript ? Descript.replace(/"/g, '') : '',
        avance: av ? av.replace(/"/g, '') : '',
        level:  niveau ? niveau.replace(/"/g, '') : '',// Assurez-vous que level a une valeur par défaut valide ici
    };

    const validationSchema = Yup.object().shape({
        titre_tache: Yup.string().required('Titre de tache requis'),
        avance: Yup.string().required('Etat avancement requis'),
        dateDebut: Yup.date().required('Date de début requis').max(new Date(), "La date de début ne peut pas être dans le futur"),
        dateFin: Yup.date().required('Date de fin requis').min(Yup.ref('dateDebut'), 'La date de fin ne peut pas être avant la date de début'),
        porjet: Yup.array()
            .test('unique', 'Vous ne pouvez sélectionner qu\'un seul chef de projet', (value) => {
                return value.length <= 1;
            })
            .min(1, 'Chef de Projet requis')
            .required('Chef de Projet requis'),
        participant: Yup.array().min(1, 'Participant de Projet requis').required('Participant de Projet requis'),
        description: Yup.string().required('Description de Projet requis'),
        level: Yup.string().required('il est important de choisir le niveau de tache'), // Validation for the level select
    });

    const onSubmit = (values, { resetForm }) => {
        const ParticipantAll = values.participant.map(item => item.value).join('-');
        const proALL = values.porjet.map(item => item.value).join('-');

        const apiUrl = `https://task.groupe-hasnaoui.com/api/tache/${id}`;
        const requestData = {
            titre_tache: values.titre_tache,
            description: values.description,
            equipe: ParticipantAll,
            date_debut: values.dateDebut,
            date_fin: values.dateFin,
            etat: values.avance,
            projett: proALL,
            level: values.level // Include level in the request data
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
            toast.success('Tâche modifiée avec succès');
            resetForm();
            window.location.href = ''; // Redirect or refresh logic
        })
        .catch(error => {
            toast.error(`Erreur lors de la modification de la tâche: ${error.message}`);
        });
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

    const levelOptions = ['1', '2', '3', '4', '5'].map(level => ({
        value: level,
        label: level
    }));

    return (
        <>
            <center>
                <div className="modal fade" id="exampleModall" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Modifier Projet</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModalClick}></button>
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
                                                    name="porjet"
                                                    component={CustomSelect}
                                                    options={optionsProjet}
                                                    isMulti={true}
                                                />
                                                <ErrorMessage name="porjet" component="div" className="text-danger" />
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <label htmlFor="niveau" style={{ float: 'left' }}>Niveau <span className='text-danger'>*</span>:</label>
                                                    <div className="input-group mb-3">
                                                        <span className="input-group-text" id="basic-addon1"> </span>
                                                        <Field as="select" id="level" name="level" className="form-select">
                                                            <option value="">--choisir le niveau de tâche--</option>
                                                            {levelOptions.map((option) => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </Field>
                                                    </div>
                                                    <ErrorMessage name="level" component="div" className="text-danger" />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
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
                                                <button type="submit" className="btn btn-primary">Sauvegarder</button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </center>
        </>
    );
};

export default ModifyTache;
